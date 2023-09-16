import { useEffect, useState } from 'react'

export default function useElementChange(
  fixed: boolean,
  element: Element | undefined,
  position: {
    clientX: number
    clientY: number
  } | undefined,
  domChange: boolean,
  setDomChange: (value: boolean) => void,
) {
  const [elementChange, setElementChange] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (!fixed || !element || !position) {
      setElementChange(undefined)
    }
    else {
      const newElements = document.elementsFromPoint(position.clientX, position.clientY)
      setElementChange(!newElements.includes(element))
    }
    setDomChange(false)
  }, [fixed, element, position, domChange])

  return elementChange
}
