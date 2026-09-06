export const useUuidGenerator = () => {
  const count = ref(10)
  const uuids = ref<string[]>([])
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const generate = () => {
    const safeCount = Math.min(100, Math.max(1, Math.trunc(count.value || 1)))
    count.value = safeCount
    uuids.value = Array.from({ length: safeCount }, () => crypto.randomUUID())
    status.value = `${safeCount}件生成しました。`
  }

  const copy = async () => {
    if (!uuids.value.length) generate()
    status.value = (await copyText(uuids.value.join('\n')))
      ? 'コピーしました。'
      : 'コピーできませんでした。値を選択してコピーしてください。'
  }

  onMounted(generate)

  return { count, uuids, status, generate, copy }
}
