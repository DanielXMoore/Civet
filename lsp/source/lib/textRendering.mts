import type ts from 'typescript'
type SymbolDisplayPart = ts.server.protocol.SymbolDisplayPart
type FileSpan = ts.server.protocol.FileSpan
type JSDocTagInfo = ts.server.protocol.JSDocTagInfo

// Based on https://github.com/microsoft/vscode/blob/main/extensions/typescript-language-features/src/languageFeatures/util/textRendering.ts

export function asPlainText(parts: SymbolDisplayPart[] | string): string {
  if (typeof parts === "string") return parts
  return parts.map(part => part.text).join('')
}

export function asPlainTextWithLinks(parts: SymbolDisplayPart[] | string | undefined): string {
  if (!parts) return ''
  if (typeof parts === 'string') return parts
  let out = ""
  let currentLink: {
    name?: string
    target?: FileSpan
    text?: string
    linkcode: boolean
  } | undefined
  for (const part of parts) {
    switch (part.kind) {
      case "link":
        if (currentLink) {
          if (currentLink.target) {
            //const file = filePathConverter.toResource(currentLink.target.file)
            const args = {
              //file: { ...file.toJSON(), $mid: undefined },
              file: currentLink.target.file,
              position: {
                lineNumber: currentLink.target.start.line - 1,
                column: currentLink.target.start.offset - 1
              }
            }
            const command = "command:_typescript.openJsDocLink?" +
              encodeURIComponent(JSON.stringify([args]))
            const linkText = currentLink.text || escapeBackTicks(currentLink.name ?? "")
            out += `[${currentLink.linkcode ? '`' + linkText + '`' : linkText}](${command})`
          } else {
            const text = currentLink.text ?? currentLink.name
            if (text) {
              if (/^https?:/.test(text)) {
                const subparts = text.split(' ')
                if (subparts.length === 1 && !currentLink.linkcode) {
                  out += `<${subparts[0]}>`
                } else {
                  const linkText = subparts.length > 1
                    ? subparts.slice(1).join(' ')
                    : subparts[0]
                  out += `[${currentLink.linkcode ? '`' + escapeBackTicks(linkText) + '`' : linkText}](${subparts[0]})`
                }
              } else {
                out += escapeBackTicks(text)
              }
            }
          }
        } else {
          currentLink = {
            linkcode: part.text === "{@linkcode "
          }
        }
        currentLink = undefined
        break
      case "linkName":
        if (currentLink) {
          currentLink.name = part.text
          // @ts-ignore Proto.JSDocLinkDisplayPart
          currentLink.target = part.target
        }
        break
      case "linkText":
        if (currentLink) currentLink.text = part.text
        break
      default:
        out += part.text
    }
  }
  return out
}

function escapeBackTicks(text: string): string {
  return text.replace(/`/g, '\\$&');
}

export function tagsToMarkdown(tags: JSDocTagInfo[]): string {
  return tags.map(getTagDocumentation).join('  \n\n')
}

function getTagDocumentation(tag: JSDocTagInfo): string | undefined {
  switch (tag.name) {
    case "augments":
    case "extends":
    case "param":
    case "template":
      const body = getTagBody(tag)
      if (body?.length === 3) {
        const [, param, doc] = body
        const label = `*@${tag.name}* \`${param}\``
        if (!doc) return label
        return label + (doc.match(/\r\n|\n/g) ? '  \n' + doc : ` \u2014 ${doc}`)
      }
      break
    case "return":
    case "returns":
      if (!tag.text?.length) return undefined
      break
  }
  const label = `*@${tag.name}*`
  const text = getTagBodyText(tag)
  if (!text) return label
  return label + (text.match(/\r\n|\n/g) ? '  \n' + text : ` \u2014 ${text}`)
}

function getTagBody(tag: JSDocTagInfo): Array<string> | undefined {
  if (tag.name === "template") {
    const parts = tag.text
    if (parts && typeof parts !== "string") {
      const params = parts
      .filter(p => p.kind === "typeParameterName")
      .map(p => p.text)
      .join(", ")
      const docs = parts
      .filter(p => p.kind === "text")
      .map(p => asPlainTextWithLinks(p.text.replace(/^\s*-?\s*/, "")))
      .join(", ")
      return params ? ["", params, docs] : undefined
    }
  }
  return asPlainTextWithLinks(tag.text).split(/^(\S+)\s*-?\s*/)
}

function getTagBodyText(tag: JSDocTagInfo): string | undefined {
  if (!tag.text) return

  function makeCodeblock(text: string): string {
    if (/^\s*[~`]{3}/m.test(text)) return text
    return '```\n' + text + '\n```';
  }

  let text = asPlainTextWithLinks(tag.text)
  switch (tag.name) {
    case "example":
      text = asPlainText(tag.text)
      const captionTagMatches = text.match(/<caption>(.*?)<\/caption>\s*(\r\n|\n)/)
      if (captionTagMatches && captionTagMatches.index === 0) {
        return captionTagMatches[1] + "\n" +
          makeCodeblock(text.slice(captionTagMatches[0].length))
      } else {
        return makeCodeblock(text)
      }
    case "author":
      const emailMatch = text.match(/(.+)\s<([-.\w]+@[-.\w]+)>/)
      if (!emailMatch) return text
      return `${emailMatch[1]} ${emailMatch[2]}`
    case "default":
      return makeCodeblock(text)
    default:
      return text
  }
}
