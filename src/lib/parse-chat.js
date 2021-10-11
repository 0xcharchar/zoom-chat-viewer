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

function parseChat (messages) {
  if (!messages || messages.length === 0) return []

  return messages.map(parseLine)
}

module.exports = parseChat
