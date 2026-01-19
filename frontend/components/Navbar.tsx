import Link from "next/link";

const Navbar = () => {
  return (
     <nav className="w-full ">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-4">
        {/* Logo */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2">
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            eleq.
          </Link>        
        </div>

        {/* Centered Links */}
        <ul className="flex justify-center gap-6 sm:gap-8">
          <li>
            <Link href="/products" className="text-sm font-medium hover:opacity-70">
              Products
            </Link>
          </li>
          <li>
            <Link href="/signin" className="text-sm font-medium hover:opacity-70">
              Sign in
            </Link>
          </li>
          <li>
            <Link href="/signup" className="text-sm font-medium hover:opacity-70">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
