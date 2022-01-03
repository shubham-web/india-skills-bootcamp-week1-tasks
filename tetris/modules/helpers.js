export const qs = (selector, parent) => (parent || document).querySelector(selector);
export const qsa = (selector, parent) => (parent || document).querySelectorAll(selector);
export const getRandom = (min, max) => {
	return min + Math.random() * (max - min);
};

export const copyObject = (object = {}) => {
	return JSON.parse(JSON.stringify(object));
};
