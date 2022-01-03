import { MiniPackman } from "./MiniPackman.js";

// initialization
const canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;

// instatiating MiniPackman
const miniPackman = new MiniPackman(canvas, {
	blocks: [
		// [x, y, width, height],
		[20, 80, 300, 15],
		[380, 80, 100, 15],
		[200, 150, 220, 15],
		[20, 150, 100, 15],

		[180, 300, 300, 15],
		[20, 300, 100, 15],
		[300, 315, 15, 120],
		[20, 300, 100, 15],
	],
});

// draw stuff and animate
miniPackman.drawStuff().startAnimation();
