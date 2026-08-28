"use client";

import { useRef, useCallback } from "react";

export default function MagneticButton({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
  as: Component = "button",
  ...props
}) {
  const buttonRef = useRef(null);
  const rafId = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled || !buttonRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    rectRef.current = buttonRef.current.getBoundingClientRect();
  }, [disabled]);

  const handleMouseMove = useCallback((e) => {
    if (disabled || !buttonRef.current || !rectRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const rect = rectRef.current;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    const maxDisplacement = 3.5;
    const moveX = (distanceX / (rect.width / 2)) * maxDisplacement;
    const moveY = (distanceY / (rect.height / 2)) * maxDisplacement;

    rafId.current = requestAnimationFrame(() => {
      if (buttonRef.current) {
        buttonRef.current.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0) scale(1.015)`;
      }
    });
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rectRef.current = null;
    if (buttonRef.current) {
      buttonRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
    }
  }, []);

  return (
    <Component
      ref={buttonRef}
      type={Component === "button" ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
        willChange: "transform",
      }}
      className={`inline-flex items-center justify-center select-none ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
