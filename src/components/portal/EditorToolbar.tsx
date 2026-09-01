import { useState, useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  Image,
  Link,
  Minus,
  X
} from 'lucide-react'

interface EditorToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onInsert: (newContent: string) => void
  content: string
}

interface ModalState {
  type: 'image' | 'link' | null
  url: string
  text: string
  caption: string
}

const EditorToolbar = ({ textareaRef, onInsert, content }: EditorToolbarProps) => {
  const [modal, setModal] = useState<ModalState>({ type: null, url: '', text: '', caption: '' })
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModal({ type: null, url: '', text: '', caption: '' })
      }
    }
    if (modal.type) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [modal.type])

  const getSelection = () => {
    const ta = textareaRef.current
    if (!ta) return { start: 0, end: 0, selected: '' }
    return {
      start: ta.selectionStart,
      end: ta.selectionEnd,
      selected: content.slice(ta.selectionStart, ta.selectionEnd),
    }
  }

  const replaceSelection = (before: string, after: string, placeholder: string) => {
    const { start, end, selected } = getSelection()
    const text = selected || placeholder
    const newContent = content.slice(0, start) + before + text + after + content.slice(end)
    onInsert(newContent)
    setTimeout(() => {
      const ta = textareaRef.current
      if (ta) {
        ta.focus()
        const newStart = start + before.length
        const newEnd = newStart + text.length
        ta.setSelectionRange(newStart, newEnd)
      }
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const { start, end } = getSelection()
    const needsNewline = start > 0 && content[start - 1] !== '\n'
    const prefix = needsNewline ? '\n\n' : ''
    const newContent = content.slice(0, start) + prefix + text + content.slice(end)
    onInsert(newContent)
    setTimeout(() => {
      const ta = textareaRef.current
      if (ta) {
        ta.focus()
        const pos = start + prefix.length + text.length
        ta.setSelectionRange(pos, pos)
      }
    }, 0)
  }

  const wrapLinePrefix = (prefix: string) => {
    const { start, end, selected } = getSelection()
    if (selected) {
      const lines = selected.split('\n').map(l => `${prefix}${l}`)
      const newContent = content.slice(0, start) + lines.join('\n') + content.slice(end)
      onInsert(newContent)
    } else {
      const needsNewline = start > 0 && content[start - 1] !== '\n'
      const pre = needsNewline ? '\n' : ''
      const newContent = content.slice(0, start) + pre + prefix + content.slice(end)
      onInsert(newContent)
      setTimeout(() => {
        const ta = textareaRef.current
        if (ta) {
          ta.focus()
          const pos = start + pre.length + prefix.length
          ta.setSelectionRange(pos, pos)
        }
      }, 0)
    }
  }

  const handleInsertImage = () => {
    if (!modal.url.trim()) return
    let markup = `![${modal.text || ''}](${modal.url.trim()})`
    if (modal.caption.trim()) {
      markup += `\n_${modal.caption.trim()}_`
    }
    insertAtCursor(markup + '\n')
    setModal({ type: null, url: '', text: '', caption: '' })
  }

  const handleInsertLink = () => {
    if (!modal.url.trim()) return
    const linkText = modal.text.trim() || modal.url.trim()
    replaceSelection('[', `](${modal.url.trim()})`, linkText)
    setModal({ type: null, url: '', text: '', caption: '' })
  }

  const buttons = [
    { icon: Bold, label: 'Bold', action: () => replaceSelection('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', action: () => replaceSelection('*', '*', 'italic text') },
    { divider: true },
    { icon: Heading2, label: 'Heading', action: () => wrapLinePrefix('## ') },
    { icon: Heading3, label: 'Subheading', action: () => wrapLinePrefix('### ') },
    { divider: true },
    { icon: List, label: 'Bullet List', action: () => wrapLinePrefix('- ') },
    { icon: Quote, label: 'Quote', action: () => wrapLinePrefix('> ') },
    { icon: Minus, label: 'Divider', action: () => insertAtCursor('\n---\n') },
    { divider: true },
    { icon: Image, label: 'Insert Image', action: () => setModal({ type: 'image', url: '', text: '', caption: '' }) },
    { icon: Link, label: 'Insert Link', action: () => setModal({ type: 'link', url: '', text: getSelection().selected, caption: '' }) },
  ]

  return (
    <div className="relative">
      <div className="flex items-center gap-0.5 p-1.5 bg-gray-50 border border-gray-200 rounded-lg mb-2 flex-wrap">
        {buttons.map((btn, i) => {
          if ('divider' in btn && btn.divider) {
            return <div key={i} className="w-px h-6 bg-gray-200 mx-1" />
          }
          const Icon = btn.icon!
          return (
            <button
              key={i}
              type="button"
              onClick={btn.action}
              title={btn.label}
              className="p-2 rounded-md hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-900 transition-all"
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      {modal.type && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onMouseDown={e => { if (e.target === e.currentTarget) setModal({ type: null, url: '', text: '', caption: '' }) }}>
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 space-y-4" onMouseDown={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {modal.type === 'image' ? 'Insert Image' : 'Insert Link'}
              </h3>
              <button
                type="button"
                onClick={() => setModal({ type: null, url: '', text: '', caption: '' })}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {modal.type === 'image' ? 'Image URL' : 'Link URL'}
              </label>
              <input
                type="url"
                value={modal.url}
                onChange={e => setModal(prev => ({ ...prev, url: e.target.value }))}
                placeholder={modal.type === 'image' ? 'https://images.pexels.com/...' : 'https://...'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                autoFocus
              />
            </div>

            {modal.type === 'image' && modal.url && (
              <img
                src={modal.url}
                alt="Preview"
                className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {modal.type === 'image' ? 'Alt Text' : 'Link Text'}
              </label>
              <input
                type="text"
                value={modal.text}
                onChange={e => setModal(prev => ({ ...prev, text: e.target.value }))}
                placeholder={modal.type === 'image' ? 'Describe the image...' : 'Display text'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
              />
            </div>

            {modal.type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={modal.caption}
                  onChange={e => setModal(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Photo by Pexels..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModal({ type: null, url: '', text: '', caption: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={modal.type === 'image' ? handleInsertImage : handleInsertLink}
                disabled={!modal.url.trim()}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorToolbar
