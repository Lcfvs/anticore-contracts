import { on } from 'anticore'
import URL from 'anticore-apis/URL'
import toString from 'anticore-apis/URL/toString'
import every from 'anticore-core/Array/every'
import curry from 'anticore-core/Function/curry'
import global from 'anticore-core/global'
import empty from 'anticore-core/Object/empty'
import replace from 'anticore-core/String/replace'
import document from 'anticore-dom/node/document'
import all from 'anticore-dom/query/all'
import closest from 'anticore-dom/query/closest'
import one from 'anticore-dom/query/one'
import text from 'anticore-dom/tree/text'

const window = global()
const history = empty()
history.entries = empty()

function cleanHref (href) {
  const url = new URL(href)

  url.hash = ''

  return toString(url)
}

function getTitle (element) {
  return text(one('h1', element)).trim()
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

on('main', function (element, next, loaded, url) {
  if (loaded && one('h1', element)) {
    register(element, url)
    window.history.pushState(null, updateTitle(element), url)
    replace(element, one('main'))
  }

  const current = url && one('body nav a.current')
  const anchors = current && all('a', closest('ol, ul', current))

  if (anchors) {
    every(anchors, curry(tagCurrent, cleanHref(url), current))
  }

  next()
})

listen()
