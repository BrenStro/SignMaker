class Panel {
	/**
	 * Creates a new Panel consisting of a sign and an exit tab.
	 * @method constructor
	 * @param  {string} color Background color of the sign and exit tab.
	 * @param  {Sign} sign Sign to make up the panel.
	 * @param  {ExitTab} [exitTab=null] Optional exit tab to include in the panel.
	 */
	constructor(sign, color, exitTab=null) {
		if (Object.keys(lib.colors).includes(color)) {
			this.color = color;
		} else {
			this.color = "Green";
		}
		this.sign = sign;
		this.exitTab = exitTab;
	}
}
