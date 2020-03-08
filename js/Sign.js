class Sign {

	/**
	 * Cretes a new sign.
	 * @param {Object} [opt] - Optional parameters.
	 * @param {string} [opt.controlText="New Sign"] - Control cities to display on the sign.
	 * @param {string} [opt.shieldPosition] - Where the shields should be displayed relative to the control cities.
	 * @param {boolean} [opt.shieldBacks=false] - Whether or not shields should be displayed with backings.
	 * @param {string} [opt.guideArrow] - Which guide arrow to display on the sign, if any.
	 * @param {number} [opt.guideArrowLanes=1] - Number of lanes actoss to display guide arrows.
	 * @param {string} [opt.actionMessage=""] - Custom subtext to display on the sign.
	 * @param {Shield[]} [opt.shields] - Array of shields to include on sign.
	 */
	constructor({
			controlText = "New Sign",
			shieldPosition,
			shieldBacks = false,
			guideArrow,
			guideArrowLanes = 1,
			actionMessage = "",
			shields = []
		} = {}
	) {
		this.controlText = controlText;
		if (this.shieldPositions.includes(shieldPosition)) {
			this.shieldPosition = shieldPosition;
		} else {
			this.shieldPosition = "Above";
		}
		this.shieldBacks = shieldBacks;
		if (this.guideArrows.includes(guideArrow)) {
			this.guideArrow = guideArrow;
		} else {
			this.guideArrow = "None";
		}
		if (guideArrowLanes >= 0 && guideArrowLanes <= 6) {
			this.guideArrowLanes = guideArrowLanes;
		} else {
			this.guideArrowLanes = 0;
		}
		this.actionMessage = actionMessage;
		this.shields = shields;
	}

	/**
	 * Create a new shield for the post. Add it to the end of the list of existing shields.
	 */
	newShield() {
		const newShield = new Shield();
		this.shields.push(newShield);
	}

	/**
	 * Delete an existing shield at the requested index.
	 * @param {number} shieldIndex - Position of the shield in the array of shields on this sign to delete.
	 */
	deleteShield(shieldIndex) {
		this.shields.splice(shieldIndex, 1);
	}
}

Sign.prototype.shieldPositions = ["Left", "Above", "Right"];
Sign.prototype.guideArrows = [
	"None",
	"Side Left",
	"Side Right",
	"Exit Only",
	"Left/Down Arrow",
	"Left Arrow",
	"Left/Up Arrow",
	"Right/Down Arrow",
	"Right Arrow",
	"Right/Up Arrow",
	"Down Arrow",
	"Up Arrow",
	"Action Message"
];
