"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../../context/AuthContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email === "ahyar12324@gmail.com") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== "ahyar12324@gmail.com") {
        await signOut(auth);
        alert("Hanya akun admin yang diizinkan!");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      alert("Gagal login! Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0b0f15] px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
      {/* Left side: Lottie Animation */}
      <div className="relative flex w-full items-center justify-center lg:w-1/2">
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
            aria-hidden
          >
            <div
              className="rounded-full blur-3xl opacity-30 h-[600px] w-[600px] md:h-[900px] md:w-[900px]"
              style={{
                background:
                  "radial-gradient(circle, #61DCA3 20%, transparent 70%)",
              }}
            />
          </div>
          <div className="relative z-20 flex h-40 w-40 animate-pop-in items-center justify-center h-56 w-56 md:h-64 md:w-64 lg:h-80 lg:w-80">
            <DotLottieReact
              src="https://lottie.host/3a3a6bfa-c42d-42be-aebe-fbd87507d3d6/LCJHZoKvgu.lottie"
              loop
              autoplay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                minWidth: 0,
                minHeight: 0,
              }}
            />
          </div>
        </div>
      </div>

      {/* Right side: Glass Card */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="relative z-30 mt-8 w-full max-w-sm lg:mt-0">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#61DCA3]/20 via-transparent to-transparent p-px transition-all duration-300 hover:from-[#61DCA3]/40">
            <div className="flex animate-slide-fade-in flex-col items-center gap-7 rounded-[23px] bg-[#181d23cc] px-6 py-8 shadow-2xl backdrop-blur-xl md:px-8 md:py-10">
              <h2 className="mb-2 bg-gradient-to-b from-[#61DCA3] to-[#50b57e] bg-clip-text text-center text-3xl font-black tracking-tight text-transparent drop-shadow-md md:text-4xl">
                Admin Login
              </h2>
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`flex w-full items-center justify-center gap-3 rounded-xl bg-[#61DCA3] py-3 px-6 text-lg font-bold text-[#0B0F15] shadow-xl outline-none transition-all duration-200 hover:scale-105 hover:bg-[#50b57e] focus:ring-4 focus:ring-[#61dca3]/30 active:scale-100 ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                <FcGoogle className="text-2xl" />
                {loading ? (
                  <span className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  <span>Login with Google</span>
                )}
              </button>
              <div className="mt-2 select-none text-center text-xs text-gray-400">
                Hanya untuk admin:{" "}
                <b className="font-medium text-white">ahyar12324@gmail.com</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Animations */}
      <style jsx global>{`
        @keyframes slide-fade-in {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-slide-fade-in {
          animation: slide-fade-in 1s cubic-bezier(0.23, 1.05, 0.32, 1) both;
        }
        @keyframes pop-in {
          from {
            opacity: 0;
            transform: scale(0.88);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pop-in {
          animation: pop-in 0.7s cubic-bezier(0.23, 1.05, 0.32, 1) both;
        }
      `}</style>
    </div>
  );
}
