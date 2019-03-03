class Sign {

	/**
	 * Cretes a new sign.
	 * @method constructor
	 * @param  {String} controlText Control cities to display on the sign.
	 * @param  {String} [shieldPosition=null] Where the shields should be
	 * 					displayed relative to the control cities.
	 * @param  {String} [exitTabPosition=null] Position to display the exit tab
	 * 					relative to the sign.
	 * @param  {[type]} [guideArrow=null] Which guide arrow to display on the
	 * 					sign, if any.
	 * @param  {number} [guideArrowLanes=0] Number of lanes actoss to display
	 * 					guide arrows.
	 * @param  {string} [customText=""] Custom subtext to display on the sign.
	 */
	constructor(controlText="",
			shieldPosition=null,
			exitTabPosition=null,
			guideArrow=null, guideArrowLanes=0, customText="") {

		this.controlText = controlText;
		if (Object.keys(this.shieldPositions).includes(shieldPosition)) {
			this.shieldPosition = shieldPosition;
		} else {
			this.shieldPosition = "Above";
		}
		if (this.exitTabPositions.includes(exitTabPosition)) {
			this.exitTabPosition = exitTabPosition;
		} else {
			this.exitTabPosition = this.exitTabPositions[1];
		}
		if (Object.keys(this.guideArrows).includes(guideArrow)) {
			this.guideArrow = guideArrow;
		} else {
			this.guideArrow = null;
		}
		if (guideArrowLanes >= 0 && guideArrowLanes <= 6) {
			this.guideArrowLanes = guideArrowLanes;
		} else {
			this.guideArrowLanes = 0;
		}
		this.customText = customText;
	}
}

Sign.prototype.shieldPositions = {
	Left : "row",
	Above : "column",
	Right : "row-reverse"
};
Sign.prototype.exitTabPositions = ["Left", "Center", "Right"];
Sign.prototype.guideArrows = {
	"None" : " ",
	"Side Left" : "sideLeft",
	"Side Right" : "sideRight",
	"Exit Only" : "exitOnly",
	"Left/Down Arrow" : "leftDownArrow",
	"Left Arrow" : "leftArrow",
	"Left/Up Arrow" : "leftUpArrow",
	"Right/Down Arrow" : "rightDownArrow",
	"Right Arrow" : "rightArrow",
	"Right/Up Arrow" : "rightUpArrow",
	"Down Arrow" : "downArrow",
	"Up Arrow" : "upArrow"
}
