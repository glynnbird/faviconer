const request = require('../request.js')
const nock = require('nock')
const URL = 'https://fakedomain.com'
const PATH = '/mypath'
const PATH2 = '/mypath2'
const RESPONSE = 'Hello world'
const NOT_FOUND = 'Not Found'
const BODY = { a: 1, b: 'two', c: true }

afterEach(() => {
  nock.cleanAll()
})

test('check 200', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 301 - relative location', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(301, '', { location: PATH2 })
    .get(PATH2)
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 301 - absolute location', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(301, '', { location: URL + PATH2 })
    .get(PATH2)
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 302 - relative location', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(302, '', { location: PATH2 })
    .get(PATH2)
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 302 - absolute location', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(302, '', { location: URL + PATH2 })
    .get(PATH2)
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 200 - POST', async () => {
  // mocks
  const scope = nock(URL)
    .post(PATH, 'a=1&b=two&c=true')
    .reply(200, RESPONSE)

  const p = await request({ url: URL + PATH, method: 'post', data: BODY })
  expect(typeof p).toBe('string')
  expect(p).toBe(RESPONSE)
  expect(scope.isDone()).toBe(true)
})

test('check 404', async () => {
  // mocks
  const scope = nock(URL)
    .get(PATH)
    .reply(404, NOT_FOUND)

  try {
    await request({ url: URL + PATH })
  } catch (e) {
    expect(e).toMatch(NOT_FOUND)
  }
  expect(scope.isDone()).toBe(true)
})
