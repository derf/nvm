document.addEventListener("DOMContentLoaded", function() {
	const geoLocationButton = document.getElementById('geolocationsearch');

	const processResult = function(results) {
		const list = document.createElement("ul");
		list.className = "stops";
		for (var result in results) {
			result = results[result];
			const listentry = document.createElement("li");
			const link = document.createElement("a");
			const note = document.createElement("span");

			link.className = "name";
			link.textContent = result.name;
			link.href = "/board/" + result.id;

			note.className = "note";
			if (result.distance >= 1000) {
				note.textContent = result.distance.toFixed(1) + " km"
			} else {
				note.textContent = result.distance + " m"
			}

			listentry.appendChild(link);
			listentry.appendChild(note);
			list.appendChild(listentry);
		}
		geoLocationButton.replaceWith(list);
	};

	const processLocation = function(loc) {
		fetch('/geolocation', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				lon: loc.coords.longitude,
				lat: loc.coords.latitude
			})
		}).then(response => response.json()).then(processResult);
	};

	const processError = function(error) {
		if (error.code == error.PERMISSION_DENIED) {
			showError('Standortanfrage nicht möglich.', 'Vermutlich fehlen die Rechte im Browser oder der Android Location Service ist deaktiviert.', 'geolocation.error.PERMISSION_DENIED');
		} else if (error.code == error.POSITION_UNAVAILABLE) {
			showError('Standort konnte nicht ermittelt werden', 'Service nicht verfügbar', 'geolocation.error.POSITION_UNAVAILABLE');
		} else if (error.code == error.TIMEOUT) {
			showError('Standort konnte nicht ermittelt werden', 'Timeout', 'geolocation.error.TIMEOUT');
		} else {
			showError('Standort konnte nicht ermittelt werden', 'unbekannter Fehler', 'unknown geolocation.error code');
		}
	};

	const getGeoLocation = function() {
		geoLocationButton.textContent = "Suche Haltestellen ...";
		geoLocationButton.disabled = true;
		navigator.geolocation.getCurrentPosition(processLocation, processError);
	}

	if (geoLocationButton) {
		if (navigator.geolocation) {
			if (navigator.permissions) {
				navigator.permissions.query({ name:'geolocation' }).then(function(value) {
					if (value.state === 'prompt') {
						geoLocationButton.addEventListener('click', getGeoLocation);
					} else {
						getGeoLocation();
					}
				});
			} else {
				geoLocationButton.addEventListener('click', getGeoLocation);
			}
		} else {
			geoLocationButton.css('visibility', 'hidden');
		}
	}
});
