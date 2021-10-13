'use strict'

const { test } = require('tap')
const parseChat = require('../src/lib/parse-chat')

test('should throw an error when non-string is passed in', async ({ throws }) => {
  throws(function () { parseChat([]) })
})

test('should return empty array when nothing passed in', async ({ same }) => {
  same(parseChat(), [])
  same(parseChat(''), [])
})

test('should parse line into user, time, message, and context', async ({ same }) => {
  const chat = '11:01:00 From Michael Scotch to Everyone : Gm'
  same(parseChat(chat), [{
    user: 'Michael Scotch',
    message: 'Gm',
    context: 'Everyone',
    time: {
      raw: '11:01:00',
      hour: 11,
      minute: 1,
      second: 0
    }
  }])
})

test('should keep multi-line messages together', async ({ same }) => {
  const chat = `11:01:00 From Michael Scotch to Everyone : Gm
to

you`

  const expected = `Gm
to

you`

  const parsed = parseChat(chat)
  same(parsed[0].message, expected)
})
