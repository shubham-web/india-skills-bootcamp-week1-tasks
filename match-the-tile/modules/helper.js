export const qs = (selector, parent = document) => parent.querySelector(selector);
export const qsa = (selector, parent = document) => parent.querySelectorAll(selector);

export const getRandomNumber = (min, max) => {
	return min + Math.random() * (max - min);
};

export const getRandomElement = (array) => {
	return array[parseInt(getRandomNumber(0, array.length - 1))];
};

export const maximumElement = (array) => {
	if (array.length == 0) return null;
	var modeMap = {};
	var maxEl = array[0],
		maxCount = 1;
	for (var i = 0; i < array.length; i++) {
		var el = array[i];
		if (modeMap[el] == null) modeMap[el] = 1;
		else modeMap[el]++;
		if (modeMap[el] > maxCount) {
			maxEl = el;
			maxCount = modeMap[el];
		}
	}
	return maxEl;
};
