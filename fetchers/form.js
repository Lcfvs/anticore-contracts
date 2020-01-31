import { on, fetch } from 'anticore/index.js'
import fromForm from 'anticore-core/apis/Request/fromForm.js'
import empty from 'anticore-core/Object/empty.js'
import onSubmit from 'anticore-dom/emitter/onSubmit.js'
import all from 'anticore-dom/query/all.js'
import removeAll from 'anticore-dom/tree/removeAll.js'

const defaults = empty({
  interval: 1000,
  retries: Infinity,
  selector: `
form:not([target]),
form[target=_self]
`
})

export default function anchor (options) {
  const config = empty(defaults, options || defaults)

  function build (event) {
    removeAll(all('.error', this))
    fetch(event, this, fromForm(this), config)
  }

  on(config.selector, (element, next) => {
    onSubmit(element, build)
    next()
  })
}

export const interval = defaults.interval
export const retries = defaults.retries
export const selector = defaults.selector
