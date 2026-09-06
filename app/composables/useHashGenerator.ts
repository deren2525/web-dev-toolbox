export const useHashGenerator = () => {
  const algorithm = ref<'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256')
  const input = ref('')
  const file = ref<File | null>(null)
  const output = ref('')
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const selectFile = (event: Event) => {
    file.value = (event.target as HTMLInputElement).files?.[0] || null
    status.value = file.value ? `${file.value.name}を選択しました。` : ''
  }

  const generate = async () => {
    error.value = ''
    status.value = ''
    output.value = ''
    try {
      const data = file.value
        ? await file.value.arrayBuffer()
        : new TextEncoder().encode(input.value)
      const digest = await crypto.subtle.digest(algorithm.value, data)
      output.value = Array.from(new Uint8Array(digest), (byte) =>
        byte.toString(16).padStart(2, '0'),
      ).join('')
      status.value = `${algorithm.value}ハッシュを生成しました。`
    } catch {
      error.value = 'ハッシュを生成できませんでした。HTTPS環境で再度お試しください。'
    }
  }

  const copy = async () => {
    error.value = ''
    if (await copyText(output.value)) status.value = '値をコピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  return { algorithm, input, output, error, status, selectFile, generate, copy }
}
