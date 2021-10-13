'use strict'

const META_MSG_DIVIDE = ' : '
const META_USER_DIVIDE = ' From '
const META_CONTEXT_DIVIDE = ' to '

function parseLine (line) {
  // Split the metadata from the message
  const [metadata, message] = line.split(META_MSG_DIVIDE)

  // Split the metadata pieces
  const [timeRaw, userContext] = metadata.split(META_USER_DIVIDE)
  const [user, context] = userContext.split(META_CONTEXT_DIVIDE)

  // Parse time
  const [hour, minute, second] = timeRaw.split(':').map(x => parseInt(x))

  return {
    user,
    context,
    message,
    time: {
      raw: timeRaw,
      hour,
      minute,
      second
    }
  }
}

function parseChat (messageText) {
  if (!messageText) return []
  if (typeof messageText !== 'string') throw new Error('Must pass in string to be parsed')

  const messages = messageText.split('\n').reduce((acc, val) => {
    // Support multiline messages
    const timeMatcher = /^[0-9]{2}:[0-9]{2}:[0-9]{2}/

    // If the line does not start with a timestamp, its probably multiline message
    // so join it to the last message
    if ((val.match(timeMatcher) || []).length === 0) {
      return [...acc.splice(0, acc.length - 1), `${acc.slice(-1)}\n${val}`]
    }

    // strap line onto results because its single line message or start of a multiline
    return [...acc, val]
  }, [])

  return messages.map(parseLine)
}

module.exports = parseChat
