import { useState } from 'react'
import type { ParagraphDataType } from '../App'
import { sendMessage } from '../util/sendMessages'
import useDelayUnmount from '../hooks/useDelayUnmount'

export default function FloatDot(props: {
  paragraphData: ParagraphDataType
  fixed: boolean
  setFixed: React.Dispatch<React.SetStateAction<boolean>>
  activeChat: ParagraphDataType | undefined
  setActiveChat: React.Dispatch<React.SetStateAction<ParagraphDataType | undefined>>
  elementRef: React.MutableRefObject<HTMLElement | undefined>
}) {
  const { paragraphData, fixed, setFixed, activeChat, setActiveChat, elementRef } = props
  const [hover, setHover] = useState(false)
  const [pin, setPin] = useState(false)
  const hoverRender = useDelayUnmount(hover, 300)
  const bodyBounding = document.body.getBoundingClientRect()

  function handleMouseEnter() {
    if (pin)
      return
    setHover(true)
  }

  function handleMouseLeave() {
    if (pin)
      return
    setHover(false)
  }

  return (
    <>
      { !paragraphData.current
       && <div className={`group absolute z-50 h-auto w-10 rounded-full p-1 transition-all duration-300 hover:bg-blue-200 ${pin ? 'bg-blue-200' : 'bg-transparent'}`}
                style={{
                  left: paragraphData.position.right + paragraphData.position.scrollX + 5 - bodyBounding.left,
                  top: paragraphData.position.top + paragraphData.position.scrollY,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave} >
            <div className={`mx-auto my-1 h-3 w-3 cursor-pointer rounded-full border-2 transition group-hover:border-blue-400 ${pin ? 'border-blue-400 bg-blue-400' : 'border-blue-300 bg-transparent'}`}
              onClick={() => {
                setPin(pin => !pin)
              }}/>
            { hoverRender
              && <>
                <svg className={`float-dot-btn ${fixed ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-300'} ${hover ? 'opacity-100' : 'opacity-0'}`}
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  onClick={() => {
                    if (fixed)
                      return
                    const element = paragraphData.element
                    element.setAttribute('re-select', 'true')
                    const classList = element.classList
                    if (classList.contains('cooky-selection-paragraph'))
                      element.classList.remove('cooky-selection-paragraph')
                    setFixed(true)
                    if (!classList.contains('cooky-selecting-paragraph'))
                      element.classList.add('cooky-selecting-paragraph')
                    elementRef.current = element
                  }}>
                  <path fillRule="evenodd" clipRule="evenodd" fill='#60a5fa' stroke='#60a5fa'
                    d="M15 1.25C15.4142 1.25 15.75 1.58579 15.75 2V3.2555C16.9594 3.26793 17.9701 3.30925 18.8089 3.45158C19.8369 3.626 20.6807 3.96316 21.3588 4.64124C22.1071 5.38961 22.4392 6.33856 22.5969 7.51098C22.75 8.65018 22.75 10.1058 22.75 11.9435V12.0564C22.75 13.8942 22.75 15.3498 22.5969 16.489C22.4392 17.6614 22.1071 18.6104 21.3588 19.3588C20.6807 20.0368 19.8369 20.374 18.8089 20.5484C17.9701 20.6908 16.9594 20.7321 15.75 20.7445V22C15.75 22.4142 15.4142 22.75 15 22.75C14.5858 22.75 14.25 22.4142 14.25 22V2C14.25 1.58579 14.5858 1.25 15 1.25ZM15.75 19.2443V4.75569C16.9362 4.76835 17.8391 4.80847 18.558 4.93044C19.3998 5.07329 19.9131 5.31689 20.2981 5.7019C20.7213 6.12511 20.975 6.70476 21.1102 7.71085C21.2484 8.73851 21.25 10.0932 21.25 12C21.25 13.9068 21.2484 15.2615 21.1102 16.2892C20.975 17.2952 20.7213 17.8749 20.2981 18.2981C19.9131 18.6831 19.3998 18.9267 18.558 19.0696C17.8391 19.1915 16.9362 19.2316 15.75 19.2443Z"/>
                  <path fill='#60a5fa' stroke='#60a5fa'
                    d="M9.94358 3.25H12C12.4142 3.25 12.75 3.58579 12.75 4C12.75 4.41421 12.4142 4.75 12 4.75H10C8.09318 4.75 6.73851 4.75159 5.71085 4.88976C4.70476 5.02502 4.12511 5.27869 3.7019 5.7019C3.27869 6.12511 3.02503 6.70476 2.88976 7.71085C2.75159 8.73851 2.75 10.0932 2.75 12C2.75 13.9068 2.75159 15.2615 2.88976 16.2892C3.02503 17.2952 3.27869 17.8749 3.7019 18.2981C4.12511 18.7213 4.70476 18.975 5.71085 19.1102C6.73851 19.2484 8.09318 19.25 10 19.25H12C12.4142 19.25 12.75 19.5858 12.75 20C12.75 20.4142 12.4142 20.75 12 20.75H9.94359C8.10585 20.75 6.65018 20.75 5.51098 20.5969C4.33856 20.4392 3.38961 20.1071 2.64124 19.3588C1.89288 18.6104 1.56076 17.6614 1.40314 16.489C1.24997 15.3498 1.24998 13.8942 1.25 12.0564V11.9436C1.24998 10.1058 1.24997 8.65019 1.40314 7.51098C1.56076 6.33856 1.89288 5.38961 2.64124 4.64124C3.38961 3.89288 4.33856 3.56076 5.51098 3.40314C6.65019 3.24997 8.10582 3.24998 9.94358 3.25Z"/>
                  <path fill='#60a5fa' stroke='#60a5fa'
                    d="M6.81782 7.78733C7.11779 7.74992 7.48429 7.74996 7.88383 7.75H10.1162C10.5157 7.74996 10.8822 7.74992 11.1822 7.78733C11.5109 7.82833 11.8612 7.9242 12.1624 8.19187C12.2138 8.23753 12.2625 8.28618 12.3081 8.33756C12.5758 8.63878 12.6717 8.98915 12.7127 9.31782C12.7501 9.61779 12.7501 9.98428 12.75 10.3838V10.425C12.75 10.8392 12.4142 11.175 12 11.175C11.5858 11.175 11.25 10.8392 11.25 10.425C11.25 9.97047 11.2486 9.69931 11.2242 9.50348C11.1998 9.30765 10.9965 9.2758 10.9965 9.2758C10.8007 9.25137 10.5295 9.25001 10.075 9.25001H9.75001V14.75H11C11.4142 14.75 11.75 15.0858 11.75 15.5C11.75 15.9142 11.4142 16.25 11 16.25H7.00001C6.58579 16.25 6.25001 15.9142 6.25001 15.5C6.25001 15.0858 6.58579 14.75 7.00001 14.75H8.25001V9.25001H7.92501C7.47047 9.25001 7.19931 9.25137 7.00348 9.2758C7.00348 9.2758 6.80023 9.30765 6.7758 9.50348C6.75138 9.69931 6.75001 9.97047 6.75001 10.425C6.75001 10.8392 6.41422 11.175 6.00001 11.175C5.58579 11.175 5.25001 10.8392 5.25001 10.425L5.25 10.3838C5.24996 9.98428 5.24992 9.61779 5.28733 9.31782C5.32833 8.98915 5.4242 8.63878 5.69187 8.33756C5.73753 8.28618 5.78618 8.23753 5.83757 8.19187C6.13878 7.9242 6.48915 7.82833 6.81782 7.78733Z"/>
                </svg>
                <svg className={`float-dot-btn ${fixed ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-blue-300'} ${hover ? 'opacity-100' : 'opacity-0'}`}
                  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (fixed)
                      return
                    const element = paragraphData.element
                    const cookySelection = element.querySelectorAll('cooky-selection')
                    cookySelection.forEach((element) => {
                      element.removeAttribute('data')
                    })
                    element.removeAttribute('data')
                    sendMessage(paragraphData, setFixed)
                  }}>
                  <path fillRule="evenodd" clipRule="evenodd" fill='#60a5fa' stroke='#60a5fa'
                    d="M2.93077 11.2003C3.00244 6.23968 7.07619 2.25 12.0789 2.25C15.3873 2.25 18.287 3.99427 19.8934 6.60721C20.1103 6.96007 20.0001 7.42199 19.6473 7.63892C19.2944 7.85585 18.8325 7.74565 18.6156 7.39279C17.2727 5.20845 14.8484 3.75 12.0789 3.75C7.8945 3.75 4.50372 7.0777 4.431 11.1982L4.83138 10.8009C5.12542 10.5092 5.60029 10.511 5.89203 10.8051C6.18377 11.0991 6.18191 11.574 5.88787 11.8657L4.20805 13.5324C3.91565 13.8225 3.44398 13.8225 3.15157 13.5324L1.47176 11.8657C1.17772 11.574 1.17585 11.0991 1.46759 10.8051C1.75933 10.5111 2.2342 10.5092 2.52824 10.8009L2.93077 11.2003ZM19.7864 10.4666C20.0786 10.1778 20.5487 10.1778 20.8409 10.4666L22.5271 12.1333C22.8217 12.4244 22.8245 12.8993 22.5333 13.1939C22.2421 13.4885 21.7673 13.4913 21.4727 13.2001L21.0628 12.7949C20.9934 17.7604 16.9017 21.75 11.8825 21.75C8.56379 21.75 5.65381 20.007 4.0412 17.3939C3.82366 17.0414 3.93307 16.5793 4.28557 16.3618C4.63806 16.1442 5.10016 16.2536 5.31769 16.6061C6.6656 18.7903 9.09999 20.25 11.8825 20.25C16.0887 20.25 19.4922 16.9171 19.5625 12.7969L19.1546 13.2001C18.86 13.4913 18.3852 13.4885 18.094 13.1939C17.8028 12.8993 17.8056 12.4244 18.1002 12.1333L19.7864 10.4666Z" />
                </svg>
                <svg className={`float-dot-btn ${hover ? 'opacity-100' : 'opacity-0'} cursor-pointer hover:bg-blue-300`}
                  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    if (activeChat !== paragraphData) {
                      setActiveChat(paragraphData)
                      setPin(true)
                    }
                    else {
                      setActiveChat(undefined)
                      setPin(false)
                    }
                  }}>
                  <path fillRule="evenodd" clipRule="evenodd" fill='#60a5fa' stroke='#60a5fa'
                    d="M8.98899 5.30778C10.169 2.90545 12.6404 1.25 15.5 1.25C19.5041 1.25 22.75 4.49594 22.75 8.5C22.75 9.57209 22.5168 10.5918 22.0977 11.5093C21.9883 11.7488 21.967 11.975 22.0156 12.1568L22.143 12.6328C22.5507 14.1566 21.1566 15.5507 19.6328 15.143L19.1568 15.0156C19.0215 14.9794 18.8616 14.982 18.6899 15.0307C18.1798 19.3775 14.4838 22.75 10 22.75C8.65003 22.75 7.36949 22.4438 6.2259 21.8963C5.99951 21.7879 5.7766 21.7659 5.59324 21.815L4.3672 22.143C2.84337 22.5507 1.44927 21.1566 1.857 19.6328L2.18504 18.4068C2.2341 18.2234 2.21211 18.0005 2.10373 17.7741C1.55623 16.6305 1.25 15.35 1.25 14C1.25 9.50945 4.63273 5.80897 8.98899 5.30778ZM10.735 5.28043C15.0598 5.64011 18.4914 9.14511 18.736 13.5016C18.9986 13.4766 19.2714 13.4935 19.5445 13.5666L20.0205 13.694C20.4293 13.8034 20.8034 13.4293 20.694 13.0205L20.5666 12.5445C20.4095 11.9571 20.5119 11.3708 20.7333 10.8861C21.0649 10.1602 21.25 9.35275 21.25 8.5C21.25 5.32436 18.6756 2.75 15.5 2.75C13.5181 2.75 11.7692 3.75284 10.735 5.28043ZM10 6.75C5.99594 6.75 2.75 9.99594 2.75 14C2.75 15.121 3.00392 16.1807 3.45667 17.1264C3.69207 17.6181 3.79079 18.2087 3.63407 18.7945L3.30602 20.0205C3.19664 20.4293 3.57066 20.8034 3.97949 20.694L5.20553 20.3659C5.79126 20.2092 6.38191 20.3079 6.87362 20.5433C7.81932 20.9961 8.87896 21.25 10 21.25C14.0041 21.25 17.25 18.0041 17.25 14C17.25 9.99594 14.0041 6.75 10 6.75Z" />
                  <path fill='#60a5fa' stroke='#60a5fa'
                    d="M7.5 14C7.5 14.5523 7.05228 15 6.5 15C5.94772 15 5.5 14.5523 5.5 14C5.5 13.4477 5.94772 13 6.5 13C7.05228 13 7.5 13.4477 7.5 14Z" />
                  <path fill='#60a5fa' stroke='#60a5fa'
                    d="M11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14Z" />
                  <path fill='#60a5fa' stroke='#60a5fa'
                    d="M14.5 14C14.5 14.5523 14.0523 15 13.5 15C12.9477 15 12.5 14.5523 12.5 14C12.5 13.4477 12.9477 13 13.5 13C14.0523 13 14.5 13.4477 14.5 14Z" />
                </svg>
              </>
            }
          </div>
      }
    </>
  )
}
