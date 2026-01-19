"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// Grid items configuration based on Demo 1
// Each item has row (r), column (c), and an image URL
const gridItems = [
  { r: 1, c: 4, img: "https://images.unsplash.com/photo-1740591318085-092777c9c9ea?q=80&w=738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 1, c: 1, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80" }, 
  { r: 2, c: 8, img: "https://images.unsplash.com/photo-1587145820098-23e484e69816?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 2, c: 5, img: "https://images.unsplash.com/photo-1612181819081-950d35f4d826?q=80&w=1043&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 3, c: 3, img: "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 4, c: 7, img: "https://images.unsplash.com/photo-1739742465286-a48290c94375?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 5, c: 8, img: "https://images.unsplash.com/photo-1766941234615-644690cad4e2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 6, c: 2, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" }, 
  { r: 7, c: 3, img: "https://images.unsplash.com/photo-1740803292814-13d2e35924c3?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 8, c: 7, img: "https://images.unsplash.com/photo-1635173736447-4d546c65ad41?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 9, c: 1, img: "https://images.unsplash.com/photo-1592838884470-0415caecffd3?q=80&w=825&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 9, c: 6, img: "https://images.unsplash.com/photo-1675546529290-a2147e6e5cd5?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 10, c: 4, img: "https://images.unsplash.com/photo-1617036083087-ce31fac66b23?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 11, c: 2, img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 12, c: 6, img: "https://images.unsplash.com/photo-1629478561473-9dfeb1913526?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 13, c: 3, img: "https://images.unsplash.com/photo-1762341123870-d706f257a12e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 14, c: 5, img: "https://images.unsplash.com/photo-1608354580875-30bd4168b351?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 15, c: 1, img: "https://images.unsplash.com/photo-1723661973650-febc670fcea2?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 16, c: 2, img: "https://images.unsplash.com/photo-1760998881286-14ff52aaf833?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 17, c: 8, img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80" }, 
  { r: 18, c: 3, img: "https://images.unsplash.com/photo-1690090903050-5103f3b13256?q=80&w=626&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 19, c: 5, img: "https://images.unsplash.com/photo-1756729924080-d958bf86991d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 20, c: 4, img: "https://images.unsplash.com/photo-1581348304131-9d03407316b7?q=80&w=697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 21, c: 2, img: "https://images.unsplash.com/photo-1525740280772-00fa0cefe2e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 22, c: 7, img: "https://images.unsplash.com/photo-1759339206229-b10e61dd9089?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 23, c: 1, img: "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?w=400&q=80" }, 
  { r: 24, c: 5, img: "https://images.unsplash.com/photo-1727953990403-8677ce0599e9?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 25, c: 4, img: "https://images.unsplash.com/photo-1662569074658-5cd1d6f01d3f?q=80&w=962&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { r: 26, c: 2, img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80" }, 
  { r: 27, c: 3, img: "https://images.unsplash.com/photo-1623949556303-b0d17d198863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 28, c: 6, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80" }, 
  { r: 29, c: 5, img: "https://images.unsplash.com/photo-1747224317387-ee2e7eaa865d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 30, c: 4, img: "https://images.unsplash.com/photo-1698913461371-7eddecc05369?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 31, c: 1, img: "https://images.unsplash.com/photo-1736289150235-7dc9b851511a?q=80&w=758&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 32, c: 6, img: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&q=80" }, 
  { r: 33, c: 3, img: "https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=400&q=80" }, 
  { r: 34, c: 5, img: "https://images.unsplash.com/photo-1742570922875-e5a60e950307?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 35, c: 1, img: "https://images.unsplash.com/photo-1765176938654-ac6f04c1d86b?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 36, c: 8, img: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&q=80" }, 
  { r: 37, c: 6, img: "https://images.unsplash.com/photo-1606420187127-dae7c868fa7a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 38, c: 3, img: "https://images.unsplash.com/photo-1727364438136-6edc10ef0a52?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 39, c: 5, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }, 
  { r: 40, c: 4, img: "https://images.unsplash.com/photo-1569698134101-f15cde5cd66c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

const ScrollAnimationGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const animationsInitialized = useRef(false);

  useEffect(() => {
    if (animationsInitialized.current) return;
    animationsInitialized.current = true;

    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    const scrollFn = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(scrollFn);
    };
    requestAnimationFrame(scrollFn);

    // Sync Lenis with GSAP ScrollTrigger
    lenisRef.current.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Wait for images to load before animating
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const items = gridElement.querySelectorAll(".grid__item");

    // Set up scroll animations for each grid item
    items.forEach((item) => {
      const image = item.querySelector(".grid__item-img") as HTMLElement;
      if (!image) return;

      // Set initial state
      const originX = Math.random() > 0.5 ? 0 : 100;
      gsap.set(image, {
        transformOrigin: `${originX}% 100%`,
        scale: 1,
      });

      // Create scroll-driven animation that reverses on scroll up
      gsap.to(image, {
        scale: 0,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top top",
          end: "bottom top",
          scrub: 0.5, // Smooth scrubbing with slight delay for smoother reversal
        },
      });
    });

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      animationsInitialized.current = false;
    };
  }, []);

  return (
    <div className="scroll-animation-grid-wrapper">
      <div className="scroll-animation-grid" ref={gridRef}>
        <div className="grid">
          {gridItems.map((item, index) => (
            <div
              key={index}
              className="grid__item"
              style={
                {
                  "--r": item.r,
                  "--c": item.c,
                } as React.CSSProperties
              }
            >
              <div
                className="grid__item-img"
                style={{ backgroundImage: `url(${item.img})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollAnimationGrid;
