import Image from "next/image";
import { SignupForm } from "@/components/signup/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Signup Form */}
      <div
        className="flex items-center justify-center p-8"
        style={{ backgroundColor: "#E3E2DF" }}
      >
        <SignupForm />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative overflow-hidden">
        <div
          className="absolute inset-0 z-10 opacity-20"
          style={{ backgroundColor: "#540B26" }}
        />

        <Image
          src="/signup-picture.jpg"
          alt="Signup"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 z-20 from-[#E3E2DF]/20 to-transparent" />
      </div>
    </div>
  );
}
