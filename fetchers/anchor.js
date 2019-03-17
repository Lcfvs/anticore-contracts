import { on, fetch } from 'anticore'
import fromAnchor from 'anticore-core/apis/Request/fromAnchor'
import empty from 'anticore-core/Object/empty'
import onClick from 'anticore-dom/emitter/onClick'

const defaults = empty({
  interval: 1000,
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

  function build (event) {
    fetch(event, this, fromAnchor(this), config)
  }

  on(config.selector, (element, next) => {
    onClick(element, build)
    next()
  })
}

export const interval = defaults.interval
export const retries = defaults.retries
export const selector = defaults.selector
