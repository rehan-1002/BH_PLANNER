export function toggleThemeWithTransition(
  theme: "dark" | "light",
  setTheme: (newTheme: "dark" | "light") => void,
  event?: React.MouseEvent
): void {
  const newTheme = theme === "dark" ? "light" : "dark";

  if (
    typeof document === "undefined" ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(newTheme);
    applyThemeClass(newTheme);
    return;
  }

  const x = event?.clientX ?? window.innerWidth - 40;
  const y = event?.clientY ?? 40;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const doc = document as any;
  const transition = doc.startViewTransition(() => {
    setTheme(newTheme);
    applyThemeClass(newTheme);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 350,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}

export function applyThemeClass(theme: "dark" | "light"): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  try {
    localStorage.setItem("bh_theme", theme);
  } catch {
    // Storage access might be restricted
  }
}
