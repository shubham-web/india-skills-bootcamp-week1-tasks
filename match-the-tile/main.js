// imports
import { qs } from "./modules/helper.js";
import { Match3 } from "./modules/Match3.js";

// elements
const elements = {
	gameBoard: qs(".gameBoard"),
	tileGrid: qs(".tileGrid"),
	newGame: qs("#newGame"),
	scoreHolder: qs("#score"),
};

// game configuration
const config = {
	tile: {
		count: 8, // number of tiles in board
		size: 40, // in pixels
		gap: 3, // in pixels
	},
	colors: ["deeppink", "yellow", "blue", "green", "orange", "black", "cyan", "grey"],
};

let matchTheTile = new Match3(elements, config, {});

matchTheTile.init();
window.matchTheTile = matchTheTile;

elements.newGame.addEventListener("click", () => {
	window.location.reload();
});
