import { useEffect, useRef, useState } from 'react'
import FloatDot from './content-scripts/components/floatDot'
import useFloatDotPosition from './content-scripts/hooks/useFloatDotPosition'
import useMouseElement from './content-scripts/hooks/useMouseElement'
import useSelection from './content-scripts/hooks/useSelection'

// import './index.css'

function App() {
  const [floatDotClick, setFloatDotClick] = useState(false)
  const floatDotPositoin = useFloatDotPosition(floatDotClick)
  const element = useMouseElement(floatDotClick)

  const elementRef = useRef<HTMLElement | undefined>(undefined)
  const selection = useSelection(elementRef.current)

  useEffect(() => {
    if (element && floatDotClick)
      elementRef.current = element as HTMLElement
    else
      elementRef.current = undefined
  }, [element, floatDotClick])

  return (
    <>
      {floatDotPositoin && <div className="absolute" style={{ left: floatDotPositoin.x - 10, top: floatDotPositoin.y - 10 }}>
        <FloatDot setFloatDotClick={setFloatDotClick} />
      </div>}
    </>
  )
}

export default App
