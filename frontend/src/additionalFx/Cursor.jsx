import { useEffect, useRef } from "react"

const Cursor = () => {
  const ringRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let animFrame

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const target = e.target
      const isClickable = (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.tagName === "LABEL" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style?.cursor === "pointer" ||
        window.getComputedStyle(target).cursor === "pointer"
      )

      if (isClickable) {
        ring.classList.add("hovering")
      } else {
        ring.classList.remove("hovering")
      }
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      ring.style.left = `${ringX}px`
      ring.style.top = `${ringY}px`

      animFrame = requestAnimationFrame(animate)
    }
    const onMouseLeave = () => { ring.style.opacity = "0" }
    const onMouseEnter = () => { ring.style.opacity = "1" }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseleave", onMouseLeave)
    document.addEventListener("mouseenter", onMouseEnter)
    animFrame = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseleave", onMouseLeave)
      document.removeEventListener("mouseenter", onMouseEnter)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return <div className="cursor-ring" ref={ringRef} />
}

export default Cursor