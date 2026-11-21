// Fonts served from our own site (no requests to Google: GDPR), latin + latin-ext subsets
import '@fontsource-variable/fraunces'
import '@fontsource-variable/inter'
import { loadLanguage } from './i18n'

// Load the dictionaries of the language in use first, then the app (its modules call t() on import)
loadLanguage().catch(() => {}).then(() => import('./boot'))
