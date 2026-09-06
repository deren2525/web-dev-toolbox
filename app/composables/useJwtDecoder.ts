export const useJwtDecoder = () => {
  const input = ref('')
  const headerOutput = ref('')
  const payloadOutput = ref('')
  const payload = ref<Record<string, unknown>>({})
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const decodePart = (part: string) => {
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const binary = atob(padded)
    return JSON.parse(
      new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0))),
    ) as Record<string, unknown>
  }

  const formatDate = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value)
      ? new Date(value * 1000).toLocaleString('ja-JP', { timeZoneName: 'short' })
      : ''

  const claims = computed(() =>
    [
      { key: 'iss', label: '発行者（iss）' },
      { key: 'sub', label: '主体（sub）' },
      { key: 'aud', label: '対象（aud）' },
      { key: 'iat', label: '発行日時（iat）' },
      { key: 'nbf', label: '有効開始（nbf）' },
      { key: 'exp', label: '有効期限（exp）' },
    ].flatMap(({ key, label }) => {
      const rawValue = payload.value[key]
      if (rawValue === undefined) return []
      const value = typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue)
      const date = ['iat', 'nbf', 'exp'].includes(key) ? formatDate(rawValue) : ''
      return [{ label, value, display: date ? `${value}（${date}）` : value }]
    }),
  )

  const decode = () => {
    error.value = ''
    status.value = ''
    headerOutput.value = ''
    payloadOutput.value = ''
    payload.value = {}
    try {
      const parts = input.value.trim().split('.')
      if (parts.length !== 3 || parts.some((part) => !part)) throw new Error()
      const header = decodePart(parts[0]!)
      payload.value = decodePart(parts[1]!)
      headerOutput.value = JSON.stringify(header, null, 2)
      payloadOutput.value = JSON.stringify(payload.value, null, 2)
      status.value = 'デコードしました。署名は検証していません。'
    } catch {
      error.value = '3つの区切りを持つ正しいJWTを入力してください。'
    }
  }

  const clear = () => {
    input.value = ''
    headerOutput.value = ''
    payloadOutput.value = ''
    payload.value = {}
    error.value = ''
    status.value = ''
  }

  const copy = async (value: string) => {
    error.value = ''
    if (await copyText(value)) status.value = '値をコピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  return { input, headerOutput, payloadOutput, error, status, claims, decode, clear, copy }
}
