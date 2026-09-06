export const useClipboardCopy = () => {
  const copyWithTextarea = (value: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      return document.execCommand('copy')
    } finally {
      textarea.remove()
    }
  }

  const copyText = async (value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        return true
      }
      return copyWithTextarea(value)
    } catch {
      try {
        return copyWithTextarea(value)
      } catch {
        return false
      }
    }
  }

  return { copyText }
}
