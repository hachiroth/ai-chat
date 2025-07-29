/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts/client" />
/// <reference types="./typed-router.d.ts" />

interface EventSourceEventMap {
  replying: MessageEvent<string>
  end: MessageEvent<string>
}

interface Window {
  HSTooltip: typeof import('flyonui/flyonui').HSTooltip
}
