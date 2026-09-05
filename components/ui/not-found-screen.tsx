"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, WifiOff, UserX, RefreshCw, LogIn, UserPlus } from "lucide-react";

type NotFoundMode = "default" | "deleted" | "offline";

interface NotFoundScreenProps {
  initialReason?: string;
}

export function NotFoundScreen({ initialReason }: NotFoundScreenProps) {
  return (
    <div className="w-full h-screen bg-black overflow-x-hidden flex justify-center items-center relative select-none">
      <MessageDisplay initialReason={initialReason} />
      <CharactersAnimation />
      <CircleAnimation />
    </div>
  );
}

// 1. Message Display Component with Mode Detection (Deleted, Offline, 404)
function MessageDisplay({ initialReason }: { initialReason?: string }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<NotFoundMode>("default");

  useEffect(() => {
    // 1. Connection check function
    const evaluateConnection = () => {
      if (typeof window !== "undefined") {
        if (!navigator.onLine) {
          setMode("offline");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const reasonParam = initialReason || params.get("reason") || params.get("error");

        if (reasonParam === "offline" || reasonParam === "no_internet") {
          setMode("offline");
        } else if (
          reasonParam === "deleted" ||
          reasonParam === "account_deleted" ||
          reasonParam === "revoked"
        ) {
          setMode("deleted");
        } else {
          setMode("default");
        }
      }
    };

    evaluateConnection();

    // 2. Real-time online/offline event listeners
    const handleOffline = () => setMode("offline");
    const handleOnline = () => {
      // Auto-redirect to dashboard when connection restores!
      window.location.href = "/dashboard/overview";
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // 3. Periodic liveness ping when in offline mode to detect immediate reconnection
    const pingInterval = setInterval(() => {
      if (typeof window !== "undefined" && navigator.onLine && mode === "offline") {
        window.location.href = "/dashboard/overview";
      }
    }, 1500);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(pingInterval);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [initialReason, mode]);

  // Mode-specific content configurations
  let badge = "ERROR 404";
  let title = "Page Not Found";
  let code = "404";
  let description =
    "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.";

  if (mode === "deleted") {
    badge = "ACCOUNT TERMINATED IN SUPABASE";
    title = "Account Not Found";
    code = "404";
    description =
      "Your account credentials have been removed from Supabase, or your authorization session was invalidated. Please register a new account or sign in to resume.";
  } else if (mode === "offline") {
    badge = "NO INTERNET CONNECTION";
    title = "No Internet";
    code = "NO INTERNET";
    description =
      "Please check your network connection. You will be automatically redirected to your planner as soon as your connection is restored.";
  }

  return (
    <div className="absolute flex flex-col justify-center items-center w-[90%] h-[90%] z-[100] pointer-events-none">
      <div
        className={`flex flex-col items-center transition-all duration-700 pointer-events-auto ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Context Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-black/10 border border-black/20 text-black text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
          {mode === "deleted" && <UserX className="w-3.5 h-3.5" />}
          {mode === "offline" && <WifiOff className="w-3.5 h-3.5" />}
          <span>{badge}</span>
        </div>

        {/* Title */}
        <div className="text-[28px] sm:text-[38px] font-bold text-black text-center tracking-tight leading-tight m-[1%]">
          {title}
        </div>

        {/* Giant Status Code */}
        <div className="text-[64px] sm:text-[96px] font-extrabold text-black tracking-tighter m-[0.5%] font-mono leading-none">
          {code}
        </div>

        {/* Explanation */}
        <div className="text-[13px] sm:text-[15px] w-[90%] max-w-lg text-center text-black/80 font-medium m-[1%] leading-relaxed">
          {description}
        </div>

        {/* Action Buttons tailored to each scenario */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {mode === "deleted" ? (
            <>
              <Link
                href="/auth?mode=signup"
                className="bg-black text-white hover:bg-gray-900 transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 shadow-md active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Account</span>
              </Link>
              <Link
                href="/auth?mode=signin"
                className="text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </>
          ) : mode === "offline" ? (
            <>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-black text-white hover:bg-gray-900 transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 shadow-md active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Connection</span>
              </button>
              <Link
                href="/"
                className="text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.back()}
                className="text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </button>
              <Link
                href="/"
                className="bg-black text-white hover:bg-gray-900 transition-all duration-300 ease-in-out px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:scale-105 shadow-md active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Characters Animation Component
type StickFigure = {
  top?: string;
  bottom?: string;
  src: string;
  transform?: string;
  speedX: number;
  speedRotation?: number;
};

function CharactersAnimation() {
  const charactersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Define stick figures with their properties
    const stickFigures: StickFigure[] = [
      {
        top: "0%",
        src: "https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg",
        transform: "rotateZ(-90deg)",
        speedX: 1500,
      },
      {
        top: "10%",
        src: "https://cdn.21st.dev/assets/mirror/7e/7e48603d6fd3fac9720b25b4b6a06d107feea2d21ef8fa0720921808b9808514.svg",
        speedX: 3000,
        speedRotation: 2000,
      },
      {
        top: "20%",
        src: "https://cdn.21st.dev/assets/mirror/4f/4fd3a604a36cc8811c341ef3221010ed11e2563d4add29901922d7464c28c186.svg",
        speedX: 5000,
        speedRotation: 1000,
      },
      {
        top: "25%",
        src: "https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg",
        speedX: 2500,
        speedRotation: 1500,
      },
      {
        top: "35%",
        src: "https://cdn.21st.dev/assets/mirror/54/54f366bdbf75b7a2d3b9f2264c3ada12aefcaf6e6a467bcecc856ffcd686e52e.svg",
        speedX: 2000,
        speedRotation: 300,
      },
      {
        bottom: "5%",
        src: "https://cdn.21st.dev/assets/mirror/66/668d66f4c4d1dbc5c421692b4e5ad644c0f11f0327da214bcae21f78816c6b2f.svg",
        speedX: 0, // No horizontal movement
      },
    ];

    if (!charactersRef.current) return;
    charactersRef.current.innerHTML = "";

    // Create and animate each stick figure
    stickFigures.forEach((figure, index) => {
      const stick = document.createElement("img");
      stick.classList.add("characters");
      stick.style.position = "absolute";
      stick.style.width = "18%";
      stick.style.height = "18%";

      if (figure.top) stick.style.top = figure.top;
      if (figure.bottom) stick.style.bottom = figure.bottom;
      stick.src = figure.src;
      if (figure.transform) stick.style.transform = figure.transform;

      charactersRef.current?.appendChild(stick);

      // Skip animation for the last figure (index 5)
      if (index === 5) return;

      // Horizontal movement animation
      stick.animate(
        [{ left: "100%" }, { left: "-20%" }],
        { duration: figure.speedX, easing: "linear", fill: "forwards" }
      );

      // Skip rotation for the first figure (index 0)
      if (index === 0) return;

      // Rotation animation
      if (figure.speedRotation) {
        stick.animate(
          [{ transform: "rotate(0deg)" }, { transform: "rotate(-360deg)" }],
          { duration: figure.speedRotation, iterations: Infinity, easing: "linear" }
        );
      }
    });

    return () => {
      if (charactersRef.current) {
        charactersRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={charactersRef} className="absolute w-[99%] h-[95%] pointer-events-none" />;
}

// 3. Circle Animation Component
interface Circulo {
  x: number;
  y: number;
  size: number;
}

function CircleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();
  const timerRef = useRef(0);
  const circulosRef = useRef<Circulo[]>([]);

  const initArr = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    circulosRef.current = [];

    for (let index = 0; index < 300; index++) {
      const randomX =
        Math.floor(Math.random() * (canvas.width * 3 - canvas.width * 1.2 + 1)) +
        canvas.width * 1.2;

      const randomY =
        Math.floor(Math.random() * (canvas.height - canvas.height * -0.2 + 1)) +
        canvas.height * -0.2;

      const size = canvas.width / 1000;
      circulosRef.current.push({ x: randomX, y: randomY, size });
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    timerRef.current++;
    context.setTransform(1, 0, 0, 1, 0, 0);

    const distanceX = canvas.width / 80;
    const growthRate = canvas.width / 1000;

    context.fillStyle = "white";
    context.clearRect(0, 0, canvas.width, canvas.height);

    circulosRef.current.forEach((circulo) => {
      context.beginPath();

      if (timerRef.current < 65) {
        circulo.x = circulo.x - distanceX;
        circulo.size = circulo.size + growthRate;
      }

      if (timerRef.current >= 65 && timerRef.current < 500) {
        circulo.x = circulo.x - distanceX * 0.02;
        circulo.size = circulo.size + growthRate * 0.2;
      }

      context.arc(circulo.x, circulo.y, Math.max(0.1, circulo.size), 0, Math.PI * 2);
      context.fill();
    });

    if (timerRef.current > 500) {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      return;
    }

    requestIdRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    timerRef.current = 0;
    initArr();
    draw();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      timerRef.current = 0;
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
      initArr();
      draw();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />;
}

export default NotFoundScreen;
