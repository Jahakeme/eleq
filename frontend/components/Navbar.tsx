
const Navbar = () => {
  return (
     <nav className="w-full border-b">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 py-4">
        {/* Logo */}
        <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2">
          <span className="text-xl font-bold">eleq.</span>
        </div>

        {/* Centered Links */}
        <ul className="flex justify-center gap-6 sm:gap-8">
          <li>
            <a href="#" className="text-sm font-medium hover:opacity-70">
              Products
            </a>
          </li>
          <li>
            <a href="#" className="text-sm font-medium hover:opacity-70">
              Sign in
            </a>
          </li>
          <li>
            <a href="#" className="text-sm font-medium hover:opacity-70">
              Sign up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
