import { useEffect, useState } from 'react'

export default function useKeyPress(codes: string[]) {
  const [keyPress, setKeyPress] = useState(false)
  const [keys, setKeys] = useState<string[]>([])

  function handleKeyDown(event: KeyboardEvent) {
    setKeys(keys => [...keys, event.key])
  }

  function handleKeyUp(event: KeyboardEvent) {
    setKeys(keys => keys.filter(key => key !== event.key))
  }

  useEffect(() => {
    setKeyPress(codes.length > 0 && codes.toString() === keys.toString())
  }, [keys])

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
