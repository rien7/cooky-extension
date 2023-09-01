import { useEffect, useState } from 'react'

export default function useSelection(dom: HTMLElement | undefined) {
  const [selections, setSelections] = useState<{ s: number; e: number; id: string }[]>([])

  function handleMouseUp() {
    if (!dom)
      return
    const selectionObj: Selection | null = (window.getSelection && window.getSelection())
    if (!selectionObj)
      return
    if (selectionObj.isCollapsed) {
      let node = selectionObj.anchorNode
      while (node && node.parentElement) {
        if (node.parentElement.nodeName === 'COOKY-SELECTION') {
          node = node.parentElement
          break
        }
        node = node.parentElement
      }
      const id = (node as HTMLElement)?.id
      if (id.length !== 22)
        return
      const rawId = id.slice(16)
      if (rawId)
        setSelections(selections => selections.filter(selection => selection.id !== rawId))
      const selectedElement = dom.querySelectorAll(`#${id}`)
      selectedElement.forEach((element) => {
        element.outerHTML = element.textContent || ''
      })
      return
    }
    const selectedText = selectionObj.toString()
    if (selectedText !== '') {
      const selectionElement = document.createElement('cooky-selection')
      selectionElement.textContent = selectedText
      const range = selectionObj.getRangeAt(0)
      const treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT)
      let currentNode: Node | null = range.commonAncestorContainer.nodeName === '#text' ? treeWalker.currentNode : treeWalker.nextNode()
      const siblingNodes: HTMLElement[] = []
      while (currentNode) {
        siblingNodes.push(currentNode as HTMLElement)
        currentNode = treeWalker.nextNode()
      }
      const randomId = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
      let started = false
      for (const node of siblingNodes) {
        if (!started && node !== range.startContainer) {
          continue
        }
        else if (!started && node === range.startContainer) {
          started = true
          const start = range.startOffset
          const leadingText = node.textContent?.slice(0, start) || ''
          if (node === range.endContainer) {
            const end = range.endOffset
            const text = node.textContent?.slice(start, end)
            const trailingText = node.textContent?.slice(end) || ''
            if (text) {
              const selection = document.createElement('cooky-selection')
              selection.textContent = text
              selection.id = `cooky-selection-${randomId}`
              node.replaceWith(leadingText, selection, trailingText)
            }
            break
          }
          else {
            const text = node.textContent?.slice(start)
            if (text) {
              const selection = document.createElement('cooky-selection')
              selection.textContent = text
              selection.id = `cooky-selection-${randomId}`
              node.replaceWith(leadingText, selection)
            }
          }
        }
        else if (started && node !== range.endContainer) {
          const text = node.textContent
          if (text) {
            const selection = document.createElement('cooky-selection')
            selection.textContent = text
            selection.id = `cooky-selection-${randomId}`
            node.replaceWith(selection)
          }
        }
        else if (started && node === range.endContainer) {
          const end = range.endOffset
          const text = node.textContent?.slice(0, end)
          const trailingText = node.textContent?.slice(end) || ''
          if (text) {
            const selection = document.createElement('cooky-selection')
            selection.textContent = text
            selection.id = `cooky-selection-${randomId}`
            node.replaceWith(selection, trailingText)
          }
          break
        }
      }
      selectionObj.empty()
    }
    const countTreeWalker = document.createTreeWalker(dom)
    let _countNode = countTreeWalker.nextNode()
    let lastId = ''
    let count = 0
    const selections: { s: number; e: number; id: string }[] = []
    while (_countNode) {
      const countNode = _countNode as HTMLElement
      if (countNode.childNodes.length === 0) {
        count += countNode.textContent?.length || 0
      }
      else if (countNode.nodeName === 'COOKY-SELECTION') {
        if (countNode.id !== lastId) {
          selections.push({ s: count, e: count + (countNode.textContent?.length || 0), id: countNode.id })
          lastId = countNode.id
        }
        else {
          let index = selections.length - 1
          if (selections[index].id !== countNode.id)
            index = selections.findIndex(selection => selection.id === countNode.id)
          selections[index].e = count + (countNode.textContent?.length || 0)
        }
      }
      _countNode = countTreeWalker.nextNode()
    }

    setSelections(selections)
  }

  useEffect(() => {
    setSelections([])
    dom?.addEventListener('mouseup', handleMouseUp)
    return () => {
      dom?.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dom])

  return selections
}
