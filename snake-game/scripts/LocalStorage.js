const _key = "WSC_SNAKE_PLAYERS";
export default class SnakeLocalStorage {
	static getPlayers = () => {
		let players = localStorage.getItem(_key);
		if (!players) {
			this.updatePlayers();
			return [];
		}
		return JSON.parse(players);
	};
	static updatePlayers = (updatedArray = []) => {
		localStorage.setItem(_key, JSON.stringify(updatedArray));
		return updatedArray;
	};
	static addPlayer(playerName) {
		let existingPlayers = this.getPlayers();
		let exists = existingPlayers.find((player) => player.name === playerName);
		if (exists) {
			return "Already exists!";
		}

		let newPlayer = {
			name: playerName,
			highscore: 0,
		};
		existingPlayers.push(newPlayer);
		this.updatePlayers(existingPlayers);
		return newPlayer;
	}
	static playerExists(playerName) {
		let players = this.getPlayers();
		let targetPlayer = players.find((entry) => entry.name.toLowerCase() === playerName.toLowerCase());
		return targetPlayer;
	}
	static updateHighScore(player, score) {
		let players = this.getPlayers();
		let targetPlayer = players.find((entry) => entry.name.toLowerCase() === player.toLowerCase());
		if (!targetPlayer) {
			return "No Such Player is there!";
		}
		if (targetPlayer.highscore < score) {
			targetPlayer.highscore = score;
		}
		console.log("targetPlayer", targetPlayer);
		console.log("players", players);
		this.updatePlayers(players);
		return targetPlayer;
	}
}
