class Post {
	/**
	 * Post that contains the panels.
	 * @method constructor
	 * @param  {string} polePosition Position of the poles on which to display the panels.
	 * @param  {number} [lanesWide=0] How many lanes wide the post should
	 * 					appear to be.
	 */
	constructor(polePosition, lanesWide=0) {
		if (this.polePositions.includes(polePosition)) {
			this.polePosition = polePosition;
		} else {
			this.polePosition = this.polePositions[0];
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
		let newExitTab = new ExitTab();
		let newPanel = new Panel(newSign, undefined, newExitTab);
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
		let newShields = [];
		for (let shield of existingPanel.sign.shields) {
			newShields.push(Object.assign(new Shield(), shield));
		}
		let newSign = new Sign(
			existingPanel.sign.controlText,
			existingPanel.sign.shieldPosition,
			existingPanel.sign.sheildBacks,
			existingPanel.sign.guideArrow,
			existingPanel.sign.guideArrowLanes,
			existingPanel.sign.customText,
			newShields
		);
		let newExitTab = Object.assign(new ExitTab(), existingPanel.exitTab);
		let newPanel = Object.assign(new Panel(), existingPanel);
		newPanel.sign = newSign;
		newPanel.exitTab = newExitTab;
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
			return panelIndex;
		}
		this.panels.splice(panelIndex-1, 2, this.panels[panelIndex], this.panels[panelIndex-1]);
		return panelIndex - 1;
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
			return panelIndex;
		}
		this.panels.splice(panelIndex, 2, this.panels[panelIndex+1], this.panels[panelIndex]);
		return panelIndex + 1;
	}
}

Post.prototype.polePositions = [
	"Left",
	"Right",
	"Overhead",
	"Rural",
	"Center"
];
