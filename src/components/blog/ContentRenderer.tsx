interface ContentRendererProps {
  content: string
  className?: string
}

const renderInlineFormatting = (text: string) => {
  const parts: (string | JSX.Element)[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)

    const matches = [
      linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
      boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
      italicMatch ? { type: 'italic', match: italicMatch, index: italicMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index)

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    const first = matches[0]!
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index))
    }

    if (first.type === 'link') {
      parts.push(
        <a
          key={key++}
          href={first.match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-800 underline decoration-crimson-500/40 decoration-1 underline-offset-[3px] hover:decoration-crimson-500 transition-all duration-300"
        >
          {first.match[1]}
        </a>
      )
    } else if (first.type === 'bold') {
      parts.push(
        <strong key={key++} className="font-semibold text-navy-900">
          {first.match[1]}
        </strong>
      )
    } else if (first.type === 'italic') {
      parts.push(
        <em key={key++} className="font-quote italic text-gray-700">
          {first.match[1]}
        </em>
      )
    }

    remaining = remaining.slice(first.index + first.match[0].length)
  }

  return parts
}

const ContentRenderer = ({ content, className = '' }: ContentRendererProps) => {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let i = 0
  let isFirstParagraph = true

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imageMatch) {
      const alt = imageMatch[1]
      const src = imageMatch[2]
      const captionLine = lines[i + 1]?.trim()
      let caption = ''
      if (captionLine && captionLine.startsWith('_') && captionLine.endsWith('_')) {
        caption = captionLine.slice(1, -1)
        i++
      }
      elements.push(
        <figure key={i} className="editorial-figure my-12 -mx-4 sm:mx-0 lg:-mx-16">
          <img
            src={src}
            alt={alt || ''}
            className="w-full rounded-none sm:rounded-lg"
            loading="lazy"
          />
          {caption && (
            <figcaption className="mt-4 px-4 sm:px-0 text-[13px] font-body text-gray-500 leading-relaxed tracking-wide">
              {caption}
            </figcaption>
          )}
        </figure>
      )
      i++
      continue
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2
          key={i}
          className="font-display text-[1.75rem] md:text-[2rem] font-bold text-navy-900 mt-14 mb-5 leading-[1.2] tracking-[-0.01em]"
        >
          {renderInlineFormatting(trimmed.slice(3))}
        </h2>
      )
      i++
      isFirstParagraph = true
      continue
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3
          key={i}
          className="font-display text-xl md:text-[1.375rem] font-bold text-navy-900 mt-10 mb-4 leading-[1.25] tracking-[-0.005em]"
        >
          {renderInlineFormatting(trimmed.slice(4))}
        </h3>
      )
      i++
      isFirstParagraph = true
      continue
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
        items.push(lines[i].trim().replace(/^[-*]\s/, ''))
        i++
      }
      elements.push(
        <ul key={i} className="my-6 space-y-3 pl-0">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-4 font-body text-[1.125rem] text-gray-700 leading-[1.75]">
              <span className="w-[5px] h-[5px] rounded-full bg-navy-900 mt-[0.7em] shrink-0" />
              <span>{renderInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      )
      isFirstParagraph = false
      continue
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2))
        i++
      }
      elements.push(
        <blockquote
          key={i}
          className="editorial-quote my-10 py-1 pl-6 md:pl-8 border-l-[3px] border-navy-900"
        >
          <p className="font-quote text-[1.375rem] md:text-[1.5rem] text-navy-800 leading-[1.55] tracking-[0.005em]">
            {renderInlineFormatting(quoteLines.join(' '))}
          </p>
        </blockquote>
      )
      isFirstParagraph = false
      continue
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableRows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        const row = lines[i].trim()
        if (row.match(/^\|[\s\-:|]+\|$/)) {
          i++
          continue
        }
        const cells = row.slice(1, -1).split('|').map(c => c.trim())
        tableRows.push(cells)
        i++
      }
      if (tableRows.length > 0) {
        const headerRow = tableRows[0]
        const bodyRows = tableRows.slice(1)
        elements.push(
          <div key={i} className="my-8 -mx-4 sm:mx-0 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#0F1C2E] text-white">
                  {headerRow.map((cell, ci) => (
                    <th key={ci} className="px-4 py-3 text-left font-semibold text-[13px] tracking-wide uppercase border border-[#0F1C2E]/20 first:rounded-tl-lg last:rounded-tr-lg">
                      {renderInlineFormatting(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#FAF6EE]'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-4 py-3 border border-gray-200 text-gray-700 leading-relaxed ${ci === 0 ? 'font-medium text-[#0F1C2E]' : ''}`}>
                        {renderInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      isFirstParagraph = false
      continue
    }

    if (trimmed === '---' || trimmed === '***') {
      elements.push(
        <div key={i} className="my-12 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="w-1 h-1 rounded-full bg-gray-300" />
          </div>
        </div>
      )
      i++
      isFirstParagraph = true
      continue
    }

    const dropCapClass = isFirstParagraph ? ' editorial-drop-cap' : ''
    elements.push(
      <p
        key={i}
        className={`font-body text-[1.125rem] md:text-[1.1875rem] text-gray-800 leading-[1.8] tracking-[0.003em]${dropCapClass}`}
      >
        {renderInlineFormatting(trimmed)}
      </p>
    )
    isFirstParagraph = false
    i++
  }

  return (
    <div className={`editorial-content space-y-6 ${className}`}>
      {elements}
    </div>
  )
}

export default ContentRenderer
