import { on, fetch } from 'anticore/index.js'
import fromAnchor from 'anticore-core/apis/Request/fromAnchor.js'
import empty from 'anticore-core/Object/empty.js'
import onClick from 'anticore-dom/emitter/onClick.js'

const defaults = empty({
  interval: 1000,
  redirect: 'follow',
  retries: Infinity,
  selector: `
a[href^="http"]:not([download]):not([target]),
a[href^="http"][target=_self]:not([download]),
a[href^="."]:not([download]):not([target]),
a[href^="."][target=_self]:not([download]),
a[href^="/"]:not([download]):not([target]),
a[href^="/"][target=_self]:not([download])
`
})

export default function anchor (options) {
  const config = empty(defaults, options || defaults)
  const { redirect } = config

  function build (event) {
    fetch(event, this, fromAnchor(this, { redirect }), config)
  }

  on(config.selector, (element, next) => {
    onClick(element, build)
    next()
  })
}

export const interval = defaults.interval
export const redirect = defaults.redirect
export const retries = defaults.retries
export const selector = defaults.selector
