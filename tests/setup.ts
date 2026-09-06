import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBase64Converter } from '../app/composables/useBase64Converter'
import { useBrowserChecker } from '../app/composables/useBrowserChecker'
import { useClipboardCopy } from '../app/composables/useClipboardCopy'
import { useHashGenerator } from '../app/composables/useHashGenerator'
import { useJsonFormatter } from '../app/composables/useJsonFormatter'
import { useJwtDecoder } from '../app/composables/useJwtDecoder'
import { useTextCounter } from '../app/composables/useTextCounter'
import { useTimestampConverter } from '../app/composables/useTimestampConverter'
import { useUrlEncoder } from '../app/composables/useUrlEncoder'
import { useUuidGenerator } from '../app/composables/useUuidGenerator'

Object.assign(globalThis, {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useBase64Converter,
  useBrowserChecker,
  useClipboardCopy,
  useHashGenerator,
  useJsonFormatter,
  useJwtDecoder,
  useTextCounter,
  useTimestampConverter,
  useUrlEncoder,
  useUuidGenerator,
  watch,
})
