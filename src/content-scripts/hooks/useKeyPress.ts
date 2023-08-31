import { useEffect, useState } from 'react'

export default function useKeyPress(code: string) {
  const [keyPress, setKeyPress] = useState(false)

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === code)
      setKeyPress(true)
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.code === code)
      setKeyPress(false)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keyPress
}
