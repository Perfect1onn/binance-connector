export const getNextHour = () => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const currentDay = new Date().getDate();
	const currentHour = new Date().getHours()
  
	
	return (new Date(currentYear, currentMonth, currentDay, currentHour + 1)).getTime()
  }
  