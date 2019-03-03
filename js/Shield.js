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
	constructor(type, routeNumber=0, to=false, banner, bannerPosition) {
		if (Object.keys(this.types).includes(type)) {
			this.type = type;
		} else {
			this.type = "I-";
		}
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
Shield.prototype.types = {
	"I-" : "I-",
	"US" : "US",
	"AL" : "AL",
	"AK" : "AK",
	"AZ" : "AZ",
	"AR" : "AR",
	"CA" : "CA",
	"CO" : "CO",
	"CT" : "rec2",
	"DE" : "cir",
	"DC" : "DC",
	"FL" : "FL",
	"GA" : "GA",
	"HI" : "HI",
	"ID" : "ID",
	"IL" : "IL",
	"IN" : "IN",
	"IA" : "cir",
	"KS" : "KS",
	"KY" : "cir",
	"LA" : "LA",
	"ME" : "rec",
	"MD" : "MD",
	"MA" : "rec",
	"MI" : "MI",
	"MN" : "MN",
	"MS" : "elp",
	"MO" : "MO",
	"MT" : "MT",
	"MT 2nd" : "MT2",
	"NE" : "NE",
	"NV" : "NV",
	"NH" : "NH",
	"NJ" : "elp",
	"NM" : "NM",
	"NY" : "NY",
	"NC" : "NC",
	"ND" : "ND",
	"OH" : "OH",
	"OK" : "OK",
	"OR" : "OR",
	"PA" : "PA",
	"RI" : "RI",
	"SC" : "SC",
	"SD" : "SD",
	"TN" : "TN",
	"TN 2nd" : "TN2",
	"TX" : "TX",
	"UT" : "UT",
	"VT" : "VT",
	"VA" : "VA",
	"VA 2nd" : "VA2",
	"WA" : "WA",
	"WV" : "rec2",
	"WI" : "WI",
	"WY" : "WY",
	"C-" : "C-"
};
