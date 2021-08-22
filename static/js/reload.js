document.addEventListener("DOMContentLoaded", function() {
	const departureList = document.getElementById('departurelist');
	const syncFailedMarker = document.getElementById('syncfailedmarker');

	const showDepartures = (departureText) => {
		departureList.innerHTML = departureText;
	};

	const fetchDepartures = () => {
		fetch(window.location.href + '?ajax=1')
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.text()
			})
			.then(departureText => {
				syncFailedMarker.style.display = "none";
				showDepartures(departureText);
			})
			.catch(err => {
				syncFailedMarker.style.display = "inline-block";
			});
	};

	setInterval(fetchDepartures, 60000);
});
