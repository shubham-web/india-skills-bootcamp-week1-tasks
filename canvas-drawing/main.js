// elems
const canvas = document.querySelector("#cnv");
const saveBtn = document.querySelector("#saveBtn");

const sigCanvas = new SignatureCanvas(canvas, {
	width: 500,
	height: 500,
	color: "blue", // drawing color
	download: {
		button: saveBtn, // optional download element
	},
});

// initializing drawing canvas
sigCanvas.init();
