"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ThemeToggle } from "@/components/theme-toggle";

interface MenuItem {
  name: string;
  href: string;
  shape: string;
  tag: string;
}

const menuItems: MenuItem[] = [
  { name: "Overview", href: "/dashboard/overview", shape: "1", tag: "01" },
  { name: "Schedule", href: "/dashboard/schedule", shape: "2", tag: "02" },
  { name: "Syllabus", href: "/dashboard/syllabus", shape: "3", tag: "03" },
  { name: "Copilot", href: "/dashboard/copilot", shape: "4", tag: "04" },
  { name: "Calendar", href: "/dashboard/calendar", shape: "5", tag: "05" },
];

/**
 * Sterling Gate: Kinetic Navigation
 * Direct 1:1 Implementation of https://21st.dev/@hardikkashiyani123456788/components/sterling-gate-kinetic-navigation
 */
export function KineticNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Initialize GSAP defaults and shape hover physics
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    } catch {
      // fallback
    }

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll<HTMLElement>(".sg-menu-list-item[data-shape]");
      const ambientShapes = containerRef.current?.querySelector<HTMLElement>(".sg-ambient-shapes");

      items?.forEach((item) => {
        const shapeId = item.getAttribute("data-shape");
        const targetShape = ambientShapes?.querySelector<HTMLElement>(`.sg-bg-shape-${shapeId}`);
        if (!targetShape) return;

        const shapeElements = targetShape.querySelectorAll(".sg-shape-element");

        const onEnter = () => {
          ambientShapes?.querySelectorAll(".sg-bg-shape").forEach((s) => s.classList.remove("active"));
          targetShape.classList.add("active");
          gsap.fromTo(
            shapeElements,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(shapeElements, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => targetShape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        (item as any)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current?.querySelectorAll<HTMLElement>(".sg-menu-list-item[data-shape]").forEach((el) => {
        if ((el as any)._cleanup) (el as any)._cleanup();
      });
    };
  }, []);

  // Animate menu open and close state with GSAP Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const overlayWrapper = containerRef.current?.querySelector<HTMLElement>(".sg-nav-overlay-wrapper");
      const tl = gsap.timeline();

      if (isOpen) {
        if (overlayWrapper) overlayWrapper.setAttribute("data-nav", "open");
        tl.set(".sg-nav-overlay-wrapper", { display: "block" })
          .set(".sg-menu-content", { xPercent: 0 }, "<")
          .fromTo(".sg-nav-close-btn p", { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(".sg-menu-button-icon", { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(".sg-overlay", { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(".sg-backdrop-layer", { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
          .fromTo(".sg-nav-link", { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35")
          .fromTo("[data-menu-fade]", { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" }, "<+=0.2");
      } else {
        if (overlayWrapper) overlayWrapper.setAttribute("data-nav", "closed");
        tl.to(".sg-overlay", { autoAlpha: 0 })
          .to(".sg-menu-content", { xPercent: 120 }, "<")
          .to(".sg-nav-close-btn p", { yPercent: 0 }, "<")
          .to(".sg-menu-button-icon", { rotate: 0 }, "<")
          .set(".sg-nav-overlay-wrapper", { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div ref={containerRef} className="sg-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

        /* Sterling Gate Root Variables */
        .sg-root {
          --color-primary: #8b5cf6;
          --color-dark: #120e1f;
          --color-neutral-100: #f8f7fc;
          --color-neutral-200: #e2dcf0;
          --color-neutral-300: #ffffff;
          --color-neutral-800: #8b5cf6;
          --gap: 1.25em;
          --container-padding: 2em;
          --cubic-default: cubic-bezier(0.65, 0.05, 0, 1);
        }

        html.dark .sg-root {
          --color-primary: #8b5cf6;
          --color-dark: #f3f0f9;
          --color-neutral-100: #1a1526;
          --color-neutral-200: #251e36;
          --color-neutral-300: #0d0b14;
          --color-neutral-800: #6d28d9;
        }

        .sg-site-header-wrapper {
          z-index: 50;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          pointer-events: none;
        }

        .sg-header {
          z-index: 110;
          padding-top: var(--gap);
          padding-bottom: var(--gap);
          position: relative;
          width: 100%;
          transition: background-color 0.3s;
        }

        .sg-container {
          z-index: 1;
          max-width: 100%;
          padding-left: var(--container-padding);
          padding-right: var(--container-padding);
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          position: relative;
        }

        .sg-nav-row {
          justify-content: space-between;
          align-items: center;
          width: 100%;
          display: flex;
        }

        .sg-nav-logo-row {
          pointer-events: auto;
          justify-content: flex-start;
          align-items: center;
          text-decoration: none;
          display: flex;
          gap: 0.75rem;
        }

        .sg-logo-text {
          color: var(--color-dark);
          letter-spacing: -0.02em;
          font-size: 1.15rem;
          font-weight: 700;
          font-family: inherit;
        }

        .sg-nav-row-right {
          column-gap: 1rem;
          row-gap: 0.625rem;
          pointer-events: auto;
          justify-content: flex-end;
          align-items: center;
          display: flex;
        }

        .sg-nav-toggle-label {
          align-items: center;
          gap: 0.5em;
          margin-right: 0.5em;
          display: flex;
          user-select: none;
        }

        .sg-toggle-text {
          color: var(--color-dark);
          opacity: 0.85;
          font-family: 'Caveat', cursive, Georgia, serif;
          font-size: 1.65rem;
          font-weight: 700;
          transition: color 0.3s;
        }

        .sg-nav-close-btn {
          column-gap: 0.875em;
          row-gap: 0.875em;
          color: var(--color-dark);
          background-color: transparent;
          border: none;
          justify-content: flex-end;
          align-items: center;
          padding: 0.5em 0.85em;
          font-size: 1.15rem;
          display: flex;
          cursor: pointer;
          border-radius: 9999px;
          transition: background-color 0.25s ease;
        }

        .sg-nav-close-btn:hover {
          background-color: rgba(139, 92, 246, 0.12);
        }

        .sg-nav-close-btn:hover .sg-icon-wrap {
          transform: rotate(90deg);
        }

        .sg-menu-button-text {
          flex-flow: column;
          justify-content: flex-start;
          align-items: flex-end;
          height: 1.5em;
          display: flex;
          overflow: hidden;
        }

        .sg-menu-button-text .sg-p-large {
          font-size: 1.25em;
          font-weight: 600;
          line-height: 1.5em;
          margin: 0;
          color: var(--color-dark);
        }

        .sg-icon-wrap {
          transition: transform 0.4s cubic-bezier(0.65, 0.05, 0, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sg-menu-button-icon {
          width: 1.4em;
          height: 1.4em;
        }

        /* Fullscreen Menu Overlay Container */
        .sg-fullscreen-menu-container {
          position: relative;
        }

        .sg-nav-overlay-wrapper {
          z-index: 100;
          width: 100%;
          height: 100dvh;
          margin-left: auto;
          margin-right: auto;
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .sg-nav-overlay-wrapper[data-nav="open"] {
          display: block;
        }

        .sg-overlay {
          z-index: 0;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(8px);
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .sg-menu-content {
          padding-bottom: 2em;
          padding-top: calc(3 * 2em);
          flex-flow: column;
          justify-content: space-between;
          align-items: flex-start;
          width: 35em;
          max-width: 100%;
          height: 100%;
          margin-left: auto;
          position: relative;
          overflow: auto;
          z-index: 1;
        }

        .sg-menu-bg {
          z-index: 0;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }

        .sg-backdrop-layer {
          z-index: 0;
          background-color: var(--color-neutral-300);
          border-top-left-radius: 1.25em;
          border-bottom-left-radius: 1.25em;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          box-shadow: -15px 0 50px rgba(0, 0, 0, 0.35);
        }

        .sg-backdrop-layer.first {
          background-color: var(--color-primary);
        }

        .sg-backdrop-layer.second {
          background-color: var(--color-neutral-100);
        }

        .sg-menu-content-wrapper {
          z-index: 1;
          flex-flow: column;
          justify-content: space-between;
          align-items: flex-start;
          height: 100%;
          display: flex;
          position: relative;
          overflow: auto;
          width: 100%;
          padding-top: 1rem;
        }

        .sg-menu-list {
          flex-flow: column;
          width: 100%;
          margin-bottom: 0;
          padding-left: 0;
          list-style: none;
          display: flex;
        }

        .sg-menu-list-item {
          position: relative;
          overflow: hidden;
        }

        .sg-nav-link {
          padding-top: 0.8em;
          padding-bottom: 0.8em;
          padding-left: 2em;
          padding-right: 2em;
          column-gap: 0.75em;
          row-gap: 0.75em;
          width: 100%;
          color: var(--color-dark);
          text-decoration: none;
          display: flex;
          align-items: baseline;
          position: relative;
          transition: color 0.4s;
        }

        .sg-nav-link:hover {
          color: #ffffff;
        }

        .sg-nav-link-tag {
          font-family: monospace;
          font-size: 0.85rem;
          color: var(--color-primary);
          font-weight: 700;
          z-index: 1;
          margin-right: 0.5rem;
          opacity: 0.8;
          transition: transform 0.4s ease;
        }

        .sg-nav-link:hover .sg-nav-link-tag {
          transform: translateX(4px);
          color: #ffffff;
        }

        .sg-nav-link-text {
          z-index: 1;
          text-transform: uppercase;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          font-size: clamp(2.6rem, 7vw, 4.5rem);
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -0.03em;
          transition: transform 0.55s cubic-bezier(0.65, 0.05, 0, 1);
          position: relative;
          text-shadow: 0px 1.1em 0px var(--color-neutral-200);
          margin: 0;
        }

        html.dark .sg-nav-link-text {
          text-shadow: 0px 1.1em 0px var(--color-neutral-200);
        }

        .sg-nav-link:hover .sg-nav-link-text {
          transition-delay: 0.08s;
          transform: translateY(-1.1em);
        }

        .sg-nav-link-hover-bg {
          z-index: 0;
          background-color: var(--color-neutral-800);
          transform-origin: 50% 100%;
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.65, 0.05, 0, 1);
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: scaleY(0);
        }

        .sg-nav-link:hover .sg-nav-link-hover-bg {
          transform: scale(1);
        }

        /* Ambient Geometric Shapes in Drawer */
        .sg-ambient-shapes {
          z-index: 1;
          pointer-events: none;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
        }

        .sg-bg-shape {
          opacity: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.5s;
          position: absolute;
        }

        .sg-bg-shape.active {
          opacity: 1;
        }

        .sg-shape-element {
          transform-origin: 50%;
        }

        /* Menu Footer Details */
        .sg-menu-details {
          padding-left: 2em;
          padding-right: 2em;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 2rem;
        }

        .sg-menu-details-spec {
          font-family: monospace;
          font-size: 0.75rem;
          color: var(--color-dark);
          opacity: 0.65;
          letter-spacing: 0.05em;
        }

        .sg-menu-details-status {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: monospace;
          font-size: 0.72rem;
        }

        /* Responsive Breakpoints */
        @media screen and (max-width: 767px) {
          .sg-nav-row-right {
            column-gap: 0.5rem;
          }
          .sg-nav-toggle-label {
            gap: 0.25em;
            margin-right: 0.25em;
          }
          .sg-toggle-text {
            font-size: 1.3rem;
          }
          .sg-menu-content {
            padding-top: calc(5 * 1.5em);
            width: 100%;
          }
          .sg-backdrop-layer {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
          .sg-nav-link {
            padding-left: 1.25em;
            padding-right: 1.25em;
          }
          .sg-nav-link-text {
            font-size: 2.8rem;
          }
        }
      `}</style>

      {/* 1. FIXED TOP NAVIGATION BAR */}
      <div className="sg-site-header-wrapper">
        <header className="sg-header">
          <div className="sg-container">
            <nav className="sg-nav-row">
              {/* Left Brand Badge */}
              <Link
                href="/dashboard/overview"
                aria-label="BH Planner Dashboard"
                className="sg-nav-logo-row"
              >
                <div className="flex items-center justify-center size-9 rounded-xl glass-panel overflow-hidden border border-panel-border shadow-sm">
                  <img
                    src="/BH LOGO.webp"
                    alt="BH Logo"
                    className="size-6 object-contain"
                  />
                </div>
                <span className="sg-logo-text">BH PLANNER</span>
              </Link>

              {/* Right Controls: Theme Toggle + "click me" + Menu Trigger */}
              <div className="sg-nav-row-right">
                <ThemeToggle />

                <div
                  className="sg-nav-toggle-label"
                  onClick={toggleMenu}
                  style={{ cursor: "pointer", pointerEvents: "auto" }}
                >
                  <span className="sg-toggle-text">click me</span>
                </div>

                <button
                  type="button"
                  role="button"
                  className="sg-nav-close-btn"
                  onClick={toggleMenu}
                  style={{ pointerEvents: "auto" }}
                  aria-label={isOpen ? "Close Sterling Gate Navigation" : "Open Sterling Gate Navigation"}
                >
                  <div className="sg-menu-button-text">
                    <p className="sg-p-large">Menu</p>
                    <p className="sg-p-large">Close</p>
                  </div>
                  <div className="sg-icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="sg-menu-button-icon"
                    >
                      <path
                        d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      {/* 2. FULLSCREEN STERLING GATE REVEAL LAYER */}
      <section className="sg-fullscreen-menu-container">
        <div data-nav="closed" className="sg-nav-overlay-wrapper">
          <div className="sg-overlay" onClick={closeMenu} />
          <nav className="sg-menu-content">
            {/* 3 Staggered Backdrop Panels & Ambient Geometric Shapes */}
            <div className="sg-menu-bg">
              <div className="sg-backdrop-layer first" />
              <div className="sg-backdrop-layer second" />
              <div className="sg-backdrop-layer" />

              <div className="sg-ambient-shapes">
                {/* Shape 1: Orbiting Circles */}
                <svg className="sg-bg-shape sg-bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="sg-shape-element" cx="80" cy="120" r="40" fill="rgba(139,92,246,0.22)" />
                  <circle className="sg-shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.18)" />
                  <circle className="sg-shape-element" cx="200" cy="300" r="80" fill="rgba(167,139,250,0.15)" />
                  <circle className="sg-shape-element" cx="350" cy="280" r="30" fill="rgba(139,92,246,0.22)" />
                </svg>

                {/* Shape 2: Sinusoidal Waves */}
                <svg className="sg-bg-shape sg-bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="sg-shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(139,92,246,0.26)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="sg-shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(167,139,250,0.2)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Constellation Dot Matrix */}
                <svg className="sg-bg-shape sg-bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="sg-shape-element" cx="50" cy="50" r="8" fill="rgba(139,92,246,0.3)" />
                  <circle className="sg-shape-element" cx="150" cy="50" r="8" fill="rgba(167,139,250,0.3)" />
                  <circle className="sg-shape-element" cx="250" cy="50" r="8" fill="rgba(139,92,246,0.3)" />
                  <circle className="sg-shape-element" cx="350" cy="50" r="8" fill="rgba(167,139,250,0.3)" />
                  <circle className="sg-shape-element" cx="100" cy="150" r="12" fill="rgba(139,92,246,0.25)" />
                  <circle className="sg-shape-element" cx="200" cy="150" r="12" fill="rgba(167,139,250,0.25)" />
                  <circle className="sg-shape-element" cx="300" cy="150" r="12" fill="rgba(139,92,246,0.25)" />
                  <circle className="sg-shape-element" cx="50" cy="250" r="10" fill="rgba(139,92,246,0.3)" />
                  <circle className="sg-shape-element" cx="150" cy="250" r="10" fill="rgba(167,139,250,0.3)" />
                  <circle className="sg-shape-element" cx="250" cy="250" r="10" fill="rgba(139,92,246,0.3)" />
                  <circle className="sg-shape-element" cx="350" cy="250" r="10" fill="rgba(167,139,250,0.3)" />
                  <circle className="sg-shape-element" cx="100" cy="350" r="6" fill="rgba(139,92,246,0.3)" />
                  <circle className="sg-shape-element" cx="200" cy="350" r="6" fill="rgba(167,139,250,0.3)" />
                  <circle className="sg-shape-element" cx="300" cy="350" r="6" fill="rgba(139,92,246,0.3)" />
                </svg>

                {/* Shape 4: Kinetic Morph Curves */}
                <svg className="sg-bg-shape sg-bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="sg-shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(139,92,246,0.18)"
                  />
                  <path
                    className="sg-shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(167,139,250,0.14)"
                  />
                </svg>

                {/* Shape 5: Velocity Angles */}
                <svg className="sg-bg-shape sg-bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line
                    className="sg-shape-element"
                    x1="0"
                    y1="100"
                    x2="300"
                    y2="400"
                    stroke="rgba(139,92,246,0.22)"
                    strokeWidth="30"
                  />
                  <line
                    className="sg-shape-element"
                    x1="100"
                    y1="0"
                    x2="400"
                    y2="300"
                    stroke="rgba(167,139,250,0.18)"
                    strokeWidth="25"
                  />
                  <line
                    className="sg-shape-element"
                    x1="200"
                    y1="0"
                    x2="400"
                    y2="200"
                    stroke="rgba(139,92,246,0.14)"
                    strokeWidth="20"
                  />
                </svg>
              </div>
            </div>

            {/* Links and Footer Content */}
            <div className="sg-menu-content-wrapper">
              <ul className="sg-menu-list">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard/overview" && pathname.startsWith(item.href));

                  return (
                    <li key={item.href} className="sg-menu-list-item" data-shape={item.shape}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="sg-nav-link"
                      >
                        <span className="sg-nav-link-tag">{item.tag}</span>
                        <p
                          className="sg-nav-link-text"
                          style={isActive ? { color: "var(--color-primary)" } : {}}
                        >
                          {item.name}
                        </p>
                        <div className="sg-nav-link-hover-bg" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="sg-menu-details" data-menu-fade="true">
                <span className="sg-menu-details-spec">
                  BH PLANNER · STERLING GATE ARCHITECTURE
                </span>
                <div className="sg-menu-details-status">
                  <span className="text-accent font-semibold">Tier-1 Deterministic</span>
                  <span className="opacity-40">·</span>
                  <span className="opacity-70">Esc to Close</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default KineticNav;
