import LetterPaths from "./LetterPaths.js";
const canvas = document.querySelector("canvas");

canvas.width = 945;
canvas.height = 517;

let drawHelper = new LetterPaths(canvas);

// india
drawHelper.LetterI({ x: 219, y: 69 });
drawHelper.LetterN({ x: 291, y: 51 });
drawHelper.LetterD({ x: 425, y: 69 });
drawHelper.LetterI({ x: 604, y: 69 });
drawHelper.LetterA({ x: 678, y: 69 });

// skills

drawHelper.LetterS({ x: 108, y: 294 });
drawHelper.LetterK({ x: 264, y: 294 });
drawHelper.LetterI({ x: 420, y: 295 });
