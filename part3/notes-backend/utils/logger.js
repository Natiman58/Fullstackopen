// to log all the console errors or messages
const info = (...params) => {
	console.log(...params)
}

const error = (...params) => {
	console.error(...params)
}

module.exports = { info, error }