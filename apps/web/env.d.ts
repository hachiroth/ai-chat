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
  HSDropdown: typeof import('flyonui/flyonui').HSDropdown
  HSOverlay: typeof import('flyonui/flyonui').HSOverlay
}

interface ImportMetaEnv {
  VITE_SERVER_DOMAIN: string
}
