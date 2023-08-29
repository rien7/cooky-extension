import { atom } from 'jotai'
import { useState } from 'react'
import useMouse from './useMouse'

export const elementAtom = atom<Element | undefined>(undefined)

export default function useMouseElement() {
  const [element, setElement] = useState<Element | undefined>()
  const position = useMouse()
  setElement(document.elementFromPoint(position?.clientX ?? 0, position?.clientY ?? 0) || undefined)
  return element
}
