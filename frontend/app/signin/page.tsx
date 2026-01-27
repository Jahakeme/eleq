import { LoginForm } from "@/components/signin/signin-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Login Form */}
      <div
        className="flex items-center justify-center p-8"
        style={{ backgroundColor: "#E3E2DF" }}
      >
        <LoginForm />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <div
          className="absolute inset-0 z-10 opacity-20"
          style={{ backgroundColor: "#540B26" }}
        />

        <Image
          src="/login.jpg"
          alt="Login"
          fill
          className="object-cover p-10"
          priority
        />

        <div className="absolute inset-0 z-20 from-[#E3E2DF]/20 to-transparent" />
      </div>
    </div>
  );
}
