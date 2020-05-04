const TapReporter = require('testem/lib/reporters/tap_reporter');

class FailureOnlyReporter extends TapReporter {
	constructor(...args) {
		super(...args);
		this._reportCount = 0;
		this._increment = 0;
		this._startTime = new Date().getTime();
	}

	display(prefix, result) {
		this._reportCount++;

		if (!result.passed) {
			super.display(prefix, result);
		}

		if (parseInt(this._reportCount / 50) !== this._increment) {
			this.out.write('tests run: ' + this._reportCount + '\n');
			this._increment++;
		}
	}
}

module.exports = FailureOnlyReporter;
