class Shield {
	/**
	 * Creates anew a route shield.
	 * @method constructor
	 * @param  {String} [type="I-"] Type of shield.
	 * @param  {Number} [routeNumber=0] Route number to display on shield.
	 * @param  {Boolean} [to=false] Whether or not the shield should be signed as "TO".
	 * @param  {String} bannerType Directional banner to display.
	 * @param  {String} bannerPosition Where to place the directional banner
	 * 					relative to the shield.
	 */
	constructor(type="I-", routeNumber=0, to=false, banner, bannerPosition) {
		this.type = type;
		this.routeNumber = routeNumber;
		this.to = to;
		if (this.bannerTypes.includes(bannerType)) {
			this.bannerType = bannerType;
		} else {
			this.bannerType = this.bannerTypes[0];
		}
		if (this.bannerPositions.includes(bannerPosition)) {
			this.bannerPosition = bannerPosition;
		} else {
			this.bannerPosition = this.bannerPositions[0];
		}
	}
}

Shield.prototype.bannerTypes = [" ", "North", "East", "South", "West", "Jct", "Begin", "End", "Spur", "Truck", "Bus", "Byp", "Future", "Loop", "Inner", "Outer",  "City", "To"];
Shield.prototype.bannerPositions = ["ABOVE", "RIGHT", "LEFT"];
