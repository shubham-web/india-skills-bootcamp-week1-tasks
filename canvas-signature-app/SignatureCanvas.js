class SignatureCanvas {
	constructor(canvas, params) {
		this.canvas = canvas;
		this.params = params;

		this.state = {
			drawing: false,
			dirty: false,
		};
	}
	init() {
		this.canvas.width = this.params.width;
		this.canvas.height = this.params.height;
		this.ctx = this.canvas.getContext("2d");

		this.downloadButton = this.params?.download?.button;

		this.addEvents();
	}
	drawingEvents = {
		mousedown: (e) => {
			this.state.drawing = true;

			this.canvas.addEventListener("mousemove", this.drawingEvents.mousemove);
			document.addEventListener("mouseup", this.drawingEvents.mouseup);

			let drawingPos = this.getPointerPosition(e);
			this.ctx.moveTo(drawingPos.x, drawingPos.y);
		},
		mouseup: () => {
			this.state.drawing = false;
			this.canvas.removeEventListener("mousemove", this.drawingEvents.mousemove);
			document.removeEventListener("mouseup", this.drawingEvents.mouseup);
		},
		mousemove: (e) => {
			this.state.dirty = true;
			if (!this.state.drawing) {
				return;
			}
			let drawingPos = this.getPointerPosition(e);
			this.ctx.strokeStyle = this.params.color;
			this.ctx.lineTo(drawingPos.x, drawingPos.y);
			this.ctx.stroke();
		},
	};
	getPointerPosition = (e) => {
		let canvasPos = this.canvas.getBoundingClientRect();
		let drawingPos = {
			x: e.clientX - canvasPos.x,
			y: e.clientY - canvasPos.y,
		};
		return drawingPos;
	};
	download = () => {
		if (!this.state.dirty) {
			alert("Please draw something");
			return;
		}
		let imageDataUrl = this.canvas.toDataURL();
		let dlLink = document.createElement("a");
		dlLink.href = imageDataUrl;
		dlLink.download = "your-signature.png";
		dlLink.click();
	};
	addEvents = () => {
		this.canvas.addEventListener("mousedown", this.drawingEvents.mousedown);

		this.downloadButton.addEventListener("click", this.download);
	};
}
