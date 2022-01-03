export class MiniPackman {
	constructor(canvas, { blocks }) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.blocks = blocks;

		this.lineOffset = 100;
		this.mouthOpen = false;

		// tick tick
		this.lastDrawn = null;
	}
	drawStuff = () => {
		this.drawOutline();
		this.drawBlocks();
		this.drawHead({ color: "yellow" });
		this.drawFood();
		return this;
	};
	startAnimation = () => {
		this.animate();
		this.tickHead();
	};
	tickHead = () => {
		setInterval(() => {
			this.mouseOpen = !this.mouseOpen;
		}, 200);
	};
	animate = () => {
		requestAnimationFrame(this.animate);

		this.msPassed = 0;
		if (this.lastDrawn) {
			let now = Date.now();
			this.msPassed = now - this.lastDrawn;
			if (this.msPassed < 100) {
				return;
			}
		}

		this.lineOffset--;
		if (this.lineOffset < 0) {
			this.lineOffset = 100;
		}
		this.drawStuff();
		this.lastDrawn = Date.now();
	};

	drawOutline = () => {
		let _ = this.ctx;
		_.clearRect(0, 0, this.canvas.width, this.canvas.height);
		_.strokeStyle = "white";
		_.lineWidth = 5;
		_.lineCap = "round";
		_.strokeRect(10, 10, this.canvas.width - 20, this.canvas.height - 20);
	};

	drawHead = ({ color }) => {
		let _ = this.ctx;
		_.beginPath();

		if (this.mouseOpen) {
			_.arc(50, 50, 20, Math.PI / 5, -Math.PI / 5);
		} else {
			_.arc(50, 50, 20, 0, Math.PI * 2);
		}
		_.lineTo(45, 50);

		_.fillStyle = color || "white";
		_.fill();

		_.closePath();
	};
	drawFood = () => {
		let _ = this.ctx;
		_.save();

		_.beginPath();
		_.setLineDash([4, 10]);
		_.lineDashOffset = this.lineOffset;
		_.moveTo(75, 50);
		_.lineTo(450, 50);
		_.moveTo(350, 60);
		_.lineTo(350, 120);
		_.lineTo(20, 120);
		_.moveTo(350, 120);
		_.lineTo(450, 120);

		_.moveTo(160, 120);
		_.lineTo(160, 300);

		_.stroke();
		_.closePath();

		_.restore();
	};
	drawBlocks = (blocks = this.blocks) => {
		let _ = this.ctx;
		for (let block of blocks) {
			_.strokeStyle = "#fffacd";
			_.lineWidth = 3;
			_.strokeRect(block[0], block[1], block[2], block[3]);
		}
	};
}
