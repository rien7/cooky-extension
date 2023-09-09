import { useEffect, useState } from 'react'

export default function useDelayUnmount(condition: boolean, duration: number) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (condition)
      setShouldRender(true)
    else
      timeoutId = setTimeout(() => setShouldRender(false), duration)

    return () => clearTimeout(timeoutId)
  }
  , [condition, duration])

  return shouldRender
}
