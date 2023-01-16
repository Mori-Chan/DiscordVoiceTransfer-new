const { Readable } = require('stream');
const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe])

class Silence extends Readable {
	_read() {this.push(Buffer.from([0xF8, 0xFF, 0xFE]))}
}

module.exports = { Silence };