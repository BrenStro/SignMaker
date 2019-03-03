let lib = (function() {

	/**
	 * Clears out the children from a given element.
	 * @param  {Element} parentElmt - Parent element to be cleared of children.
	 */
	var clearChildren = function(parentElmt) {
		while (parentElmt.firstChild) {
			parentElmt.removeChild(parentElmt.firstChild);
		}
	}

	/**
	 * Creates and appends an option element to a given Select element.
	 * @param  {Element} selectElmt - Select element to be appended to.
	 * @param  {String} value - Value to be held by the option.
	 * @param  {boolean} [selected=false] - Whether or not the new option should be auto-selected.
	 * @param  {String} text - Display text for the option.
	 */
	var appendOption = function(selectElmt, value, selected=false, text) {
		if (!text) {
			text = value;
		}
		let optionElmt = document.createElement("option");
		optionElmt.value = value;
		optionElmt.selected = selected;
		optionElmt.appendChild(document.createTextNode(text));
		selectElmt.appendChild(optionElmt);
	}

	// FHW-defined colors.
	let colors = {
		Green : "rgb(0, 95, 77)",
		Blue : "rgb(0, 67, 123)",
		Brown : "rgb(98, 51, 30)",
		Yellow : "rgb(255, 178, 0)",
		White : "rgb(255, 255, 255)",
		Black : "rgb(0, 0, 0)"
	};

	return {
		clearChildren : clearChildren,
		appendOption : appendOption,
		colors : colors
	};
})();
