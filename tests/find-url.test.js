'use strict'

const { test } = require('tap')
const findUrl = require('../src/lib/find-url')

test('should return empty array when no url found', async ({ same }) => {
  same(findUrl('no url here'), [])
})

test('should return empty array when no message or empty message', async ({ same }) => {
  same(findUrl(), [])
  same(findUrl(''), [])
})
