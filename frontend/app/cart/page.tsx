import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CartLayout } from "@/components/cart";

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  // Fallback redirect if middleware didn't catch it
  if (!session?.user) {
    redirect("/signin?redirect=/cart");
  }

  return (
    <CartLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    />
  );
}
