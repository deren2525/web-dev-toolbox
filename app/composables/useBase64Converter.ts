export const useBase64Converter = () => {
  const input = ref('')
  const output = ref('')
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const encode = () => {
    error.value = ''
    try {
      const bytes = new TextEncoder().encode(input.value)
      let binary = ''
      for (const byte of bytes) binary += String.fromCharCode(byte)
      output.value = btoa(binary)
      status.value = 'エンコードしました。'
    } catch {
      error.value = 'エンコードできませんでした。'
    }
  }

  const decode = () => {
    error.value = ''
    try {
      const normalized = input.value.trim().replace(/\s/g, '')
      const binary = atob(normalized)
      output.value = new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(binary, (character) => character.charCodeAt(0)),
      )
      status.value = 'デコードしました。'
    } catch {
      output.value = ''
      error.value = '正しいBase64文字列を入力してください。'
    }
  }

  const copy = async () => {
    error.value = ''
    if (await copyText(output.value)) status.value = 'コピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  return { input, output, error, status, encode, decode, copy }
}
