class Panel {
	/**
	 * Creates a new Panel consisting of a sign and an exit tab.
	 * @method constructor
	 * @param  {String} panelColor Background color of the sign and exit tab.
	 * @param  {Sign} sign Sign to make up the panel.
	 * @param  {ExitTab} [exitTab=null] Optional exit tab to include in the panel.
	 * @param  {Boolean} [shieldBacks=false] Whether or not shields should be
	 * 					displayed with backings.
	 */
	constructor(sign, panelColor, exitTab=null, shieldBacks=false) {
		if (Object.keys(lib.colors).includes(panelColor)) {
			this.panelColor = panelColor;
		} else {
			this.panelColor = "Green";
		}
		this.sign = sign;
		this.exitTab = exitTab;
		this.shieldBacks = shieldBacks;
	}
}
