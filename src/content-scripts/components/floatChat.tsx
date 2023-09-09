import { useRef } from 'react'
import type { ParagraphDataType } from '../App'

export default function FloatChat(props: {
  paragraphData: ParagraphDataType | undefined
}) {
  const { paragraphData } = props
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bodyBounding = document.body.getBoundingClientRect()

  return (
    <>
      <div className={`float-chat absolute z-40 min-h-[7rem] w-72 rounded-[20px] rounded-tr-none bg-blue-200 p-3 transition-opacity ${paragraphData ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: (paragraphData?.position.right || 0) + (paragraphData?.position.scrollX || 0) - bodyBounding.left - 283,
          top: (paragraphData?.position.top || 0) + (paragraphData?.position.scrollY || 0) + 32,
        }}>
          <div>
            {
              paragraphData?.chatHistory.map((chat) => {
                return (
                  <>
                    <div className={`my-1 border-l-2 pl-1 text-xs ${chat.role === 'user' ? 'border-gray-400' : 'border-orange-400'}`}
                      key={chat.timestamp}>
                      {chat.text}
                    </div>
                  </>
                )
              })
            }
          </div>
          <div className='mt-2 h-[36px] w-full rounded-md border-2 border-blue-300 bg-blue-200 p-2 text-xs transition placeholder:text-blue-300 focus-within:border-blue-500'>
            <textarea className='h-full w-full resize-none overflow-y-scroll bg-transparent text-xs outline-none focus:outline-none focus:ring-0'
            ref={textareaRef}
            onInput={() => {
              textareaRef.current!.style.height = '0px'
              const height = textareaRef.current!.scrollHeight
              textareaRef.current!.style.height = `${height}px`
              textareaRef.current!.parentElement!.style.height = `${height + 20}px`
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                paragraphData?.chatHistory.push({
                  role: 'user',
                  text: textareaRef.current!.value,
                  timestamp: Date.now(),
                })
                textareaRef.current!.value = ''
              }
            }}
            />
          </div>
      </div>
    </>
  )
}
