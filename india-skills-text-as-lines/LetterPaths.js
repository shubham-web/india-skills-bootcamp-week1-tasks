export default class LetterPaths {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
	}
	LetterI = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#ed1b24";
		_.moveTo(pos.x, pos.y);
		_.lineTo(pos.x + 46, pos.y);
		_.lineTo(pos.x - 13, pos.y + 156);
		_.lineTo(pos.x - 46, pos.y + 156);
		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	LetterN = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#0060aa";
		_.moveTo(pos.x, pos.y);
		_.lineTo(362, 133);
		_.lineTo(375, 69);
		_.lineTo(419, 69);
		_.lineTo(384, 242);
		_.lineTo(318, 162);
		_.lineTo(305, 224);
		_.lineTo(259, 225);
		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	LetterD = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#008a49";
		_.moveTo(pos.x, pos.y);
		_.lineTo(576, 69);
		_.lineTo(544, 225);
		_.lineTo(415, 225);
		_.lineTo(436, 124);
		_.lineTo(483, 124);
		_.lineTo(471, 179);
		_.lineTo(509, 179);
		_.lineTo(521, 114);
		_.lineTo(448, 114);

		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	LetterA = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#008a49";
		_.moveTo(pos.x, pos.y);
		_.lineTo(807, 69);
		_.lineTo(764, 270);
		_.lineTo(729, 224);
		_.lineTo(751, 115);
		_.lineTo(715, 115);
		_.lineTo(690, 225);
		_.lineTo(645, 225);

		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	LetterS = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#008a49";
		_.moveTo(pos.x, pos.y);
		_.lineTo(237, 294);
		_.lineTo(227, 339);
		_.lineTo(144, 340);
		_.lineTo(142, 349);
		_.lineTo(225, 349);
		_.lineTo(205, 450);
		_.lineTo(30, 450);
		_.lineTo(86, 405);
		_.lineTo(168, 404);
		_.lineTo(169, 395);
		_.lineTo(87, 395);
		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	LetterK = (pos = { x: 0, y: 0 }) => {
		let _ = this.ctx;

		_.beginPath();
		_.fillStyle = "#0060aa";
		_.moveTo(pos.x, pos.y);
		_.lineTo(311, 394);
		_.lineTo(298 - 5, 358);
		_.lineTo(397, 276);
		_.lineTo(382, 342);
		_.lineTo(328, 387);
		_.lineTo(364, 432);
		_.lineTo(350, 496);
		_.lineTo(289, 418);
		_.lineTo(284, 422);
		_.lineTo(277, 450);
		_.lineTo(231, 450);

		_.lineTo(pos.x, pos.y);
		_.fill();
		_.closePath();
	};
	drawLine = (p = [], color = "#000") => {
		let _ = this.ctx;
		_.beginPath();
		_.fillStyle = color;

		_.closePath();
	};
}
