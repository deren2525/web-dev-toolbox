export const useTextCounter = () => {
  const input = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()
  const stats = computed(() => {
    const text = input.value
    return [
      { label: '文字数', value: Array.from(text).length },
      { label: 'UTF-8バイト数', value: new TextEncoder().encode(text).length },
      { label: '行数', value: text ? text.split(/\r\n|\r|\n/).length : 0 },
      { label: '単語数', value: text.trim() ? text.trim().split(/\s+/u).length : 0 },
    ]
  })

  const copy = async (value: number) => {
    status.value = (await copyText(String(value)))
      ? '値をコピーしました。'
      : 'コピーできませんでした。値を選択してコピーしてください。'
  }

  const clear = () => {
    input.value = ''
    status.value = ''
  }

  return { input, status, stats, copy, clear }
}
