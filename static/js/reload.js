document.addEventListener("DOMContentLoaded", function() {
	const departureList = document.getElementById('departurelist');
	const syncFailedMarker = document.getElementById('syncfailedmarker');

	const showDepartures = (departureText) => {
		departureList.innerHTML = departureText;
	};

	const updateOfflineDepartures = () => {
		const listEntries = departureList.children;
		const now = Math.floor(Date.now() / 1000);

		for (const listEntry of listEntries) {
			const departureTimestamp = listEntry.dataset.timestamp;
			if (departureTimestamp < now) {
				departureList.removeChild(listEntry);
			} else {
				countdownNodes = listEntry.querySelectorAll(".time");
				for (i = 0; i < countdownNodes.length; i++) {
					for (const countdown of countdownNodes[i].childNodes) {
						if ((countdown.nodeType == document.TEXT_NODE) && (countdown.textContent.includes("min"))) {
							if (departureTimestamp - 60 < now) {
								countdown.textContent = "sofort";
							} else {
								countdown.textContent = Math.floor((departureTimestamp - now) / 60) + " min";
							}
						}
					}
				}
			}
		}
	};

	const fetchDepartures = () => {
		var fetchUrl = window.location.href;
		if (fetchUrl.includes("?")) {
			fetchUrl += "&ajax=1";
		} else {
			fetchUrl += "?ajax=1";
		}
		fetch(fetchUrl)
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
				updateOfflineDepartures();
			});
	};

	setInterval(fetchDepartures, 60000);
});
