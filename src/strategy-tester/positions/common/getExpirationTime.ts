export const getExpirationTime = () => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const currentDay = new Date().getDate();

	const expirationTime = new Date(
		currentYear,
		currentMonth,
		currentDay + 1,
		12
	).getTime();

	const normalizeNumber = (number: number) =>
		number < 10 ? "0" + number : number;

	return {
		expirationTime,
		expirationDate: `${currentYear.toString().slice(-2)}${normalizeNumber(
			currentMonth + 1
		)}${normalizeNumber(currentDay + 1)}`,
	};
};
