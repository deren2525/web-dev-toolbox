import { copyFileSync, existsSync } from 'node:fs'

const generatedPage = new URL('../.output/public/404/index.html', import.meta.url)
const firebaseErrorPage = new URL('../.output/public/404.html', import.meta.url)

if (!existsSync(generatedPage)) throw new Error('生成済みの404ページが見つかりません。')

copyFileSync(generatedPage, firebaseErrorPage)
