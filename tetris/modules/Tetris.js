import { copyObject, getRandom, qs, qsa } from "./helpers.js";
import Bricks from "./Bricks.js";

const keys = {
	ArrowRight: "ArrowRight",
	ArrowLeft: "ArrowLeft",
	ArrowUp: "ArrowUp",
	ArrowDown: "ArrowDown",
};
const Direction = {
	UP: "UP",
	DOWN: "DOWN",
	LEFT: "LEFT",
	RIGHT: "RIGHT",
};

export default class Tetris {
	constructor(gameBoard, elements, config, options = {}) {
		this.config = config;
		this.options = options;
		this.bricks = Bricks.List;

		this.state = {
			board: {
				width: null,
				height: null,
			},
			movingBrick: { data: null, targetPos: { row: null, col: null }, rotation: 0 },
		};

		this.elems = {
			gameBoard: gameBoard,
			...elements,
		};
		this.tilesGenerated = 0;
		this.gameOver = false;
		this.paused = false;
		this.justMovedWithKeys = false;

		this.nextBrick = this.getRandomBrick();
		this.score = 0;
	}
	init() {
		// populate blocks in grid element (this.gameBoard)
		this.hydrateBoard();
		this.hydrateNextBrickUI();

		// test bricks
		/* this.mount(this.getRandomBrick(), {
			row: 1,
			col: 1,
		}); */
	}
	getRandomBrick() {
		let min = 0;
		let max = this.bricks.length;
		let randomIndex = parseInt(getRandom(min, max));
		this.tilesGenerated++;
		// console.log("randomIndex", randomIndex);
		return copyObject(this.bricks[randomIndex]);
	}
	hydrateNextBrickUI = () => {
		this.elems.nextElementBoard.innerHTML = "";
		let brick = this.nextBrick;
		if (brick.key === "straightLine") {
			// rotate straighLine to fit in the grid
			brick.body = this.rotateBrickBody(brick.body);
		}
		this.mount(brick, { row: brick.key === "straightLine" ? 1 : 2, col: 1 }, this.elems.nextElementBoard);
	};
	updateNextBrick = () => {
		this.nextBrick = this.getRandomBrick();
		this.hydrateNextBrickUI();
	};
	getNewBrick() {
		let nextBrick = copyObject(this.nextBrick);
		this.updateNextBrick();
		return nextBrick;
	}
	getBlockElement = (target = { row: 1, col: 1 }) => {
		let firstElementOfTargetRow = (target.row - 1) * this.config.columns;
		return this.elems.gameBoard.children[firstElementOfTargetRow + target.col - 1];
	};
	mount(brick, startPosition = { row: 1, col: 1 }, wrapper = null) {
		if (!brick) {
			console.warn("Brick data is missing!");
			return;
		}

		let rowsInBrick = brick.body.length;
		let colsInBrick = brick.body[0].length;

		let activeTiles = qsa(".activeBrickTile", wrapper || this.elems.gameBoard);
		[...activeTiles].forEach((el) => {
			el.remove();
		});

		let brickElements = [];
		for (let brickRow = 0; brickRow < rowsInBrick; brickRow++) {
			let invalid = false;
			for (let brickCol = 0; brickCol < colsInBrick; brickCol++) {
				let isFilled = brick.body[brickRow][brickCol];
				let tile = document.createElement("div");

				// console.log(startPosition, startPosition.row + brickRow, startPosition.col + brickCol);
				let rowStart = startPosition.row + brickRow;
				let colStart = startPosition.col + brickCol;
				if (rowStart > this.config.rows) {
					invalid = true;
					break;
				}
				if (colStart > this.config.columns) {
					invalid = true;
					break;
				}
				tile.style.gridRowStart = rowStart;
				tile.style.gridColumnStart = colStart;
				tile.classList.add("activeBrickTile");
				tile.dataset.row = rowStart;
				tile.dataset.col = colStart;
				if (!isFilled) {
					tile.classList.add("invisible");
					brickElements.push(tile);
					continue;
				}
				tile.classList.add("activeBrickTile", brick.colorClass);
				brickElements.push(tile);
			}
			if (invalid) {
				break;
			}
		}
		brickElements.forEach((el) => {
			(wrapper || this.elems.gameBoard).appendChild(el);
		});
	}

	hydrateBoard = () => {
		this.elems.gameBoard.innerHTML = "";

		// set width and height of board based on blocksize, rows and cols
		this.state.board.width = this.config.blockSize * this.config.columns;
		this.state.board.height = this.config.blockSize * this.config.rows;

		Object.assign(this.elems.gameBoard.style, {
			width: `${this.state.board.width}px`,
			height: `${this.state.board.height}px`,
			gridTemplateRows: `repeat(${this.config.rows}, ${this.config.blockSize}px)`,
			gridTemplateColumns: `repeat(${this.config.columns}, ${this.config.blockSize}px)`,
		});
		let blocksHTML = "";

		/* let totalBlocks = this.config.columns * this.config.rows;
		for (let block = 1; block <= totalBlocks; block++) {
			blocksHTML += `<div></div>`;
		}
		this.elems.gameBoard.innerHTML = blocksHTML; */
	};
	start() {
		this.addEventListeners();
		this.tick();
	}
	addEventListeners = () => {
		document.addEventListener("keyup", (e) => {
			if (this.paused) {
				return;
			}
			if (!Object.keys(keys).includes(e.key)) {
				return;
			}

			if (!this.state.movingBrick.data) {
				return;
			}
			let expectedChange = {
				row: this.state.movingBrick.targetPos.row,
				col: this.state.movingBrick.targetPos.col,
			};
			switch (e.key) {
				case "ArrowRight":
					expectedChange.col++;
					break;
				case "ArrowLeft":
					expectedChange.col--;
					break;
				case "ArrowDown":
					expectedChange.row++;
					break;
				case "ArrowUp":
					this.state.movingBrick.data.body = this.rotateBrickBody(this.state.movingBrick.data.body);
					// console.log(this.state.movingBrick.data.body);
					break;
			}
			if (expectedChange.row < 1 || expectedChange.col < 1) {
				return;
			}

			let lastColumnItWouldGoUpto = expectedChange.col - 1 + this.state.movingBrick.data.body[0].length;
			let lastRowItWouldGoUpto = expectedChange.row - 1 + this.state.movingBrick.data.body.length;
			if (lastColumnItWouldGoUpto > this.config.columns) {
				return;
			}
			if (lastRowItWouldGoUpto > this.config.rows || (!this.canActiveBrickGoDown() && e.key === "ArrowDown")) {
				return;
			}

			this.state.movingBrick.targetPos.row = expectedChange.row;
			this.state.movingBrick.targetPos.col = expectedChange.col;
			this.mount(this.state.movingBrick.data, this.state.movingBrick.targetPos);
			this.justMovedWithKeys = true;
		});
	};
	rotateBrickBody = (body) => {
		body = copyObject(body);
		let loopCount = body[0].length;
		let updated = [];

		let reversedBody = [];
		for (let rev = 0; rev < body.length; rev++) {
			// console.log("before", body[rev]);
			reversedBody[rev] = body[rev].reverse();
			// console.log("after", body[rev]);
		}
		for (let i = 0; i < loopCount; i++) {
			let firstRow = [];
			for (let j = 0; j < reversedBody.length; j++) {
				firstRow.push(reversedBody[j][i]);
			}
			updated.push(firstRow);
		}
		return updated;
	};
	canActiveBrickGoDown = () => {
		let rowsInBrick = this.state.movingBrick.data.body.length;
		let rowsInBoard = this.config.rows;

		// console.log("movingBrick", JSON.stringify(this.state.movingBrick));
		let nextRow = this.state.movingBrick.targetPos.row;
		let needsSpaceIn = { row: nextRow + rowsInBrick, col: 0 /** will be dynamically incremented */ }; // needs space in next row (+ rowsInBrick because entire brick should fit in)

		if (needsSpaceIn.row > rowsInBoard) {
			return false;
		}

		// check if space available
		let lastRowOfBrick = this.state.movingBrick.data.body[rowsInBrick - 1];
		let neededBlocks = lastRowOfBrick.filter((el) => el === 1).length;
		let availableBlocks = 0;

		needsSpaceIn.col = this.state.movingBrick.targetPos.col;
		for (let filled of lastRowOfBrick) {
			if (!filled) {
				needsSpaceIn.col++;
				continue;
			}
			let foundElement = qs(`[data-row="${needsSpaceIn.row}"][data-col="${needsSpaceIn.col}"]:not(.invisible)`);
			if (foundElement === null) {
				// there is no element on the desired position
				availableBlocks++;
			}
			needsSpaceIn.col++;
		}

		if (neededBlocks !== availableBlocks) {
			console.log("neededBlocks", neededBlocks, "availableBlocks", availableBlocks);
			console.log("===");
		}

		return neededBlocks === availableBlocks;
	};
	checkDissolvables = () => {
		return new Promise((resolve, reject) => {
			let elementsInthelastrow = qsa(`[data-row="${this.config.rows}"]:not(.invisible)`);
			if (elementsInthelastrow.length !== this.config.columns) {
				resolve();
				return;
			}
			// can dissolve
			console.log("can dissolve");
			setTimeout(() => {
				/* elementsInthelastrow.forEach((el) => {
					el.remove();
				}); */
				[...this.elems.gameBoard.children].forEach((el) => {
					let rowStart = parseInt(el.dataset.row);
					if (rowStart + 1 > this.config.rows) {
						el.remove();
						return;
					}
					el.dataset.row = el.style.gridRowStart = rowStart + 1;
				});
				this.score += 10;
				this.updateScore();
				resolve();
			}, 300);
		});
	};
	isGameOver = () => {
		// check if there are any elements staying in the first row
		let elementInFirstRow = qsa(`[data-row="1"]:not(.activeBrickTile)`, this.elems.gameBoard);
		return elementInFirstRow.length > 0;
	};
	markGameAsOver = () => {
		this.gameOver = true;
		setTimeout(() => {
			this.elems.gameOver.click();
		}, 500);
	};
	destroy = () => {
		this.score = 0;
		this.gameOver = true;
		this.updateScore();
	};
	updateScore = () => {
		this.elems.scoreSpans.forEach((el) => {
			el.innerHTML = this.score;
		});
	};
	tick = () => {
		if (this.gameOver) {
			return;
		}

		if (this.isGameOver()) {
			return this.markGameAsOver();
		} else {
			this.checkDissolvables().then(() => {
				setTimeout(this.tick, 200);
			});
			if (this.justMovedWithKeys) {
				this.justMovedWithKeys = false;
				return;
			}
			if (this.paused) {
				return;
			}
		}
		let newBrick = false;
		if (!this.state.movingBrick.data) {
			this.state.movingBrick.data = this.getNewBrick();
			this.state.movingBrick.targetPos = { row: 1, col: 4 };
			newBrick = true;
		}

		// check if reached the end
		let rowsInBrick = this.state.movingBrick.data.body.length;
		// console.log(rowsInBrick + this.state.movingBrick.targetPos.row);
		let rowsInBoard = this.config.rows;

		let reachedEndOfBoard = this.state.movingBrick.targetPos.row - 1 + rowsInBrick >= rowsInBoard;

		let canGoFurthurDown = this.canActiveBrickGoDown();
		if (newBrick && !canGoFurthurDown) {
			return this.markGameAsOver();
		}

		if (reachedEndOfBoard || !canGoFurthurDown) {
			// stop
			this.state.movingBrick.data = null;
			let activeTiles = qsa(".activeBrickTile");
			[...activeTiles].forEach((el) => {
				el.classList.remove("activeBrickTile");
			});
			return;
		}
		// update the row
		if (!newBrick) {
			this.state.movingBrick.targetPos.row += 1;
		}

		if (this.state.movingBrick.data) {
			this.mount(this.state.movingBrick.data, {
				row: this.state.movingBrick.targetPos.row,
				col: this.state.movingBrick.targetPos.col,
			});
		}
	};
}
