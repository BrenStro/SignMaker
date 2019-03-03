let app = (function() {
	let currentlySelectedPanelIndex = -1;

	/**
	 * Initialize the application.
	 * @method init
	 */
	let init = function() {

		// Populate color options
		let colorSelectElmt = document.getElementById("panelColor");
		for (let color in lib.colors) {
			lib.appendOption(colorSelectElmt, color);
		}

		// Populate exit tab position options
		let exitTabPositionSelectElmt = document.getElementById("exitTabPosition");
		for (let position of Sign.prototype.exitTabPositions) {
			lib.appendOption(exitTabPositionSelectElmt, position, (position == "Right"));
		}

		// Populate exit tab width options
		let exitTabWidthSelectElmt = document.getElementById("exitTabWidth");
		for (let width of ExitTab.prototype.tabWidths) {
			lib.appendOption(exitTabWidthSelectElmt, width, (width == "Narrow"));
		}

		// Populate the shield position options
		let shieldPositionsSelectElmt = document.getElementById("shieldsPositions");
		for (let position in Sign.prototype.shieldPositions) {
			lib.appendOption(shieldPositionsSelectElmt, position, (position == "Above"));
		}

		// Populate the guide arrow options
		let guideArrowSelectElmt = document.getElementById("guideArrow");
		for (let guideArrow in Sign.prototype.guideArrows) {
			lib.appendOption(guideArrowSelectElmt, guideArrow);
		}
	}

	/**
	 * Update the fields in the form on the webpage.
	 * @method updateForm
	 */
	let updateForm = function() {

	}

	/**
	 * Create a new panel and add it to the post.
	 * @method newPanel
	 */
	let newPanel = function() {

	}

	/**
	 * Duplicate the currently selected panel.
	 * @method duplicatePanel
	 */
	let duplicatePanel = function() {

	}

	/**
	 * Delete the currently selected panel.
	 * @method deletePanel
	 */
	let deletePanel = function() {

	}

	/**
	 * Shift the currently selected panel left.
	 * @method shiftLeft
	 */
	let shiftLeft = function() {

	}

	/**
	 * Shift the currently selected panel right.
	 * @method shiftRight
	 */
	let shiftRight = function() {

	}

	/**
	 * Add a new shield to the current panel's sign.
	 * @method newShield
	 */
	let newShield = function() {

	}

	/**
	 * Redraw the panels onthe post.
	 * @method redraw
	 */
	let redraw = function() {

	}

	return {
		currentlySelectedPanelIndex : currentlySelectedPanelIndex,
		init : init,
		updateForm : updateForm,
		newPanel : newPanel,
		duplicatePanel : duplicatePanel,
		deletePanel : deletePanel,
		shiftLeft : shiftLeft,
		shiftRight : shiftRight,
		newShield : newShield,
		redraw : redraw
	};
})();
