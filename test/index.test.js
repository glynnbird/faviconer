const faviconer = require('../index.js')
const nock = require('nock')
const URL = 'https://fakedomain.com'
const PATH = '/mypath'
const PATH2 = '/mypath2'
const fs = require('fs')

afterEach(() => {
  nock.cleanAll()
})

test('check icon fetch 1 - BBC', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test1.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(typeof p).toBe('string')
  expect(p).toBe('https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/5.3.0/apple-touch-icon-57x57-precomposed.png')
  expect(scope.isDone()).toBe(true)
})

test('check icon fetch 2 - Guardian', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test2.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(typeof p).toBe('string')
  expect(p).toBe('https://assets.guim.co.uk/images/favicons/fee5e2d638d1c35f6d501fa397e53329/152x152.png')
  expect(scope.isDone()).toBe(true)
})

test('check icon fetch 3 - relative URL', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test4.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(typeof p).toBe('string')
  expect(p).toBe(URL + '/favicon.ico')
  expect(scope.isDone()).toBe(true)
})

test('check icon fetch 4 - redirect URL', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test4.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(301, '', { location: URL + PATH2 })
    .get(PATH2)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(typeof p).toBe('string')
  expect(p).toBe(URL + '/favicon.ico')
  expect(scope.isDone()).toBe(true)
})

test('check icon fail 1 - No icon', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test3.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(p).toBeNull()
  expect(scope.isDone()).toBe(true)
})

test('check icon fail 2 - 404', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(404, 'Not Found')

  const p = await faviconer.get(URL + PATH)
  expect(p).toBeNull()
  expect(scope.isDone()).toBe(true)
})

test('check icon fail 2 - invalid url', async () => {
  const p = await faviconer.get('asfasfasfa')
  expect(p).toBeNull()
})

test('check icon fail 3 - No link', async () => {
  // mocks
  const HTML = fs.readFileSync('./test/test5.html').toString()
  const scope = nock(URL)
    .get(PATH)
    .reply(200, HTML)

  const p = await faviconer.get(URL + PATH)
  expect(p).toBeNull()
  expect(scope.isDone()).toBe(true)
})
