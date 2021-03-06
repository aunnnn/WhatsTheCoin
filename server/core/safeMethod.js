const { send } = require('micro')

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res)
  } catch (err) {
    console.log(err.stack)
    send(res, 500, {
      message: '[Error] ' + err
    })
  }
}

const safe = (method) => (path, handler) => {
  return handleErrors(method(path, handler))
}

module.exports = safe
