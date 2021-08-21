document.addEventListener("DOMContentLoaded", function() {
	const departureList = document.getElementById('departurelist');

	const showDepartures = (departureText) => {
		departureList.innerHTML = departureText;
	};

	const fetchDepartures = () => {
		fetch(window.location.href + '?ajax=1').then(response => response.text()).then(showDepartures);
	};

	setInterval(fetchDepartures, 60000);
});
