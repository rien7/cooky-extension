import { useEffect, useState } from 'react'
import useMouseElement from './useMouseElement'

export default function useElementBounding(fixed: boolean = false) {
  const [elementBounding, setElementBounding] = useState<{ rect: DOMRect } | undefined>(undefined)
  const element = useMouseElement()

  useEffect(() => {
    if (fixed)
      return
    const boundingClientRect = element?.getBoundingClientRect()
    if (!boundingClientRect) {
      setElementBounding(undefined)
      return
    }
    setElementBounding({ rect: boundingClientRect })
  }, [element, fixed])

  return elementBounding
}
