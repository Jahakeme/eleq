import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CheckoutLayout } from "@/components/checkout";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  // Fallback redirect if middleware didn't catch it
  if (!session?.user) {
    redirect("/signin?redirect=/checkout");
  }

  return (
    <CheckoutLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    />
  );
}
