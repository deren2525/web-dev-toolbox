export const useUrlEncoder = () => {
  const input = ref('')
  const output = ref('')
  const wholeUri = ref(false)
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const encode = () => {
    error.value = ''
    try {
      output.value = wholeUri.value ? encodeURI(input.value) : encodeURIComponent(input.value)
      status.value = 'エンコードしました。'
    } catch {
      error.value = 'エンコードできませんでした。'
    }
  }

  const decode = () => {
    error.value = ''
    try {
      output.value = wholeUri.value ? decodeURI(input.value) : decodeURIComponent(input.value)
      status.value = 'デコードしました。'
    } catch {
      output.value = ''
      error.value = '不正なパーセントエンコードが含まれています。'
    }
  }

  const copy = async () => {
    error.value = ''
    if (await copyText(output.value)) status.value = 'コピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  return { input, output, wholeUri, error, status, encode, decode, copy }
}
