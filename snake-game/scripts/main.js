import SnakeGame from "./SnakeGame.js";
import constants from "./constants.js";
import SnakeLocalStorage from "./LocalStorage.js";
let { Speed } = constants;

// helper functions
const qs = (selector, parent) => (parent || document).querySelector(selector);
const qsa = (selector, parent) => (parent || document).querySelectorAll(selector);

// elements
const gameWrapper = qs(".gameWrapper");
const gameBoard = qs(".gameBoard");
const startButton = qs("#startButton");
const easyMode = qs("#easy");
const intermediate = qs("#intermediate");
const hard = qs("#hard");
const nameInput = qs("#playerName");
const scoreSpan = qs("#score");
const highScore = qs("#highScore");
const leaderboard = qs(".leaderboard");

// config
const gameConfig = {
	defaultLength: 10,
	defaultSpeed: Speed.SLOW,
};

const snakeGame = new SnakeGame({
	config: gameConfig,
	elements: {
		board: gameBoard,
		scoreSpan: scoreSpan,
		highScore: highScore,
	},
	player: { name: "Unknown", highscore: 0 },
});
snakeGame.init();

let alreadyStated = false;
const fillLeaderBoard = () => {
	let players = SnakeLocalStorage.getPlayers();
	players.sort((a, b) => {
		return b.highscore - a.highscore;
	}); // sort based on highscore
	qs(".playersList", leaderboard).innerHTML = "";

	let index = 1;
	for (let player of players) {
		qs(".playersList", leaderboard).innerHTML += `
            <p>
                <span>${index}. ${player.name.charAt(0).toUpperCase() + player.name.slice(1)}</span>
                <mark>${player.highscore}</mark>
            </p>
        `;
		index++;
	}
};
startButton.addEventListener("click", (e) => {
	if (alreadyStated) {
		window.location.reload();
		return;
	}

	let playerName = nameInput.value.trim().toLowerCase();
	if (playerName === "") {
		alert("We don't allow strangers, Please type your name.");
		return;
	}

	gameWrapper.classList.remove("initialView");

	if (easyMode.checked) {
		snakeGame.config.defaultSpeed = Speed.SLOW;
	} else if (intermediate.checked) {
		snakeGame.config.defaultSpeed = Speed.MEDIUM;
	} else if (hard.checked) {
		snakeGame.config.defaultSpeed = Speed.FAST;
	}

	let playerExists = SnakeLocalStorage.playerExists(playerName);
	if (!playerExists) {
		let playerAdded = SnakeLocalStorage.addPlayer(playerName);
		console.log("playerAdded", playerAdded);
		snakeGame.player = playerAdded;
	} else {
		snakeGame.player = playerExists;
	}
	snakeGame.refreshLeaderboard = fillLeaderBoard;
	snakeGame.start();
	alreadyStated = true;
	startButton.innerText = "Restart Game";
	fillLeaderBoard();

	startButton.blur();
});
