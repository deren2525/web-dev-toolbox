export const useJsonFormatter = () => {
  const input = ref('')
  const output = ref('')
  const error = ref('')
  const status = ref('')
  const { copyText } = useClipboardCopy()

  const convert = (pretty: boolean) => {
    error.value = ''
    status.value = ''
    try {
      output.value = JSON.stringify(JSON.parse(input.value), null, pretty ? 2 : 0)
      status.value = pretty ? 'JSONを整形しました。' : 'JSONを圧縮しました。'
    } catch (caughtError) {
      output.value = ''
      error.value =
        caughtError instanceof Error
          ? `構文エラー: ${caughtError.message}`
          : 'JSONを解析できませんでした。'
    }
  }

  const copy = async () => {
    error.value = ''
    if (await copyText(output.value)) status.value = 'コピーしました。'
    else error.value = 'コピーできませんでした。値を選択してコピーしてください。'
  }

  return { input, output, error, status, convert, copy }
}
