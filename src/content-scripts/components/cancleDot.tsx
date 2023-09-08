export default function CancleDot(props: {
  element: Element
  elementRef: React.MutableRefObject<HTMLElement | undefined>
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  fixed: boolean
}) {
  const { element, elementRef, setFixed, fixed } = props

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    if (element.classList.contains('cooky-selecting-paragraph'))
      element.classList.remove('cooky-selecting-paragraph')
    const selectedElement = element.querySelectorAll('cooky-selection')
    selectedElement.forEach((element) => {
      element.outerHTML = element.textContent || ''
    })
    setFixed(false)
    elementRef.current = undefined
  }

  return (
    <>
      { fixed && <div className='group absolute -left-2 -top-2 h-6 w-6 cursor-pointer rounded-full bg-red-400 transition-all hover:-left-4 hover:-top-4 hover:z-50 hover:h-20 hover:w-20'
        onClick={handleClick} >
          <svg className="absolute left-0 top-0 m-0 h-0 w-0 opacity-100 transition group-hover:m-3 group-hover:h-10 group-hover:w-10 group-hover:opacity-100"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 17L16.8995 7.10051" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7.00001L16.8995 16.8995" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div> }
    </>
  )
}
