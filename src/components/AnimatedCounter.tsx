import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface Props {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000 }: Props) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return (
    <span ref={ref} className="font-display font-bold text-4xl md:text-5xl gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
