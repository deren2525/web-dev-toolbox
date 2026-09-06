export const useTimestampConverter = () => {
  const timestamp = ref(String(Math.floor(Date.now() / 1000)))
  const unit = ref<'seconds' | 'milliseconds'>('seconds')
  const dateTime = ref('')
  const asUtc = ref(false)
  const localDateResult = ref('')
  const utcDateResult = ref('')
  const unixSeconds = ref('')
  const unixMilliseconds = ref('')
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const formatLocal = (date: Date) =>
    new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(date)

  const fromTimestamp = () => {
    error.value = ''
    const numericTimestamp = Number(timestamp.value)
    const date = new Date(unit.value === 'seconds' ? numericTimestamp * 1000 : numericTimestamp)
    if (!Number.isFinite(numericTimestamp) || Number.isNaN(date.getTime())) {
      localDateResult.value = ''
      utcDateResult.value = ''
      error.value = '有効なタイムスタンプを入力してください。'
      return
    }
    localDateResult.value = formatLocal(date)
    utcDateResult.value = date.toISOString()
  }

  const toTimestamp = () => {
    error.value = ''
    if (!dateTime.value) {
      error.value = '日時を入力してください。'
      return
    }
    const date = new Date(asUtc.value ? `${dateTime.value}Z` : dateTime.value)
    if (Number.isNaN(date.getTime())) {
      error.value = '有効な日時を入力してください。'
      return
    }
    unixSeconds.value = String(Math.floor(date.getTime() / 1000))
    unixMilliseconds.value = String(date.getTime())
  }

  const copyResult = async (value: string) => {
    error.value = ''
    if (await copyText(value)) status.value = '変換結果をコピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  onMounted(() => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    dateTime.value = date.toISOString().slice(0, 19)
    fromTimestamp()
  })

  return {
    timestamp,
    unit,
    dateTime,
    asUtc,
    localDateResult,
    utcDateResult,
    unixSeconds,
    unixMilliseconds,
    error,
    status,
    fromTimestamp,
    toTimestamp,
    copyResult,
  }
}
