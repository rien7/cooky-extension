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

    // reset <a> tag
    const aTags = document.querySelectorAll('a')
    aTags.forEach((aTag) => {
      const href = aTag.getAttribute('disabled-href')
      if (href) {
        aTag.setAttribute('href', href)
        aTag.removeAttribute('disabled-href')
      }
    })
  }

  return (
    <>
      { fixed && <div className='group absolute -left-2 -top-2 h-6 w-6 cursor-pointer rounded-full bg-red-400 transition-all hover:-left-4 hover:-top-4 hover:z-50 hover:h-20 hover:w-20'
        onClick={handleClick} >
          <svg className="absolute left-7 top-7 m-0 h-0 w-0 opacity-0 transition group-hover:h-8 group-hover:w-8 group-hover:opacity-100"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1_14)">
              <path d="M12 2.75C17.1086 2.75 21.25 6.8914 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 11.5858 2.41421 11.25 2 11.25C1.58579 11.25 1.25 11.5858 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.0629 17.9371 1.25 12 1.25C11.5858 1.25 11.25 1.5858 11.25 2C11.25 2.4142 11.5858 2.75 12 2.75Z" fill="white"/>
              <path d="M10.4697 11.5303C10.7626 11.8232 11.2374 11.8232 11.5303 11.5303C11.8232 11.2374 11.8232 10.7626 11.5303 10.4697L3.81066 2.75003L7.34375 2.75003C7.75796 2.75003 8.09375 2.41423 8.09375 2.00003C8.09375 1.58583 7.75796 1.25003 7.34375 1.25003L2 1.25003C1.58579 1.25003 1.25 1.58583 1.25 2.00003L1.25 7.34382C1.25 7.75802 1.58579 8.09382 2 8.09382C2.41421 8.09382 2.75 7.75802 2.75 7.34382L2.75 3.81073L10.4697 11.5303Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_1_14">
                <rect width="24" height="24" fill="white" transform="matrix(0 -1 1 0 0 24)"/>
              </clipPath>
            </defs>
          </svg>
        </div> }
    </>
  )
}
