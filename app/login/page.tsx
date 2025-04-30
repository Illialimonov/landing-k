"use client";

import $api from "@/lib/http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await $api.post("/user/login", { email, password });
      const { access_token, refresh_token, user_details } = res.data;
      console.log(res.data);
      const userEmail = email;
      const tier = user_details?.tier || "FREE";
      const hasOneFreeConversion = user_details?.hasOneFreeConversion || "true";
      console.log(tier);
      await login(
        access_token,
        refresh_token,
        userEmail,
        tier,
        hasOneFreeConversion
      );
      router.push("/");
    } catch (err: any) {
      console.log(err.response);
      
      setError(err.response?.data?.error || "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const googleEmail = decoded.email;
      console.log(
        "Sending Google login request:",
        credentialResponse.credential
      );
      const res = await $api.post("/user/google", {
        credentials: credentialResponse.credential,
      });
      console.log("Google login response:", res.data);
      const { access_token, refresh_token, user_details } = res.data || {};
      const tier = user_details?.tier || "FREE";
      const hasOneFreeConversion = user_details?.hasOneFreeConversion || "true";
      if (access_token && refresh_token) {
        await login(
          access_token,
          refresh_token,
          googleEmail,
          tier,
          hasOneFreeConversion
        );
        router.push("/");
      } else {
        setError("Google login failed: no tokens received");
      }
    } catch (err: any) {
      console.error("Google login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Google login error");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => setError("Google login error"),
  });

  return (
    <section className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto bg-secondary/50 rounded-xl p-8 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-center gradient-text mb-6">
            Log in
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                className="block text-muted-foreground mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label
                className="block text-muted-foreground mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-background border border-muted-foreground/20 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <div className="my-6 text-center text-muted-foreground">or</div>

          <Button
            onClick={() => googleLogin()}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition flex items-center justify-center gap-2"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.37-.98 2.53-2.07 3.3v2.74h3.36c1.96-1.81 3.09-4.47 3.09-7.8z"
                fill="#4285F4"
              />
              <path
                d="M12 23.5c2.97 0 5.46-1.01 7.28-2.73l-3.36-2.74c-1.01.68-2.3 1.08-3.92 1.08-3.01 0-5.56-2.04-6.47-4.78H2.07v3.01C3.88 21.48 7.65 23.5 12 23.5z"
                fill="#34A853"
              />
              <path
                d="M5.53 14.22c-.23-.69-.36-1.43-.36-2.22s.13-1.53.36-2.22V6.77H2.07C1.39 8.09 1 9.61 1 11.5s.39 3.41 1.07 4.73l3.46-2.01z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.42c1.62 0 3.07.56 4.22 1.66l3.17-3.17C17.46 2.14 14.97 1 12 1 7.65 1 3.88 3.02 2.07 6.77l3.46 2.01c.91-2.74 3.46-4.78 6.47-4.78z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-muted-foreground mt-6">
            Don&apos;t have an account yet?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
