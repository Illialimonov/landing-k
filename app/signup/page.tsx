"use client";

import $api from "@/lib/http";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function RegisterContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatedPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      console.log("Sending registration request:", { email, password });
      const res = await $api.post("/user/register", {
        email,
        password,
        repeatedPassword,
      });
      console.log("Registration response:", res.data);
      setShowVerifyPopup(true); // Show popup for entering verification code
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Sending verification code:", { code: verificationCode });
      const res = await $api.post("/user/verify-email", {
        code: parseInt(verificationCode),
      });
      console.log("Verification response:", res.data);
      if (res.status === 200) {
        setShowVerifyPopup(false);
        router.push("/login"); // Successful verification, redirect to login
        toast({
          title: "Notification",
          description:
            "Your account has been created successfully! You may now login",
        });
      }
    } catch (err: any) {
      console.error("Verification error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Verification code error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse: any) => {
    try {
      console.log("Google OAuth response:", credentialResponse);
      if (!credentialResponse.access_token) {
        throw new Error("access_token missing in Google OAuth response");
      }
      let googleEmail = "";
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        googleEmail = decoded.email;
      } else {
        googleEmail = "unknown";
      }
      console.log("Sending Google registration request:", {
        access_token: credentialResponse.access_token,
      });
      const res = await $api.post("/user/google", {
        access_token: credentialResponse.access_token,
      });
      console.log("Google registration response:", res.data);
      const { access_token, refresh_token, user_details } = res.data || {};
      const tier = user_details?.tier || "FREE";
      const hasOneFreeConversion =
        user_details?.hasOneFreeConversion === "true";
      if (access_token && refresh_token) {
        await login(
          access_token,
          refresh_token,
          googleEmail || user_details?.email,
          tier,
          hasOneFreeConversion
        );
        router.push("/");
      } else {
        setError("Google registration error: tokens not received");
        router.push("/login");
      }
    } catch (err: any) {
      console.error(
        "Google registration error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          "Google registration error"
      );
    }
  };

  const googleRegister = useGoogleLogin({
    onSuccess: handleGoogleRegister,
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Google registration error");
    },
    flow: "implicit",
    scope:
      "email profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
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
            Register
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label
                className="block text-muted-foreground mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
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
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <label
                className="block text-muted-foreground mb-2"
                htmlFor="repeatedPassword"
              >
                Confirm Password
              </label>
              <Input
                type="password"
                id="repeatedPassword"
                value={repeatedPassword}
                onChange={(e) => setRepeatedPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="my-6 text-center text-muted-foreground">or</div>

          <Button
            onClick={() => googleRegister()}
            className="w-full flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.51h5.84c-.25 1.37-.98 2.53-2.07 3.3v2.74h3.36c1.96-1.81 3.09-4.47 3.09-7.8z"
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
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Verification Code Popup */}
      <Dialog open={showVerifyPopup} onOpenChange={setShowVerifyPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label
                className="block text-muted-foreground mb-2"
                htmlFor="verificationCode"
              >
                Enter the code sent to your email
              </label>
              <Input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full"
                required
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function Register() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RegisterContent />
    </GoogleOAuthProvider>
  );
}
