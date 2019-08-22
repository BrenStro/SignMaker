class ExitTab {
	/**
	 * Creates a new ExitTab.
	 * @method constructor
	 * @param  {string} number Number to display on the exit tab.
	 * @param  {string} [position=null] Position to display the exit tab
	 * 					relative to the sign.
	 * @param  {String} [width=null] Width of the exit tab (narrow or wide).
	 */
	constructor (number=null, position=null, width=null) {
		this.number = number;
		if (this.positions.includes(position)) {
			this.position = position;
		} else {
			this.position = this.positions[1];
		}
		if (this.widths.includes(width)) {
			this.width = width;
		} else {
			this.width = this.widths[0];
		}
	}
}

ExitTab.prototype.positions = ["Left", "Center", "Right"];
ExitTab.prototype.widths = ["Narrow", "Wide"];
