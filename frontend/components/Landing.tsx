import Navbar from "./Navbar"

const Landing = () => {
  return (
    <div>
        <Navbar />
        <div className="min-h-screen grid place-items-center">
            <h1 className="text-center text-[clamp(4rem,12vw,14rem)] leading-none font-bold">
                eleq
            </h1>
        </div>

    </div>
  )
}

export default Landing
