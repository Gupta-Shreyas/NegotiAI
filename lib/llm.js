// lib/llm.js
// Single point of contact with the LLM provider.
// If you ever want to swap Groq for Gemini/OpenAI/etc, this is the only file to touch.

import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";
const isConfigured = Boolean(apiKey && !apiKey.startsWith("gsk_placeholder"));
const groq = isConfigured ? new Groq({ apiKey }) : null;

const MODEL = "openai/gpt-oss-120b";

const MAX_RETRIES = 1; // 1 retry on real transient errors
const RETRY_BASE_DELAY_MS = 400;
const CALL_TIMEOUT_MS = 6000;

function withTimeout(promise, ms) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("LLM call timed out")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

/**
 * Sends a single-turn prompt to the LLM and returns plain text.
 * If no API key is configured or Groq returns 401, it returns fallbackText immediately
 * without hanging or wasting time on useless retries.
 */
export async function callLLM(systemPrompt, userPrompt, maxTokens = 300, fallbackText = "") {
  if (!isConfigured || !groq) {
    return fallbackText;
  }

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
          max_tokens: maxTokens + 200,
          reasoning_effort: "low",
          temperature: 0.8,
        }),
        CALL_TIMEOUT_MS
      );

      const content = completion.choices[0]?.message?.content?.trim();

      if (!content) {
        lastError = new Error("Empty LLM response");
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_BASE_DELAY_MS * (attempt + 1));
          continue;
        }
        break;
      }

      return content;
    } catch (err) {
      lastError = err;

      // 401 Unauthorized or invalid key -> NEVER retry, return fallback immediately
      if (err?.status === 401) {
        console.warn("Groq API key invalid or unauthorized; using domain fallback narration.");
        return fallbackText;
      }

      const isRateLimit = err?.status === 429;
      console.warn(
        `LLM call attempt ${attempt + 1} failed${isRateLimit ? " [rate limit]" : ""}:`,
        err?.message || err
      );

      if (attempt < MAX_RETRIES) {
        const backoff = (isRateLimit ? RETRY_BASE_DELAY_MS * 2 : RETRY_BASE_DELAY_MS) * (attempt + 1);
        await delay(backoff);
        continue;
      }
    }
  }

  return fallbackText;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}