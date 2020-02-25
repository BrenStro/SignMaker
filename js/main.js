const app = (function() {
	let post = {};
	let currentlySelectedPanelIndex = -1;

	/**
	 * Initialize the application.
	 * @method init
	 */
	const init = function() {
		// Create the post on which to place panels
		post = new Post(Post.prototype.polePositions[0]);

		// Populate post position options
		const postPositionSelectElmt = document.getElementById("postPosition");
		for (const polePosition of Post.prototype.polePositions) {
			lib.appendOption(postPositionSelectElmt, polePosition, (polePosition == "Overhead"));
		}

		// Populate color options
		const colorSelectElmt = document.getElementById("panelColor");
		for (const color in lib.colors) {
			lib.appendOption(colorSelectElmt, color);
		}

		// Populate exit tab position options
		const exitTabPositionSelectElmt = document.getElementById("exitTabPosition");
		for (const position of ExitTab.prototype.positions) {
			lib.appendOption(exitTabPositionSelectElmt, position, (position == "Right"));
		}

		// Populate exit tab width options
		const exitTabWidthSelectElmt = document.getElementById("exitTabWidth");
		for (const width of ExitTab.prototype.widths) {
			lib.appendOption(exitTabWidthSelectElmt, width, (width == "Narrow"));
		}

		// Populate the shield position options
		const shieldPositionsSelectElmt = document.getElementById("shieldsPosition");
		for (const position of Sign.prototype.shieldPositions) {
			lib.appendOption(shieldPositionsSelectElmt, position, (position == "Above"));
		}

		// Populate the guide arrow options
		const guideArrowSelectElmt = document.getElementById("guideArrow");
		for (const guideArrow of Sign.prototype.guideArrows) {
			lib.appendOption(guideArrowSelectElmt, guideArrow, false);
		}

		newPanel();
	}

	/**
	 * Create a new panel and add it to the post.
	 *   Set the currently selected panel for editing to the new panel.
	 *   Update the form to reflect the new panel.
	 *   Redraw the page.
	 * @method newPanel
	 */
	const newPanel = function() {
		post.newPanel();
		currentlySelectedPanelIndex = post.panels.length - 1;
		updateForm();
		redraw();
	}

	/**
	 * Duplicate the currently selected panel.
	 *   Set the currently selected panel for editing to the newly duplicated panel.
	 *   Update the form to reflect the new panel.
	 *   Redraw the page.
	 * @method duplicatePanel
	 */
	const duplicatePanel = function() {
		post.duplicatePanel(currentlySelectedPanelIndex);
		currentlySelectedPanelIndex++;
		updateForm();
		redraw();
	}

	/**
	 * Delete the currently selected panel.
	 *   Set the currently selected panel for editing to the panel ahead of the
	 *     deleted panel.
	 *   Update the form to reflect the newly selected panel.
	 *   Redraw the page.
	 * @method deletePanel
	 */
	const deletePanel = function() {
		post.deletePanel(currentlySelectedPanelIndex);
		if (currentlySelectedPanelIndex > 0) {
			currentlySelectedPanelIndex--;
		}
		if (post.panels.length == 0) {
			newPanel();
		} else {
			updateForm();
			redraw();
		}
	}

	/**
	 * Shift the currently selected panel left.
	 *   Set the currently selected panel for editing to the new index.
	 *   Redraw the page.
	 * @method shiftLeft
	 */
	const shiftLeft = function() {
		currentlySelectedPanelIndex = post.shiftLeft(currentlySelectedPanelIndex);
		document.getElementById("panelEditing").selectedIndex = currentlySelectedPanelIndex;
		redraw();
	}

	/**
	 * Shift the currently selected panel right.
	 *   Set the currently selected panel for editing to the new index.
	 *   Redraw the page.
	 * @method shiftRight
	 */
	const shiftRight = function() {
		currentlySelectedPanelIndex = post.shiftRight(currentlySelectedPanelIndex);
		document.getElementById("panelEditing").selectedIndex = currentlySelectedPanelIndex;
		redraw();
	}

	/**
	 * Change the current panel being edited.
	 *   Update the form to reflect the newly selected panel.
	 * @method changeEditingPanel
	 */
	const changeEditingPanel = function() {
		currentlySelectedPanelIndex = Number(document.getElementById("panelEditing").value);
		updateForm();
	}

	/**
	 * Add a new shield to the current panel's sign.
	 *   Update the shield subform with the new shield.
	 * @method newShield
	 */
	const newShield = function() {
		const sign = post.panels[currentlySelectedPanelIndex].sign;
		sign.newShield();
		updateShieldSubform();
		redraw();
	}

	/**
	 * Delete a shield to the current panel's sign.
	 *   Update the shield subform with the new shield.
	 * @method newShield
	 */
	const deleteShield = function() {
		const sign = post.panels[currentlySelectedPanelIndex].sign;
		sign.deleteShield(this.dataset.shieldIndex);
		updateShieldSubform();
		redraw();
	}

	/**
	 * Read the form and update the currently selected panel with the new values.
	 *   Redraw the page.
	 * @method readForm
	 */
	const readForm = function() {
		const form = document.forms[0];
		const panel = post.panels[currentlySelectedPanelIndex];

		// Post
		post.polePosition = form["postPosition"].value;

		// Exit Tab
		panel.color = form["panelColor"].value;
		panel.exitTab.number = form["exitNumber"].value;
		panel.exitTab.width = form["exitTabWidth"].value;
		panel.exitTab.position = form["exitTabPosition"].value;

		// Sign
		panel.sign.controlText = form["controlText"].value;
		panel.sign.shieldPosition = form["shieldsPosition"].value;
		panel.sign.guideArrow = form["guideArrow"].value;
		panel.sign.guideArrowLanes = form["guideArrowLanes"].value;
		panel.sign.customText = form["customText"].value;

		// Shileds
		panel.sign.shieldBacks = form["shieldBacks"].checked;
		for (let shieldIndex = 0, length = panel.sign.shields.length; shieldIndex < length; shieldIndex++) {
			panel.sign.shields[shieldIndex].type = document.getElementById(`shield${shieldIndex}_type`).value;
			panel.sign.shields[shieldIndex].routeNumber = document.getElementById(`shield${shieldIndex}_routeNumber`).value;
			panel.sign.shields[shieldIndex].to = document.getElementById(`shield${shieldIndex}_to`).checked;
			panel.sign.shields[shieldIndex].bannerType = document.getElementById(`shield${shieldIndex}_bannerType`).value;
			panel.sign.shields[shieldIndex].bannerPosition = document.getElementById(`shield${shieldIndex}_bannerPosition`).value;
		}

		redraw();
	}

	/**
	 * Update the fields in the form to the values of the currently selected
	 *   panel.
	 * @method updateForm
	 */
	const updateForm = function() {
		const editingPanelSelectElmt = document.getElementById("panelEditing");
		lib.clearChildren(editingPanelSelectElmt);
		for (let panelIndex = 0, panelsLength = post.panels.length; panelIndex < panelsLength; panelIndex++) {
			lib.appendOption(editingPanelSelectElmt, panelIndex, panelIndex == currentlySelectedPanelIndex, `Panel ${panelIndex + 1}`);
		}

		const panel = post.panels[currentlySelectedPanelIndex];

		const panelColorSelectElmt = document.getElementById("panelColor");
		for (const option of panelColorSelectElmt.options) {
			if (option.value == panel.color) {
				option.selected = true;
				break;
			}
		}

		const exitNumberElmt = document.getElementById("exitNumber");
		exitNumberElmt.value = panel.exitTab.number;

		const exitTabPositionSelectElmt = document.getElementById("exitTabPosition");
		for (const option of exitTabPositionSelectElmt.options) {
			if (option.value == panel.exitTab.position) {
				option.selected = true;
				break;
			}
		}

		const exitTabWidthSelectElmt = document.getElementById("exitTabWidth");
		for (const option of exitTabWidthSelectElmt.options) {
			if (option.value == panel.exitTab.width) {
				option.selected = true;
				break;
			}
		}

		updateShieldSubform();

		const shieldPositionsSelectElmt = document.getElementById("shieldsPosition");
		for (const option of shieldPositionsSelectElmt.options) {
			if (option.value == panel.sign.shieldPosition) {
				option.selected = true;
				break;
			}
		}

		const shieldBacksElmt = document.getElementById("shieldBacks");
		shieldBacksElmt.checked = panel.sign.shieldBacks;

		const controlTextElmt = document.getElementById("controlText");
		controlTextElmt.value = panel.sign.controlText;

		const guideArrowSelectElmt = document.getElementById("guideArrow");
		for (const option of guideArrowSelectElmt.options) {
			if (option.value == panel.sign.guideArrow) {
				option.selected = true;
				break;
			}
		}

		const guideArrowLanesElmt = document.getElementById("guideArrowLanes");
		guideArrowLanesElmt.value = panel.sign.guideArrowLanes;

		const customTextElmt = document.getElementById("customText");
		customTextElmt.value = panel.sign.customText;
	}

	/**
	 * Update the fields in the form relating to shields to the values of the
	 *   currently selected panel.
	 * @method updateShieldSubform
	 */
	const updateShieldSubform = function() {
		const shieldsContainerElmt = document.getElementById("shields");
		lib.clearChildren(shieldsContainerElmt);

		const shields = post.panels[currentlySelectedPanelIndex].sign.shields;

		for (let shieldIndex = 0, length = shields.length; shieldIndex < length; shieldIndex++) {
			const rowContainerElmt = document.createElement("div");

			const toCheckElmt = document.createElement("input");
			toCheckElmt.type = "checkbox";
			toCheckElmt.id = `shield${shieldIndex}_to`;
			toCheckElmt.name = `shield${shieldIndex}_to`;
			toCheckElmt.checked = shields[shieldIndex].to;
			toCheckElmt.addEventListener("change", readForm);
			rowContainerElmt.appendChild(toCheckElmt);

			const toCheckLabelElmt = document.createElement("label");
			toCheckLabelElmt.setAttribute("for", `shield${shieldIndex}_to`);
			toCheckLabelElmt.appendChild(document.createTextNode(" TO "));
			rowContainerElmt.appendChild(toCheckLabelElmt);

			// Populate shield options
			const typeSelectElmt = document.createElement("select");
			for (const type in Shield.prototype.types) {
				lib.appendOption(typeSelectElmt, Shield.prototype.types[type], (shields[shieldIndex].type == Shield.prototype.types[type]), type);
			}
			typeSelectElmt.id = `shield${shieldIndex}_type`;
			typeSelectElmt.addEventListener("change", readForm);
			rowContainerElmt.appendChild(typeSelectElmt);

			const routeNumberElmt = document.createElement("input");
			routeNumberElmt.type = "text";
			routeNumberElmt.id = `shield${shieldIndex}_routeNumber`;
			routeNumberElmt.placeholder = "00";
			routeNumberElmt.value = shields[shieldIndex].routeNumber;
			routeNumberElmt.addEventListener("change", readForm);
			rowContainerElmt.appendChild(routeNumberElmt);

			// Populate banner type options
			const bannerTypeSelectElmt = document.createElement("select");
			for (const bannerType of Shield.prototype.bannerTypes) {
				lib.appendOption(bannerTypeSelectElmt, bannerType, (shields[shieldIndex].bannerType == bannerType));
			}
			bannerTypeSelectElmt.id = `shield${shieldIndex}_bannerType`;
			bannerTypeSelectElmt.addEventListener("change", readForm);
			rowContainerElmt.appendChild(bannerTypeSelectElmt);

			// Populate banner position options
			const bannerPositionSelectElmt = document.createElement("select");
			for (const bannerPosition of Shield.prototype.bannerPositions) {
				lib.appendOption(bannerPositionSelectElmt, bannerPosition, (shields[shieldIndex].bannerPosition == bannerPosition));
			}
			bannerPositionSelectElmt.id = `shield${shieldIndex}_bannerPosition`;
			bannerPositionSelectElmt.addEventListener("change", readForm);
			rowContainerElmt.appendChild(bannerPositionSelectElmt);

			const deleteElmt = document.createElement("input");
			deleteElmt.type = "button";
			deleteElmt.value = "Delete";
			deleteElmt.dataset.shieldIndex = shieldIndex;
			deleteElmt.addEventListener("click", deleteShield);
			rowContainerElmt.appendChild(deleteElmt);

			shieldsContainerElmt.appendChild(rowContainerElmt);
		}
	}

	/**
	 * Redraw the panels on the post.
	 * @method redraw
	 */
	const redraw = function() {
		const postElmt = document.getElementById("panels");
		if (["Left", "Right", "Overhead"].includes(post.polePosition)) {
			postElmt.className = "overhead";
		} else {
			postElmt.className = post.polePosition.toLowerCase();
		}
		lib.clearChildren(postElmt);
		for (const panel of post.panels) {
			const panelElmt = document.createElement("div");
			panelElmt.className = "panel";
			if (post.polePosition == "Rural") {
				panelElmt.className += " rural";
			}

			const exitTabElmt = document.createElement("div");
			exitTabElmt.className = "exitTab";
			panelElmt.appendChild(exitTabElmt);

			const signElmt = document.createElement("div");
			signElmt.className = "sign";
			panelElmt.appendChild(signElmt);

			const sideLeftArrowElmt = document.createElement("div");
			sideLeftArrowElmt.className = "sideLeftArrow";
			sideLeftArrowElmt.appendChild(document.createTextNode(lib.specialCharacters.sideLeftArrow));
			signElmt.appendChild(sideLeftArrowElmt);

			const signContentContainerElmt = document.createElement("div");
			signContentContainerElmt.className = "signContentContainer";
			signElmt.appendChild(signContentContainerElmt);

			const shieldsContainerElmt = document.createElement("div");
			shieldsContainerElmt.className = "shieldsContainer";
			signContentContainerElmt.appendChild(shieldsContainerElmt);

			const controlTextElmt = document.createElement("p");
			controlTextElmt.className = "controlText";
			signContentContainerElmt.appendChild(controlTextElmt);

			const sideRightArrowElmt = document.createElement("div");
			sideRightArrowElmt.className = "sideRightArrow";
			sideRightArrowElmt.appendChild(document.createTextNode(lib.specialCharacters.sideRightArrow));
			signElmt.appendChild(sideRightArrowElmt);

			const guideArrowsElmt = document.createElement("div");
			guideArrowsElmt.className = "guideArrows";
			panelElmt.appendChild(guideArrowsElmt);

			postElmt.appendChild(panelElmt);

			// Panel Color
			exitTabElmt.style.backgroundColor = lib.colors[panel.color];
			signElmt.style.backgroundColor = lib.colors[panel.color];
			if (panel.color == "Green" || panel.color == "Blue" || panel.color == "Brown" || panel.color == "Black") {
				exitTabElmt.style.borderColor = lib.colors["White"];
				signElmt.style.borderColor = lib.colors["White"];
				exitTabElmt.style.color = lib.colors["White"];
				signElmt.style.color = lib.colors["White"];
			} else {
				exitTabElmt.style.borderColor = lib.colors["Black"];
				signElmt.style.borderColor = lib.colors["Black"];
				exitTabElmt.style.color = lib.colors["Black"];
				signElmt.style.color = lib.colors["Black"];
			}

			// Position of shields
			//   Flow the contents of the sign (sheild and control cities)
			//   based on position wanted for the shield
			//   (Left is 'row', Center is 'Above', Right is 'row-reverse')
			signContentContainerElmt.style.flexDirection = lib.shieldPositions[panel.sign.shieldPosition];

			// Exit tab
			if (!panel.exitTab.number) {
				exitTabElmt.style.display = "none";
			} else {
				// Remove and re-add exitTabElmt text
				lib.clearChildren(exitTabElmt);
				exitTabElmt.appendChild(document.createTextNode(panel.exitTab.number.toUpperCase()));

				exitTabElmt.style.textAlign = panel.exitTab.position;

				if (panel.exitTab.width == "Wide") {
					exitTabElmt.style.display = "block";
					exitTabElmt.style.float = "none";
				} else {
					exitTabElmt.style.display = "inline";
					if (panel.exitTab.position == "Center") {
						exitTabElmt.style.float = "none";
					} else {
						exitTabElmt.style.float = panel.exitTab.position;
					}
				}
			}

			// Shields
			lib.clearChildren(shieldsContainerElmt);
			for (const shield of panel.sign.shields) {
				const toElmt = document.createElement("p");
				toElmt.className = "to";
				toElmt.appendChild(document.createTextNode("TO"));
				shieldsContainerElmt.appendChild(toElmt);

				const bannerShieldContainerElmt = document.createElement("div");
				bannerShieldContainerElmt.className = "bannerShieldContainer";
				shieldsContainerElmt.appendChild(bannerShieldContainerElmt);

				const bannerElmt = document.createElement("p");
				bannerElmt.className = "banner";
				bannerShieldContainerElmt.appendChild(bannerElmt);

				const shieldElmt = document.createElement("div");
				shieldElmt.className = "shield";
				bannerShieldContainerElmt.appendChild(shieldElmt);

				const shieldImgElmt = document.createElement("object");
				shieldImgElmt.type = "image/svg+xml";
				shieldImgElmt.className = "shieldImg";
				shieldElmt.appendChild(shieldImgElmt);

				const routeNumberElmt = document.createElement("p");
				routeNumberElmt.className = "routeNumber";
				shieldElmt.appendChild(routeNumberElmt);

				if (shield.to) {
					toElmt.style.display = "inline";
					bannerShieldContainerElmt.style.marginLeft = "0";
				}

				// If "Shield Backs" is checked, use directory with images of shields with backs
				//   else, use directory with images of shields with no backs
				let imgDir;
				if (panel.sign.shieldBacks) {
					imgDir = "img/shields-with-backs/";
				} else {
					imgDir = "img/shields-without-backs/";
				}

				// Shield type
				if (shield.type === "I-") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Interstate-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Interstate-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["White"];
					routeNumberElmt.style.top = "0.17em";
				} else if (shield.type === "US") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "US-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "US-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "cir") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Circle-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Circle-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "elp") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Circle-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Ellipse-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "rec") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Rectangle-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Rectangle-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "rec2") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Rectangle2-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Rectangle2-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "C-") {
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					shieldImgElmt.data = imgDir + "County-2.svg";
					routeNumberElmt.style.color = "rgb(247,209,23)";
					routeNumberElmt.style.top = "0.3em";
				} else if (shield.type === "AL") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Alabama-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Alabama-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0em";
				} else if (shield.type === "AK") {
					shieldImgElmt.data = imgDir + "Alaska-2.svg";
					if (shield.routeNumber.length <= 1) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 2) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.1em";
				} else if (shield.type === "AZ") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Arizona-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Arizona-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.2em";
				} else if (shield.type === "AR") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Arkansas-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Arkansas-3.svg";
					}
					if (shield.routeNumber.length >= 2) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "CA") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "California-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "California-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["White"];
					routeNumberElmt.style.top = "0.45em";
				} else if (shield.type === "CO") {
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					shieldImgElmt.data = imgDir + "Colorado-2.svg";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.575em";
				} else if (shield.type === "DC") {
					shieldImgElmt.data = imgDir + "WashDC-2.svg";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.95em";
				} else if (shield.type === "FL") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Florida-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Florida-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.3em";
				} else if (shield.type === "GA") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Georgia-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Georgia-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.3em";
				} else if (shield.type === "HI") {
					shieldImgElmt.data = imgDir + "Hawaii-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
						routeNumberElmt.style.top = "0.3em";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
						routeNumberElmt.style.top = "0.6em";
					}
					routeNumberElmt.style.color = lib.colors["Black"];

				} else if (shield.type === "ID") {
					shieldImgElmt.data = imgDir + "Idaho-2.svg";
					if (shield.routeNumber.length <= 2) {
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontSize = "1.15em";
					}
					routeNumberElmt.style.fontFamily = "Series C";
					if (panel.sign.shieldBacks) {
						routeNumberElmt.style.color = lib.colors["White"];
					} else {
						routeNumberElmt.style.color = lib.colors["Black"];
					}
					routeNumberElmt.style.top = "-0.15em";
				} else if (shield.type === "IL") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Illinois-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Illinois-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.35em";
				} else if (shield.type === "IN") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Indiana-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Indiana-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.35em";
				} else if (shield.type === "KS") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Kansas-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Kansas-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "LA") {
					shieldImgElmt.data = imgDir + "Louisiana-2.svg";
					routeNumberElmt.style.fontFamily = "Series C";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "1em";
				} else if (shield.type === "MD") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Maryland-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Maryland-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.45em";
				} else if (shield.type === "MI") {
					shieldImgElmt.data = imgDir + "Michigan-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.5em";
				} else if (shield.type === "MN") {
					shieldImgElmt.data = imgDir + "Minnesota-2.svg";
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["White"];
					routeNumberElmt.style.top = "0.55em";
				} else if (shield.type === "MO") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Missouri-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Missouri-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "MT") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Montana-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Montana-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.3em";
				} else if (shield.type === "MT2") {
					shieldImgElmt.data = imgDir + "Montana-2-Secondary.svg";
					routeNumberElmt.style.top = "0.2em";
					if (shield.routeNumber.length <= 1) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 2) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.top = "0.3em";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
				} else if (shield.type === "NE") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Nebraska-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Nebraska-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.05em";
				} else if (shield.type === "NV") {
					routeNumberElmt.style.fontFamily = "Series D";
					shieldImgElmt.data = imgDir + "Nevada-2.svg";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "NH") {
					shieldImgElmt.data = imgDir + "NewHampshire-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "NM") {
					shieldImgElmt.data = imgDir + "NewMexico-2.svg";
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.top = "0.15em";
					if (shield.routeNumber.length == 2) {
						routeNumberElmt.style.top = "0.4em";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
						routeNumberElmt.style.top = "0.6em";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
				} else if (shield.type === "NY") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "NewYork-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "NewYork-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "NC") {
					shieldImgElmt.data = imgDir + "NorthCarolina-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.4em";
				} else if (shield.type === "ND") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "NorthDakota-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "NorthDakota-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.25em";
				} else if (shield.type === "OH") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Ohio-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Ohio-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "OK") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Oklahoma-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Oklahoma-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.35em";
				} else if (shield.type === "OR") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Oregon-2.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Oregon-3.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "PA") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Pennsylvania-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Pennsylvania-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.2em";
				} else if (shield.type === "RI") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "RhodeIsland-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "RhodeIsland-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.35em";
				} else if (shield.type === "SC") {
					shieldImgElmt.data = imgDir + "SouthCarolina-2.svg";
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Blue"];
					routeNumberElmt.style.top = "0.4em";
				} else if (shield.type === "SD") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "SouthDakota-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "SouthDakota-3.svg";
					}
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "TN") {
					shieldImgElmt.data = imgDir + "Tennessee-2.svg";
					routeNumberElmt.style.fontFamily = "Series D";
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.05em";
				} else if (shield.type === "TN2") {
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Tennessee-2-Secondary.svg";
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Tennessee-3-Secondary.svg";
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "-0.15em";
				} else if (shield.type === "TX") {
					shieldImgElmt.data = imgDir + "Texas-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "-0.05em";
				} else if (shield.type === "UT") {
					shieldImgElmt.data = imgDir + "Utah-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
						routeNumberElmt.style.top = "0.4em";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
						routeNumberElmt.style.top = "0.65em";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
				} else if (shield.type === "VT") {
					routeNumberElmt.style.fontFamily = "Series D";
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Vermont-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Vermont-3.svg";
					}
					routeNumberElmt.style.color = lib.colors["Green"];
					routeNumberElmt.style.top = "0.4em";
				} else if (shield.type === "VA") {
					routeNumberElmt.style.fontFamily = "Series D";
					if (shield.routeNumber.length <= 2) {
						shieldImgElmt.data = imgDir + "Virginia-2.svg";
					} else if (shield.routeNumber.length >= 3) {
						shieldImgElmt.data = imgDir + "Virginia-3.svg";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0em";
				} else if (shield.type === "VA2") {
					shieldImgElmt.data = imgDir + "Circle-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
					routeNumberElmt.style.top = "0.15em";
				} else if (shield.type === "WA") {
					shieldImgElmt.data = imgDir + "Washington-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
						routeNumberElmt.style.top = "0.1em";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
						routeNumberElmt.style.top = "0.3em";
					}
					routeNumberElmt.style.color = lib.colors["Black"];
				} else if (shield.type === "WI") {
					shieldImgElmt.data = imgDir + "Wisconsin-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.top = "0.15em";
					routeNumberElmt.style.color = lib.colors["Black"];
				} else if (shield.type === "WY") {
					shieldImgElmt.data = imgDir + "Wyoming-2.svg";
					if (shield.routeNumber.length <= 2) {
						routeNumberElmt.style.fontFamily = "Series D";
					} else if (shield.routeNumber.length >= 3) {
						routeNumberElmt.style.fontFamily = "Series C";
					}
					routeNumberElmt.style.top = "0.2em";
					routeNumberElmt.style.color = lib.colors["Black"];
				}

				// Special cases
				//   Size
				if (shield.type === "DC") {
					routeNumberElmt.style.fontSize = "1em";
				} else if (shield.type === "C-") {
					routeNumberElmt.style.fontSize = "1.25em";
				} else if (shield.type === "HI" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "ID" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "LA") {
					routeNumberElmt.style.fontSize = "1em";
				} else if (shield.type === "MI") {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "MN") {
					routeNumberElmt.style.fontSize = "1.25em";
				} else if (shield.type === "MT2" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "NV") {
					routeNumberElmt.style.fontSize = "0.9em";
				} else if (shield.type === "NM" && shield.routeNumber.length == 2) {
					routeNumberElmt.style.fontSize = "1.2em";
				} else if (shield.type === "NM" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1em";
				} else if (shield.type === "NC") {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "UT" && shield.routeNumber.length <= 2) {
					routeNumberElmt.style.fontSize = "1.15em";
				} else if (shield.type === "UT" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1em";
				} else if (shield.type === "WA" && shield.routeNumber.length <= 2) {
					routeNumberElmt.style.fontSize = "1.35em";
				} else if (shield.type === "WA" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.fontSize = "1.15em";
				} else {
					routeNumberElmt.style.fontSize = "1.5em";
				}

				//   Position
				if (shield.type === "AK") {
					routeNumberElmt.style.textAlign = "right";
					routeNumberElmt.style.right = "0.25em";
				} else if (shield.type === "AR") {
					routeNumberElmt.style.textAlign = "center";
					routeNumberElmt.style.right = "0.05em";
				} else if (shield.type === "FL") {
					routeNumberElmt.style.textAlign = "center";
					routeNumberElmt.style.right = "0.15em";
				} else if (shield.type === "ID") {
					routeNumberElmt.style.textAlign = "right";
					routeNumberElmt.style.right = "0.3em";
				} else if (shield.type === "NH" && shield.routeNumber.length >= 3) {
					routeNumberElmt.style.right = "-0.1em";
				} else {
					routeNumberElmt.style.textAlign = "center";
					routeNumberElmt.style.right = "0";
				}

				//   Text Outline
				if (shield.type === "OK") {
					routeNumberElmt.style.textShadow = "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF";
				} else {
					routeNumberElmt.style.textShadow = "none";
				}

				// Route Number
				lib.clearChildren(routeNumberElmt);
				routeNumberElmt.appendChild(document.createTextNode(shield.routeNumber));

				// Route banner
				bannerElmt.style.display = "block";
				bannerElmt.appendChild(document.createTextNode(shield.bannerType.toUpperCase()));
				if (shield.bannerType === "Toll") { //special styling for toll banner
					bannerElmt.style.color = lib.colors["Black"];
					bannerElmt.style.backgroundColor = lib.colors["Yellow"];
				} else {
					if (panel.color === "Green" || panel.color === "Blue" || panel.color === "Brown" || panel.color === "Black") {
						bannerElmt.style.color = lib.colors["White"];
					} else {
						bannerElmt.style.color = lib.colors["Black"];
					}
					bannerElmt.style.backgroundColor = "transparent";
				}

				// Special states
				if (shield.type === "I-" && shield.bannerType === "Bus" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Interstate-2-BUS.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "I-" && shield.bannerType === "Bus" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Interstate-3-BUS.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "AZ" && shield.bannerType === "Loop" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Arizona-3-LOOP.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "FL" && shield.bannerType === "Toll") {
					routeNumberElmt.style.fontFamily = "Series C";
					routeNumberElmt.style.fontSize = "1em";
					routeNumberElmt.style.top = "0.85em";
					shieldImgElmt.data = imgDir + "Florida-TOLL.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Alt" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Georgia-2-ALT.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Alt" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Georgia-3-ALT.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Byp" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Georgia-2-BYP.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Byp" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Georgia-3-BYP.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Conn" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Georgia-2-CONN.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Conn" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Georgia-3-CONN.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Loop" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Georgia-2-LOOP.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Loop" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Georgia-3-LOOP.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Spur" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Georgia-2-SPUR.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "GA" && shield.bannerType === "Spur" && shield.routeNumber.length >= 3) {
					shieldImgElmt.data = imgDir + "Georgia-3-SPUR.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "MN" && shield.bannerType === "Bus") {
					shieldImgElmt.data = imgDir + "Minnesota-BUS.svg";
					bannerElmt.style.display = "none";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "NE" && shield.bannerType === "Link" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Nebraska-LINK.svg";
					bannerElmt.style.display = "none";
					routeNumberElmt.style.top = "-0.1em";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "NE" && shield.bannerType === "Spur" && shield.routeNumber.length <= 2) {
					shieldImgElmt.data = imgDir + "Nebraska-SPUR.svg";
					bannerElmt.style.display = "none";
					routeNumberElmt.style.top = "-0.1em";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "TX" && shield.bannerType === "Loop") {
					shieldImgElmt.data = imgDir + "Texas-2-LOOP.svg";
					bannerElmt.style.display = "none";
					routeNumberElmt.style.top = "0.4em";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.type === "TX" && shield.bannerType === "Spur") {
					shieldImgElmt.data = imgDir + "Texas-2-SPUR.svg";
					bannerElmt.style.display = "none";
					routeNumberElmt.style.top = "0.4em";
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				} else if (shield.bannerType === "None") {
					lib.clearChildren(bannerElmt);
					// set bannerPosition to "Above" as to avoid display issues
					shield.bannerPosition = "Above";
				}

				// Direction position

				bannerShieldContainerElmt.style.flexFlow = lib.shieldPositions[shield.bannerPosition];
			}

			// Control text
			// Remove and re-add the controlText text
			lib.clearChildren(controlTextElmt);
			const controlTextArray = panel.sign.controlText.split("\n");
			for (let lineNum = 0; lineNum < controlTextArray.length - 1; lineNum++) {
				controlTextElmt.appendChild(document.createTextNode(controlTextArray[lineNum]));
				controlTextElmt.appendChild(document.createElement("br"));
			}
			controlTextElmt.appendChild(document.createTextNode(controlTextArray[controlTextArray.length - 1]));

			// Guide arrows
			sideLeftArrowElmt.style.display = "none";
			sideRightArrowElmt.style.display = "none";
			guideArrowsElmt.style.display = "none";

			// Remove bottomArrows text
			lib.clearChildren(guideArrowsElmt);

			signElmt.style.borderRadius = "1em";
			signElmt.style.borderBottomWidth = "0.2em";

			if ("Side Left" == panel.sign.guideArrow) {
				sideLeftArrowElmt.style.display = "block";
			} else if ("Side Right" == panel.sign.guideArrow) {
				sideRightArrowElmt.style.display = "block";
			} else if (panel.sign.guideArrow != "None") {
				signElmt.style.borderBottomLeftRadius = "0";
				signElmt.style.borderBottomRightRadius = "0";
				signElmt.style.borderBottomWidth = "0";
				guideArrowsElmt.style.display = "block";

				if ("Exit Only" == panel.sign.guideArrow) {
					guideArrowsElmt.style.backgroundColor = lib.colors["Yellow"];
					guideArrowsElmt.style.borderColor = lib.colors["Black"];
					guideArrowsElmt.style.color = lib.colors["Black"];

					const exitOnlyArrowElmt = function() {
						const exitOnlyArrowElmt = document.createElement("span");
						exitOnlyArrowElmt.className = "exitOnlyArrow";
						exitOnlyArrowElmt.appendChild(document.createTextNode(lib.specialCharacters["Down Arrow"]));
						return exitOnlyArrowElmt;
					}
					const downArrowElmt = function() {
						const downArrowElmt = document.createElement("span");
						downArrowElmt.className = "arrow";
						downArrowElmt.style.fontFamily = "Arrows Two";
						downArrowElmt.appendChild(document.createTextNode(lib.specialCharacters["Down Arrow"]));
						return downArrowElmt;
					}

					// Interlase arrows and the words EXIT and ONLY, ensuring
					//   EXIT ONLY is centered between all the arrows.
					for (let arrowIndex = 0, length = panel.sign.guideArrowLanes; arrowIndex < length; arrowIndex++) {
						// Evens
						if (length %2 == 0) {
							if (arrowIndex == Math.floor(length/2)) {
								const textExitOnlySpanElmt = document.createElement("span");
								textExitOnlySpanElmt.appendChild(document.createTextNode("EXIT ONLY"));
								textExitOnlySpanElmt.className = "exitOnlyText";
								guideArrowsElmt.appendChild(textExitOnlySpanElmt);
								guideArrowsElmt.appendChild(exitOnlyArrowElmt());
							} else {
								guideArrowsElmt.appendChild(downArrowElmt());
							}
						} else { // Odds
							if (arrowIndex == Math.floor(length/2)) {
								const textExitSpanElmt = document.createElement("span");
								textExitSpanElmt.appendChild(document.createTextNode("EXIT"));
								textExitSpanElmt.className = "exitOnlyText";
								guideArrowsElmt.appendChild(textExitSpanElmt);
								guideArrowsElmt.appendChild(exitOnlyArrowElmt());
								const textOnlySpanElmt = document.createElement("span");
								textOnlySpanElmt.appendChild(document.createTextNode("ONLY"));
								textOnlySpanElmt.className = "exitOnlyText";
								guideArrowsElmt.appendChild(textOnlySpanElmt);
							} else if (arrowIndex == Math.ceil(length/2)) {
								guideArrowsElmt.appendChild(exitOnlyArrowElmt());
							} else {
								guideArrowsElmt.appendChild(downArrowElmt());
							}
						}
					}
				} else {
					guideArrowsElmt.style.backgroundColor = signElmt.style.backgroundColor;
					guideArrowsElmt.style.borderColor = signElmt.style.borderColor;
					guideArrowsElmt.style.color = signElmt.style.color;

					if (panel.sign.guideArrow == "Custom Text") {
						guideArrowsElmt.appendChild(document.createTextNode(panel.sign.customText));
					} else {
						if (panel.sign.guideArrow == "Down Arrow" || panel.sign.guideArrow == "Up Arrow") {
							guideArrowsElmt.style.fontFamily = "Arrows Two";
						} else {
							guideArrowsElmt.style.fontFamily = "Arrows One";
						}
						for (let arrowIndex = 0, length = panel.sign.guideArrowLanes; arrowIndex < length; arrowIndex++) {
							const arrowElmt = document.createElement("span");
							arrowElmt.className = "arrow";
							let arrowChoice = panel.sign.guideArrow;
							if (panel.sign.guideArrow.includes("/Up")) {
								arrowElmt.className += " rotate180";
								arrowChoice = panel.sign.guideArrow.replace("Up", "Down");
							}
							arrowElmt.appendChild(document.createTextNode(lib.specialCharacters[arrowChoice]));
							guideArrowsElmt.appendChild(arrowElmt);
						}
					}
				}
			}
		}
	}

	return {
		init : init,
		newPanel : newPanel,
		duplicatePanel : duplicatePanel,
		deletePanel : deletePanel,
		shiftLeft : shiftLeft,
		shiftRight : shiftRight,
		changeEditingPanel : changeEditingPanel,
		newShield : newShield,
		readForm : readForm
	};
})();
