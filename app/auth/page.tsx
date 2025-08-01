"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const router = useRouter();

  // const handleSignUp = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");
  //
  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match");
  //     setLoading(false);
  //     return;
  //   }
  //
  //   if (password.length < 6) {
  //     setError("Password must be at least 6 characters");
  //     setLoading(false);
  //     return;
  //   }
  //
  //   try {
  //     // For demo purposes, we'll just sign them in with credentials
  //     const result = await signIn("credentials", {
  //       email,
  //       password: "demo123", // Override with demo password
  //       redirect: false,
  //     });
  //
  //     if (result?.error) {
  //       setError("Failed to create account");
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     setError("An error occurred during sign up");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleProviderSignIn = async (providerId: string) => {
    setLoading(true);
    try {
      await signIn(providerId, { callbackUrl: "/" });
    } catch (error) {
      setError("An error occurred during sign up");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-pink-900/70 via-purple-900 to-indigo-900 border-gray-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-gray-300">Join the Wikipedia learning community</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Sign Up */}
          <div className="space-y-8">
            <Button
              onClick={() => handleProviderSignIn("google")}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <Separator className="bg-gray-400" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-900 px-2 text-sm text-gray-300">
                or
              </span>
            </div>

            <Button
              onClick={() => handleProviderSignIn("github")}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-700"
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          {/* Credentials Sign Up */}
          {/* <form onSubmit={handleSignUp} className="space-y-4"> */}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="name">Full Name</Label> */}
          {/*     <Input */}
          {/*       id="name" */}
          {/*       type="text" */}
          {/*       value={name} */}
          {/*       onChange={(e) => setName(e.target.value)} */}
          {/*       placeholder="John Doe" */}
          {/*       required */}
          {/*       className="bg-gray-800 border-gray-600 text-white" */}
          {/*     /> */}
          {/*   </div> */}
          {/**/}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="email">Email</Label> */}
          {/*     <Input */}
          {/*       id="email" */}
          {/*       type="email" */}
          {/*       value={email} */}
          {/*       onChange={(e) => setEmail(e.target.value)} */}
          {/*       placeholder="john@example.com" */}
          {/*       required */}
          {/*       className="bg-gray-800 border-gray-600 text-white" */}
          {/*     /> */}
          {/*   </div> */}
          {/**/}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="password">Password</Label> */}
          {/*     <div className="relative"> */}
          {/*       <Input */}
          {/*         id="password" */}
          {/*         type={showPassword ? "text" : "password"} */}
          {/*         value={password} */}
          {/*         onChange={(e) => setPassword(e.target.value)} */}
          {/*         placeholder="At least 6 characters" */}
          {/*         required */}
          {/*         className="bg-gray-800 border-gray-600 text-white pr-10" */}
          {/*       /> */}
          {/*       <button */}
          {/*         type="button" */}
          {/*         onClick={() => setShowPassword(!showPassword)} */}
          {/*         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" */}
          {/*       > */}
          {/*         {showPassword ? ( */}
          {/*           <EyeOff className="w-4 h-4" /> */}
          {/*         ) : ( */}
          {/*           <Eye className="w-4 h-4" /> */}
          {/*         )} */}
          {/*       </button> */}
          {/*     </div> */}
          {/*   </div> */}
          {/**/}
          {/*   <div className="space-y-2"> */}
          {/*     <Label htmlFor="confirmPassword">Confirm Password</Label> */}
          {/*     <Input */}
          {/*       id="confirmPassword" */}
          {/*       type="password" */}
          {/*       value={confirmPassword} */}
          {/*       onChange={(e) => setConfirmPassword(e.target.value)} */}
          {/*       placeholder="Confirm your password" */}
          {/*       required */}
          {/*       className="bg-gray-800 border-gray-600 text-white" */}
          {/*     /> */}
          {/*   </div> */}
          {/**/}
          {/*   {error && ( */}
          {/*     <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800"> */}
          {/*       {error} */}
          {/*     </div> */}
          {/*   )} */}
          {/**/}
          {/*   <Button */}
          {/*     type="submit" */}
          {/*     disabled={loading} */}
          {/*     className="w-full bg-blue-600 hover:bg-blue-700" */}
          {/*   > */}
          {/*     {loading ? "Creating account..." : "Create Account"} */}
          {/*   </Button> */}
          {/* </form> */}
          {/**/}
          {/* <div className="text-center text-sm text-gray-400"> */}
          {/*   Already have an account?{" "} */}
          {/*   <Link */}
          {/*     href="/auth/signin" */}
          {/*     className="text-blue-400 hover:text-blue-300" */}
          {/*   > */}
          {/*     Sign in */}
          {/*   </Link> */}
          {/* </div> */}

          {/* Demo Note */}
          {/* <div className="bg-yellow-900/20 p-3 rounded border border-yellow-800"> */}
          {/*   <p className="text-xs text-yellow-300"> */}
          {/*     <strong>Note:</strong> This is a demo. All accounts will use demo */}
          {/*     credentials. */}
          {/*   </p> */}
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
