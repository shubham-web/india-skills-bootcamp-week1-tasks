import { qs, qsa, getRandom } from "./modules/helpers.js";
import Tetris from "./modules/Tetris.js";

// elements
const cube = qs(".cube");
const start = qs("#start");
const restartButton = qs("#restartGame");
const scoreSpans = qsa(".scoreSpan");
const pauseButton = qs("#pauseButton");
const gameOverScreen = qs(".gameOverScreen");
const gameOver = qs("#gameOver");
const board = qs(".board");
const nextElementBoard = qs(".nextElementBoard");

// Game Config
const config = {
	blockSize: 40, // in pixels
	columns: 10,
	rows: 14,
};
let tetrisGame;

[start, restartButton].forEach((el) => {
	el.addEventListener("click", () => {
		cube.dataset.active = "bottom";
		if (tetrisGame) {
			tetrisGame.destroy();
		}
		tetrisGame = new Tetris(
			board,
			{
				nextElementBoard,
				scoreSpans,
				gameOver,
			},
			config
		);
		tetrisGame.init();
		tetrisGame.start();
	});
});
pauseButton.addEventListener("click", () => {
	tetrisGame.paused = !tetrisGame.paused;
	if (tetrisGame.paused) {
		pauseButton.innerText = "Resume";
	} else {
		pauseButton.innerText = "Pause";
	}
});

gameOver.addEventListener("click", () => {
	cube.dataset.active = "back";
});

// cns
this.nullTiles = [n, n, n];
this.board = this.nullTiles;
