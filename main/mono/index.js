import { on } from 'anticore/index.js'
import URL from 'anticore-core/apis/URL/index.js'
import toString from 'anticore-core/apis/URL/toString.js'
import every from 'anticore-core/Array/every.js'
import curry from 'anticore-core/Function/curry.js'
import global from 'anticore-core/global/index.js'
import empty from 'anticore-core/Object/empty.js'
import replace from 'anticore-core/String/replace.js'
import trim from 'anticore-core/String/trim.js'
import contains from 'anticore-dom/info/contains.js'
import document from 'anticore-dom/node/document.js'
import all from 'anticore-dom/query/all.js'
import closest from 'anticore-dom/query/closest.js'
import one from 'anticore-dom/query/one.js'
import text from 'anticore-dom/tree/text.js'
import toggle from 'anticore-dom/tree/replace.js'

const window = global()
const history = empty()
history.entries = empty()

function cleanHref (href) {
  const url = new URL(href)

  url.hash = ''

  return toString(url)
}

function getTitle (element) {
  return trim(text(one('h1', element)))
}

function updateTitle (element) {
  const title = replace(history.branding, '$1', getTitle(element))

  document().title = title

  return title
}

function listen () {
  const main = one('main')

  register(main, cleanHref(document().location.href))
  window.addEventListener('popstate', onPopState)
  history.branding = replace(document().title.trim(), getTitle(main), '$1')
}

function onPopState (event) {
  const registered = history.entries[cleanHref(event.target.location.href)]
  const current = one('main')

  if (registered && registered !== current) {
    updateTitle(registered)
    replace(registered, current)
  }
}

function register (element, url) {
  if (url) {
    history.entries[url] = element
  }
}

function tagCurrent (url, current, candidate) {
  if (cleanHref(candidate.href) === url) {
    current.classList.remove('current')
    candidate.classList.add('current')

    return false
  }

  return true
}

on('main', (element, next, url) => {
  if (!contains(document(), element) && one('h1', element)) {
    register(element, url)
    window.history.pushState(null, updateTitle(element), url)
    toggle(element, one('main'))
  }

  const current = url && one('body nav a.current')
  const anchors = current && all('a', closest('ol, ul', current))

  if (anchors) {
    every(anchors, curry(tagCurrent, cleanHref(url), current))
  }

  next()
})

listen()
