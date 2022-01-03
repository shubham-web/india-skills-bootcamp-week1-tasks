import constants from "./constants.js";
import SnakeLocalStorage from "./LocalStorage.js";
let {
	Direction: { LEFT, RIGHT, UP, DOWN },
	Speed,
} = constants;

export default class SnakeGame {
	constructor({ config, elements, player }) {
		this.config = config;
		this.state = {
			snake: [
				{ x: 6, y: 6 },
				{ x: 5, y: 6 },
				{ x: 4, y: 6 },
			],
			dir: { x: 1, y: 0 },
			dirText: RIGHT,
			food: { x: 2, y: 2 },
			lastUpdatedAt: 0,
			gameOver: false,
			score: 0,
		};
		this.board = elements.board;
		this.elements = elements;
		this.frameUpdated = false; // frameUpdatedSinceLastDirectionChange
		this.player = player;
	}
	init() {
		// console.log("gameConfig", this.config);
		this.drawStuff();

		this.addEvents();
	}
	addEvents = () => {
		window.addEventListener("keydown", (e) => {
			if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) || !this.frameUpdated) {
				return;
			}
			this.frameUpdated = false;
			switch (e.key) {
				case "ArrowUp":
					if ([RIGHT, LEFT].includes(this.state.dirText)) {
						this.state.dir = { x: 0, y: -1 };
						this.state.dirText = DOWN;
					}
					break;
				case "ArrowDown":
					if ([RIGHT, LEFT].includes(this.state.dirText)) {
						this.state.dir = { x: 0, y: 1 };
						this.state.dirText = DOWN;
					}
					break;
				case "ArrowLeft":
					if ([UP, DOWN].includes(this.state.dirText)) {
						this.state.dir = { x: -1, y: 0 };
						this.state.dirText = LEFT;
					}
					break;
				case "ArrowRight":
					if ([UP, DOWN].includes(this.state.dirText)) {
						this.state.dir = { x: 1, y: 0 };
						this.state.dirText = RIGHT;
					}
					break;
			}
		});
	};
	drawStuff = () => {
		this.board.innerHTML = "";
		this.mountsnake();
		this.mountFood();
	};
	start = (cTime) => {
		let timeDiff = parseFloat(cTime / 1000) - this.state.lastUpdatedAt;
		// console.log("timeDiff", timeDiff);
		if (!this.state.gameOver) {
			window.requestAnimationFrame(this.start);
		}
		if (timeDiff <= this.config.defaultSpeed) {
			return;
		}
		// let paint = this.lastUpdatedAt === null;
		this.updateFrame();
		this.drawStuff();
		this.state.lastUpdatedAt = parseFloat(cTime / 1000);
		this.elements.highScore.innerHTML = `High Score: ${this.player.highscore}`;
	};
	updateFrame = () => {
		let maxCols = getComputedStyle(this.board).gridTemplateColumns.split(" ").length;
		let maxRows = getComputedStyle(this.board).gridTemplateRows.split(" ").length;

		// update snake
		let snakeCopy = this.state.snake.map((e) => ({ x: e.x, y: e.y }));
		for (let i = 0; i < snakeCopy.length; i++) {
			// console.log(this.state.snake[i]);
			if (i !== 0) {
				// for non head body part of snake
				let lastTailElem = snakeCopy[i - 1];
				let updated = { x: lastTailElem.x, y: lastTailElem.y };
				this.state.snake[i] = updated;
			} else {
				this.state.snake[i].x += this.state.dir.x;
				this.state.snake[i].y += this.state.dir.y;

				if (this.state.snake[i].x > maxCols) {
					if (this.config.defaultSpeed !== Speed.SLOW) {
						this.state.gameOver = true;
						alert("Game Over");
					}
					this.state.snake[i].x = 1;
				} else if (this.state.snake[i].x === 0) {
					if (this.config.defaultSpeed !== Speed.SLOW) {
						this.state.gameOver = true;
						alert("Game Over");
					}
					this.state.snake[i].x = maxCols;
				}
				if (this.state.snake[i].y > maxRows) {
					if (this.config.defaultSpeed !== Speed.SLOW) {
						this.state.gameOver = true;
						alert("Game Over");
					}
					this.state.snake[i].y = 1;
				} else if (this.state.snake[i].y === 0) {
					if (this.config.defaultSpeed !== Speed.SLOW) {
						this.state.gameOver = true;
						alert("Game Over");
					}
					this.state.snake[i].y = maxRows;
				}
			}
		}

		// check food hitting
		if (this.state.snake[0].x === this.state.food.x && this.state.snake[0].y === this.state.food.y) {
			this.state.snake.unshift({ x: this.state.food.x, y: this.state.food.y });

			this.state.food.x = Math.round(2 + (maxCols - 2) * Math.random());
			this.state.food.y = Math.round(2 + (maxRows - 2) * Math.random());

			if (this.elements.scoreSpan) {
				this.state.score += 1;
				this.elements.scoreSpan.innerHTML = `Score ${this.state.score}`;
				this.player = SnakeLocalStorage.updateHighScore(this.player.name, this.state.score);
				if (this.refreshLeaderboard) {
					this.refreshLeaderboard();
				}
			}
			console.log("player", this.player.name);
		} else {
			// check self collision
			let hitsItself = this.state.snake.find(
				(e, index) => index !== 0 && e.x === this.state.snake[0].x && e.y === this.state.snake[0].y
			);
			if (hitsItself) {
				this.state.gameOver = true;
				alert("Game Over");
			}
		}
		this.frameUpdated = true;
	};
	mountsnake = () => {
		for (let i = 0; i < this.state.snake.length; i++) {
			let part = this.state.snake[i];
			let element = document.createElement("div");
			element.classList.add(i === 0 ? "snakeHead" : "snakeBody");
			element.style.gridRowStart = part.y;
			element.style.gridColumnStart = part.x;
			this.board.appendChild(element);
		}
	};
	mountFood = () => {
		let food = this.state.food;
		let element = document.createElement("div");
		element.classList.add("food");
		element.style.gridRowStart = food.y;
		element.style.gridColumnStart = food.x;
		this.board.appendChild(element);
	};
}
