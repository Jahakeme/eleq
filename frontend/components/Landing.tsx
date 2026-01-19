import Navbar from "./Navbar"
import ScrollAnimationGrid from "./ScrollAnimationGrid"

const Landing = () => {
  return (
    <div className="relative">
        {/* Background scroll animation grid */}
        <ScrollAnimationGrid />

        {/* Content layer - fixed hero section */}
        <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="pointer-events-auto">
                <Navbar />
            </div>
            <div className="h-[calc(100vh-60px)] grid place-items-center">
                <h1 className="text-center text-[clamp(4rem,12vw,14rem)] leading-none font-bold">
                    eleq
                </h1>
            </div>
        </div>
    </div>
  )
}

export default Landing
