import '@fontsource-variable/fraunces'
import '@fontsource-variable/nunito'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { I18nProvider } from './i18n'
import './index.css'
import { PrefsProvider } from './prefs'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <PrefsProvider>
        <App />
      </PrefsProvider>
    </I18nProvider>
  </StrictMode>,
)
