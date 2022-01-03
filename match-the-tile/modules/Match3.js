import { getRandomElement, maximumElement } from "./helper.js";
import Direction from "./direction.js";

const AXIS = { HORIZONTAL: "HORIZONTAL", VERTICAL: "VERTICAL" };

export class Match3 {
	constructor(elems = {}, config = {}, options = {}) {
		this.elems = elems;
		this.config = config;
		this.options = options;

		this.state = {
			score: 0,
			activeTile: null,
			activeTileElement: null,
			movementDirection: [],
			originPosition: { row: 0, col: 0 },
		};

		this.moves = [];

		this.initialHydrationDone = false;
	}
	init() {
		let randomColors = [];
		for (let i = 0; i < this.config.tile.count * this.config.tile.count; i++) {
			randomColors.push(getRandomElement(this.config.colors));
		}
		this.hydrateGrid(randomColors);
		this.fillScore();
	}
	hydrateGrid = (colors) => {
		console.log("Grid refreshed");
		let wrapper = this.elems.tileGrid;
		if (!wrapper) {
			console.warn("tile grid is missing!");
		}
		wrapper.innerHTML = "";
		Object.assign(wrapper.style, {
			display: "grid",
			gridTemplateColumns: `repeat(${this.config.tile.count || 8}, 1fr)`,
			gridTemplateRows: `repeat(${this.config.tile.count || 8}, 1fr)`,
			gap: `${this.config.tile.gap}px`,
			width: `${this.config.tile.size * this.config.tile.count}px`,
			height: `${this.config.tile.size * this.config.tile.count}px`,
		});

		for (let i = 1; i <= this.config.tile.count * this.config.tile.count; i++) {
			let tile = document.createElement("div");
			tile.dataset.i = i;
			tile.style.background = colors[i - 1];

			// programatically match some tiles
			if (!this.initialHydrationDone) {
				if ([41, 42, 43, 44, 61, 62, 63, 64].includes(i)) {
					tile.style.background = "white";
				}
			}
			this.addEventsOnTile(tile);
			wrapper.appendChild(tile);
		}

		if (!this.initialHydrationDone) {
			document.addEventListener("mousemove", this.tileEvents.mousemove);
			document.addEventListener("mouseup", this.tileEvents.mouseup);
		}

		// disolve matched in initial view
		setTimeout(
			() => {
				let dissolvables = this.getDissolvables();
				this.disolve(dissolvables, false);
			},
			this.initialHydrationDone ? 1000 : 700
		);
		if (!this.initialHydrationDone) {
			this.initialHydrationDone = true;
		}
	};
	fillScore = () => {
		this.elems.scoreHolder.innerHTML = `Score: ${this.state.score}`;
	};
	getActiveTile = () => {
		console.log(this.state.activeTile);
		if (!this.state.activeTile) {
			console.warn("Active tile state value is invalid.", this.state.activeTile);
			return null;
		}
		return this.elems.tileGrid.querySelector(`[data-i="${this.state.activeTile}"]`);
	};
	getDirection = ({ deltaX, deltaY }) => {
		if (deltaX > 0) {
			return Direction.RIGHT;
		} else if (deltaX < 0) {
			return Direction.LEFT;
		} else if (deltaY > 0) {
			return Direction.DOWN;
		} else if (deltaY < 0) {
			return Direction.UP;
		}
	};
	tileEvents = {
		mousedown: (e) => {
			if (this.state.activeTile) {
				return;
			}
			let tile = e.currentTarget;
			tile.classList.add("active");
			this.state.activeTile = tile.dataset.i;
			this.state.activeTileElement = tile;
			this.state.originPosition = this.getRowColData(tile);
		},
		mouseup: () => {
			if (!this.state.activeTile) {
				return;
			}
			let tileEl = this.state.activeTileElement;
			tileEl.classList.remove("active");
			setTimeout(() => {
				tileEl.removeAttribute("data-going");
			}, 300);

			this.state.activeTile = null;
			this.state.activeTileElement = null;
			this.state.movementDirection = [];
			this.state.originPosition = { row: 0, col: 0 };
		},
		mousemove: (e) => {
			if (!this.state.activeTile) {
				return;
			}
			let tileEl = this.state.activeTileElement;
			let dir = this.getDirection({ deltaX: e.movementX, deltaY: e.movementY });
			this.state.movementDirection.push(dir);
			tileEl.dataset.going = dir;
			let confirmedDirection = this.getConfimDirection();
			if (!confirmedDirection) {
				return;
			}
			// console.log(confirmedDirection, "confirmedDirection");
			tileEl.dataset.going = confirmedDirection;
			console.log("originPosition", this.state.originPosition, confirmedDirection);

			let { row: originRow, col: originCol } = this.state.originPosition;

			let target = { row: originRow, col: originCol };
			switch (confirmedDirection) {
				case Direction.LEFT:
					target.col -= 1;
					break;
				case Direction.RIGHT:
					target.col += 1;
					break;
				case Direction.UP:
					target.row -= 1;
					break;
				case Direction.DOWN:
					target.row += 1;
					break;
			}
			if (target.col > this.config.tile.count) {
				target.col = this.config.tile.count;
			} else if (target.row > this.config.tile.count) {
				target.row = this.config.tile.count;
			}
			if (target.col === 0) {
				target.col = originCol;
			} else if (target.row === 0) {
				target.row = originRow;
			}
			let invalidMove = target.row === originRow && target.col === originCol;

			if (invalidMove) {
				console.log("Invalid Move!");
			} else {
				console.log("target", target);
				this.replaceTile({ row: originRow, col: originCol }, target);
				let dissolvable = this.getDissolvables();
				if (dissolvable[AXIS.HORIZONTAL]?.length > 0 || dissolvable[AXIS.VERTICAL]?.length > 0) {
					setTimeout(() => {
						this.disolve(dissolvable);
					}, 300);
				}
			}
			// programatically leave mouse
			this.tileEvents.mouseup();
		},
	};
	replaceTile = (origin, target) => {
		// console.log("origin", origin, "target", target);
		this.moves.push({ origin, target }); // save the move

		let originTile = this.getTileElement(origin);
		let targetTile = this.getTileElement(target);
		if (targetTile.classList.contains("dissolve")) {
			// moving towards dissolved space
			return;
		}

		let originColor = originTile.style.background;
		let targetColor = targetTile.style.background;

		// swap the colors
		targetTile.style.background = originColor;
		originTile.style.background = targetColor;
	};
	getConfimDirection = () => {
		let directions = this.state.movementDirection;
		if (directions.length < 8) {
			return;
		}
		let confirmedDirection = maximumElement(directions);
		return confirmedDirection;
	};
	getTileElement = (target = { row: 1, col: 1 }) => {
		let firstElementOfTargetRow = (target.row - 1) * this.config.tile.count;
		return this.elems.tileGrid.children[firstElementOfTargetRow + target.col - 1];
	};
	getRowColData = (tile) => {
		let tileIndex = parseInt(tile.dataset.i);
		let rowSize = this.config.tile.count;
		/* let colSize = this.config.tile.count;
		let totalTiles = this.config.tile.count * this.config.tile.count; */

		let targetRow = parseInt(tileIndex / rowSize);
		if (tileIndex % rowSize > 0) {
			targetRow++;
		}
		let elementsInPreviousRows = (targetRow - 1) * this.config.tile.count;
		let targetCol = tileIndex - elementsInPreviousRows;

		return { row: targetRow, col: targetCol };
	};
	addEventsOnTile = (tile) => {
		tile.addEventListener("mousedown", this.tileEvents.mousedown);
	};
	getColors = (axis = AXIS.HORIZONTAL, excludeDissolved = false) => {
		if (axis === AXIS.HORIZONTAL) {
			let rowWiseColors = [];

			for (let row = 1; row <= this.config.tile.count; row++) {
				rowWiseColors[row - 1] = [];
				for (let col = 1; col <= this.config.tile.count; col++) {
					let tileEl = this.getTileElement({ row, col });
					rowWiseColors[row - 1].push(tileEl.style.background);
				}
			}
			return rowWiseColors;
		} else if (axis === AXIS.VERTICAL) {
			let colWiseColors = [];

			for (let col = 1; col <= this.config.tile.count; col++) {
				colWiseColors[col - 1] = [];
				for (let row = 1; row <= this.config.tile.count; row++) {
					let tileEl = this.getTileElement({ row, col });
					colWiseColors[col - 1].push(tileEl.style.background);
				}
			}
			return colWiseColors;
		}
		console.warn("Invalid axis value provided in get colors function");
		return [];
	};
	getDissolvables = () => {
		let rowWiseColors = this.getColors(AXIS.HORIZONTAL);

		let colWiseColors = this.getColors(AXIS.VERTICAL);

		let horizonatallyDissolvable = [];
		rowWiseColors.forEach((rowOfColors, rowIndex) => {
			for (let color = 0; color < rowOfColors.length; color++) {
				let matched =
					rowOfColors[color] === rowOfColors[color + 1] && rowOfColors[color + 1] === rowOfColors[color + 2];
				if (matched) {
					let count = 0;
					for (let i = color; i < rowOfColors.length; i++) {
						if (rowOfColors[i] === rowOfColors[color]) {
							count++;
						} else {
							break;
						}
					}

					horizonatallyDissolvable.push({
						color: rowOfColors[color],
						count,
						row: rowIndex + 1,
						col: color + 1,
					});
				}
			}
		});

		let verticallyDissolvable = [];
		colWiseColors.forEach((colOfColors, colIndex) => {
			for (let color = 0; color < colOfColors.length; color++) {
				let matched =
					colOfColors[color] !== "" &&
					colOfColors[color] === colOfColors[color + 1] &&
					colOfColors[color + 1] === colOfColors[color + 2];
				if (matched) {
					let count = 0;
					for (let i = color; i < colOfColors.length; i++) {
						if (colOfColors[i] === colOfColors[color]) {
							count++;
						} else {
							break;
						}
					}
					verticallyDissolvable.push({
						color: colOfColors[color],
						count,
						col: colIndex + 1,
						row: color + 1,
					});
				}
			}
		});

		return { [AXIS.HORIZONTAL]: horizonatallyDissolvable, [AXIS.VERTICAL]: verticallyDissolvable };
	};
	disolve = (disolvables, modifyScore = true) => {
		for (let axis in disolvables) {
			let elements = disolvables[axis];

			for (let element of elements) {
				let firstNode = this.getTileElement({ row: element.row, col: element.col });
				if (firstNode.classList.contains("dissolve")) {
					// already disolved
					continue;
				}

				let nodesToDissolve = [];

				for (let nodeOccurence = 0; nodeOccurence < element.count; nodeOccurence++) {
					if (axis === AXIS.VERTICAL) {
						nodesToDissolve.push(
							this.getTileElement({ row: element.row + nodeOccurence, col: element.col })
						);
					} else if (axis === AXIS.HORIZONTAL) {
						nodesToDissolve.push(
							this.getTileElement({ row: element.row, col: element.col + nodeOccurence })
						);
					}
				}

				nodesToDissolve.forEach((el) => {
					el.classList.add("dissolve");
					el.style.background = "";
				});
				if (modifyScore) {
					this.state.score += 10;
				}
				// console.log("--");
			}
		}

		this.checkGaps();

		this.fillScore();
	};
	checkGaps = () => {
		let colWiseColors = this.getColors(AXIS.VERTICAL);
		// console.log("colWiseColors", colWiseColors);

		let filteredColors = [];
		for (let col = 1; col <= colWiseColors.length; col++) {
			let columnColors = colWiseColors[col - 1];
			let gapCount = columnColors.filter((color) => color === "").length;
			let hasGaps = columnColors.filter((color) => color !== "").length < this.config.tile.count;
			// console.log("col", col, "hasGaps", hasGaps);
			if (!hasGaps) {
				filteredColors.push(columnColors);
				continue;
			}
			// console.log(col, columnColors);

			// shift tiles to bottom
			// console.log(gapCount);

			let movments = [];

			for (let gap = 0; gap < /* gapCount */ 8; gap++) {
				for (let nicheWaliTile = columnColors.length - 1; nicheWaliTile >= 0; nicheWaliTile--) {
					let colorOfnicheWaliTile = columnColors[nicheWaliTile];
					if (colorOfnicheWaliTile !== "") {
						continue;
					}
					// colorless tile -> fill it with the color of tile above it
					// console.log("nicheWaliTile", columnColors, nicheWaliTile);

					let reversedColors = [...columnColors];
					reversedColors.reverse();
					let actualIndexOfTileAboveIt = reversedColors.findIndex(
						(color, index) => color !== "" && index >= reversedColors.length - nicheWaliTile
					);

					if (actualIndexOfTileAboveIt < 0) {
						// there is no filled tile above it
					} else {
						actualIndexOfTileAboveIt = this.config.tile.count - 1 - actualIndexOfTileAboveIt;
						// console.log("actualIndexOfTileAboveIt", actualIndexOfTileAboveIt);
						// SWAP COLOR
						columnColors[nicheWaliTile] = columnColors[actualIndexOfTileAboveIt];
						columnColors[actualIndexOfTileAboveIt] = "";

						let elementToFallDown = this.getTileElement({
							row: actualIndexOfTileAboveIt + 1,
							col: col,
						});
						// console.log("Gap Tile Index", nicheWaliTile, "actualIndexOfTileAboveIt", actualIndexOfTileAboveIt);
						if (elementToFallDown) {
							let moveBy = nicheWaliTile - actualIndexOfTileAboveIt; // how many times the tile has to move

							movments.push({
								el: elementToFallDown,
								style: {
									transform: `translateY(
                                        calc(${100 * moveBy}% + ${this.config.tile.gap * moveBy}px))`,
								},
							});
						}
					}
					// this.checkGaps();
					break;
				}
			}
			filteredColors.push(columnColors);
			setTimeout(() => {
				for (let displacementData of movments) {
					Object.assign(displacementData.el.style, displacementData.style);
				}
				setTimeout(() => {
					// animation of waterfall done -> refil the dissolved tiles
					filteredColors = filteredColors.map((column) => {
						return column.map((color) => (color === "" ? getRandomElement(this.config.colors) : color));
					});
					// console.log(filteredColors);

					let modifiedColorsArray = [];

					// normalize array of arrays into simple single dimensional array
					for (let rrow = 0; rrow < this.config.tile.count; rrow++) {
						for (let ccol = 0; ccol < this.config.tile.count; ccol++) {
							modifiedColorsArray.push(filteredColors[ccol][rrow]);
						}
					}
					this.hydrateGrid(modifiedColorsArray);
				}, 200);
			}, 600);
			// console.log("-====", filteredColors);
		}
	};
}
