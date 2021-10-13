'use strict'

module.exports = function (text) {
  if (!text) return []

  return text.match(/((http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,63}(\/\S*)?)/g) || []
}
