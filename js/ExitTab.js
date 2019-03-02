class ExitTab {
	/**
	 * Creates a new ExitTab.
	 * @method constructor
	 * @param  {String} exitNumber Number to display on the exit tab.
	 * @param  {String} tabWidth Width of the exit tab (narrow or wide).
	 */
	constructor (exitNumber, tabWidth) {
		this.exitNumber = exitNumber;
		if (this.tabWidths.includes(tabWidth)) {
			this.tabWidth = tabWidth;
		} else {
			this.tabWidth = this.tabWidths[0];
		}
	}
}

ExitTab.prototype.tabWidths = ["Narrow", "Wide"];
