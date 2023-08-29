import { useEffect, useState } from 'react'

function mergeSelection(selections: { s: number; e: number }[]): { s: number; e: number }[] {
  selections.sort((a, b) => a.s - b.s)
  const merged: { s: number; e: number }[] = []
  let last = selections[0]
  for (let i = 1; i < selections.length; i++) {
    if (selections[i].s <= last.e) {
      last.e = Math.max(last.e, selections[i].e)
    }
    else {
      merged.push(last)
      last = selections[i]
    }
  }
  merged.push(last)
  return merged
}

// get children nodes offset from first character
export function getOffsets(dom: HTMLElement | undefined) {
  if (!dom)
    return
  const children = dom.childNodes
  const offsets: Map<string | null, number> = new Map()
  let count = 0
  for (let i = 0; i < children.length; i++) {
    // FIXME: use textContent as key may be duplicated
    offsets.set(children[i].textContent, count)
    count += children[i].textContent?.length || 0
  }
  return offsets
}

export default function useSelection(dom: HTMLElement | undefined) {
  const [selections, setSelections] = useState<{ s: number; e: number }[]>([])

  function handleMouseUp() {
    const selectionObj: Selection | null = (window.getSelection && window.getSelection())
    if (!selectionObj)
      return

    const anchorNode = selectionObj.anchorNode
    const focusNode = selectionObj.focusNode
    if (!anchorNode || !focusNode)
      return
    const anchorOffset = selectionObj.anchorOffset
    const focusOffset = selectionObj.focusOffset
    const offsets = getOffsets(dom)
    if (!offsets)
      return

    // if selections is collapsed(click selection), remove selection
    if (selectionObj.isCollapsed) {
      const offset = offsets.get(anchorNode.textContent) || 0
      for (const item of selections) {
        if (item.s <= anchorOffset + offset && anchorOffset + offset <= item.e) {
          setSelections(selections.filter(i => i !== item))
          return
        }
      }
    }

    const position = anchorNode.compareDocumentPosition(focusNode)
    let forward = false
    if (position === anchorNode.DOCUMENT_POSITION_FOLLOWING)
      forward = true

    else if (position === 0)
      forward = anchorOffset < focusOffset

    const anchorNodeOffset = offsets.get(anchorNode.textContent) || 0
    const focusNodeOffset = offsets.get(focusNode.textContent) || 0
    const start = forward ? anchorOffset + anchorNodeOffset : focusOffset + focusNodeOffset
    const end = forward ? focusOffset + focusNodeOffset : anchorOffset + anchorNodeOffset

    setSelections(mergeSelection([...selections, { s: start, e: end }]))
  }

  function handleMouseUp2() {
    const selectionObj: Selection | null = (window.getSelection && window.getSelection())
    if (!selectionObj)
      return
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
              node.replaceWith(leadingText, selection, trailingText)
            }
            break
          }
          else {
            const text = node.textContent?.slice(start)
            if (text) {
              const selection = document.createElement('cooky-selection')
              selection.textContent = text
              node.replaceWith(leadingText, selection)
            }
          }
        }
        else if (started && node !== range.endContainer) {
          const text = node.textContent
          if (text) {
            const selection = document.createElement('cooky-selection')
            selection.textContent = text
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
            node.replaceWith(selection, trailingText)
          }
          break
        }
      }
      selectionObj.empty()
    }
  }

  useEffect(() => {
    dom?.addEventListener('mouseup', handleMouseUp2)
    return () => {
      dom?.removeEventListener('mouseup', handleMouseUp2)
    }
  }, [dom])

  return selections
}
