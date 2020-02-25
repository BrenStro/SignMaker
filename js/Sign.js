class Sign {

	/**
	 * Cretes a new sign.
	 * @method constructor
	 * @param  {string} controlText Control cities to display on the sign.
	 * @param  {string} [shieldPosition=null] Where the shields should be
	 * 					displayed relative to the control cities.
	 * @param  {boolean} [shieldBacks=false] Whether or not shields should be
	 * 					displayed with backings.
	 * @param  {string} [guideArrow=null] Which guide arrow to display on the
	 * 					sign, if any.
	 * @param  {number} [guideArrowLanes=0] Number of lanes actoss to display
	 * 					guide arrows.
	 * @param  {string} [customText=""] Custom subtext to display on the sign.
	 */
	constructor(
		controlText="",
		shieldPosition=null,
		shieldBacks=false,
		guideArrow=null,
		guideArrowLanes=1,
		customText="",
		shields=[]
	) {
		this.controlText = controlText;
		if (Object.keys(this.shieldPositions).includes(shieldPosition)) {
			this.shieldPosition = shieldPosition;
		} else {
			this.shieldPosition = "Above";
		}
		this.shieldBacks = shieldBacks;
		if (Object.keys(this.guideArrows).includes(guideArrow)) {
			this.guideArrow = guideArrow;
		} else {
			this.guideArrow = "None";
		}
		if (guideArrowLanes >= 0 && guideArrowLanes <= 6) {
			this.guideArrowLanes = guideArrowLanes;
		} else {
			this.guideArrowLanes = 0;
		}
		this.customText = customText;
		this.shields = shields;
	}

	/**
	 * Create a new shield for the post. Add it to the end of the list of
	 * 		existing shields.
	 * @method newShield
	 */
	newShield() {
		const newShield = new Shield();
		this.shields.push(newShield);
	}

	/**
	 * Delete an existing shield at the requested index.
	 * @method deleteShield
	 * @param  {Number} shieldIndex Position of the shield in the array of
	 * 					shields on this sign to delete.
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
	"Custom Text"
];
