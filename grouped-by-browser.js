const FailureOnlyReporter = require('./failure-only-reporter');

class FailureOnlyPerBrowserReporter extends FailureOnlyReporter {
	constructor(...args) {
		super(...args);
		this._resultsByBrowser = {};
	}

	report(prefix, data) {
		if (!this._resultsByBrowser[prefix]) {
			this._resultsByBrowser[prefix] = {
				total: 0,
				pass: 0,
				skipped: 0
			};
		}

		this._resultsByBrowser[prefix].total++;
		if (data.skipped) {
			this._resultsByBrowser[prefix].skipped++;
		} else if (data.passed) {
			this._resultsByBrowser[prefix].pass++;
		}

		super.report(prefix, data);
	}

	millisecondsToMinutesAndSeconds(millis) {
		var minutes = Math.floor(millis / 60000);
		var seconds = parseInt((millis % 60000) / 1000, 10);
		return seconds === 60 ? minutes + 1 + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
	}

	summaryDisplay() {
		let lines = [];
		let originalSummary = super.summaryDisplay();
		let resultsByBrowser = this._resultsByBrowser;
		Object.keys(resultsByBrowser).forEach((browser) => {
			let results = resultsByBrowser[browser];

			lines.push('#');
			lines.push('# Browser: ' + browser);
			lines.push('# tests ' + results.total);
			lines.push('# pass  ' + results.pass);
			lines.push('# skip  ' + results.skipped);
			lines.push('# fail  ' + (results.total - results.pass - results.skipped));
			lines.push('# execution time ' + this.millisecondsToMinutesAndSeconds(new Date().getTime() - this._startTime));
		});
		lines.push('#');
		return lines.join('\n') + '\n' + originalSummary;
	}
}

module.exports = FailureOnlyPerBrowserReporter;
