import { on, fetch } from 'anticore'
import fromForm from 'anticore-apis/Request/fromForm'
import empty from 'anticore-core/Object/empty'
import onSubmit from 'anticore-dom/emitter/onSubmit'
import all from 'anticore-dom/query/all'
import removeAll from 'anticore-dom/tree/removeAll'

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
