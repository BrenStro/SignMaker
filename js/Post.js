class Post {
	/**
	 * Post that contains the panels.
	 * @method constructor
	 * @param  {String} postType Type of post on which to display the panels.
	 * @param  {number} [lanesWide=0] How many lanes wide the post should
	 * 					appear to be.
	 */
	constructor(type, lanesWide=0) {
		if (this.types.includes(type)) {
			this.type = type;
		} else {
			this.type = this.types[0];
		}
		if (lanesWide >= 0 && lanesWide <= 6) {
			this.lanesWide = lanesWide;
		} else {
			this.lanesWide = 0;
		}
		this.panels = [];
	}

	/**
	 * Create a new panel for the post. Add it to the end of the list of
	 * 		existing panels.
	 * @method newPanel
	 */
	newPanel() {
		let newSign = new Sign("New Sign");
		let newPanel = new Panel(newSign);
		this.panels.push(newPanel);
	}

	/**
	 * Duplicate an existing panel. Add it immediately after the panel being
	 * 		duplicated.
	 * @method duplicatePanel
	 * @param  {Number} panelIndex Position of the panel in the array of panels
	 * 					on this post.
	 */
	duplicatePanel(panelIndex) {
		let existingPanel = this.panels[panelIndex];
		let newPanel = Object.assign({}, existingPanel);
		this.panels.splice(++panelIndex, 0, newPanel);
	}

	/**
	 * Delete an existing panel at the requested index.
	 * @method deletePanel
	 * @param  {Number} panelIndex Position of the panel in the array of panels
	 * 					on this post to delete.
	 */
	deletePanel(panelIndex) {
		this.panels.splice(panelIndex, 1);
	}

	/**
	 * Shift the requested panel to the left one position swapping it with
	 * 		that panel to the left.
	 * @method shiftLeft
	 * @param  {Number} panelIndex Position of the panel in the array of panels
	 * 					on this post to shift left.
	 */
	shiftLeft(panelIndex) {
		// If already at the far left end, return.
		if (panelIndex <= 0) {
			return;
		}
		this.panels.splice(panelIndex-1, 2, this.panels[panelIndex], this.panels[panelIndex-1]);
	}

	/**
	 * Shift the requested panel to the right one position swaping it with
	 * 		that panel to the right.
	 * @method shiftRight
	 * @param  {[type]} panelIndex Position of the panel in the array of panels
	 * 					on this post to shift right.
	 */
	shiftRight(panelIndex) {
		// If already at the far right end, return.
		if (panelIndex >= this.panels.length-1) {
			return;
		}
		this.panels.splice(panelIndex, 2, this.panels[panelIndex+1], this.panels[panelIndex]);
	}
}

Post.prototype.types = [
	"Left",
	"Right",
	"Overhead",
	"Rural",
	"Center"
];
