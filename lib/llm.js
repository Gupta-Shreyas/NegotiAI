// lib/llm.js
// Single point of contact with the LLM provider.
// If you ever want to swap Groq for Gemini/OpenAI/etc, this is the only file to touch.

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "openai/gpt-oss-120b";

const MAX_RETRIES = 2; // total attempts = 1 + MAX_RETRIES
const RETRY_BASE_DELAY_MS = 500;
const CALL_TIMEOUT_MS = 12000; // don't let one hung call stall the whole demo

/**
 * Wraps a promise with a hard timeout so a hung Groq call can't stall
 * the negotiation indefinitely.
 */
function withTimeout(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("LLM call timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

/**
 * Sends a single-turn prompt to the LLM and returns plain text.
 * Retries on transient failures (rate limit, network error, empty response,
 * timeout) with short backoff. Never throws — on total failure it returns
 * a caller-supplied fallback string so one flaky turn can't crash the demo.
 *
 * @param {string} systemPrompt - persona / role instructions
 * @param {string} userPrompt - the actual message/context for this turn
 * @param {number} maxTokens
 * @param {string} fallbackText - returned if every retry attempt fails
 */
export async function callLLM(systemPrompt, userPrompt, maxTokens = 300, fallbackText = "") {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await withTimeout(
        groq.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          // gpt-oss models spend part of max_tokens on internal reasoning before
          // writing the visible answer — give it headroom and keep reasoning short,
          // or the visible content can come back empty.
          max_tokens: maxTokens + 200,
          reasoning_effort: "low",
          temperature: 0.8,
        }),
        CALL_TIMEOUT_MS
      );

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        console.warn(
          `Empty content from LLM (attempt ${attempt + 1}/${MAX_RETRIES + 1}).`
        );
        lastError = new Error("Empty LLM response");
        // treat empty content like a failure worth retrying
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_BASE_DELAY_MS * (attempt + 1));
          continue;
        }
        break;
      }

      return content;
    } catch (err) {
      lastError = err;
      const isRateLimit = err?.status === 429;
      console.warn(
        `LLM call failed (attempt ${attempt + 1}/${MAX_RETRIES + 1})${isRateLimit ? " [rate limited]" : ""
        }:`,
        err?.message || err
      );

      if (attempt < MAX_RETRIES) {
        // rate limits get a slightly longer backoff than other errors
        const backoff = (isRateLimit ? RETRY_BASE_DELAY_MS * 2 : RETRY_BASE_DELAY_MS) * (attempt + 1);
        await delay(backoff);
        continue;
      }
    }
  }

  console.error("LLM call exhausted all retries, using fallback text.", lastError?.message);
  return fallbackText;
}

/**
 * Small delay helper — Groq free tier is fast but still rate-limited per minute.
 * Call this between agent turns in the orchestrator to avoid 429s.
 */
export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}