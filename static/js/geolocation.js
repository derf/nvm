document.addEventListener("DOMContentLoaded", function() {
	const geoLocationButton = document.getElementById('geolocationsearch');

	const mkTextNode = function(className, textContent) {
		const node = document.createElement("span");
		node.className = className;
		node.textContent = textContent;
		return node
	}

	const processResult = function(results) {
		const list = document.createElement("ul");
		list.className = "stops";

		if (results.error) {
			showError("Backend-Fehler:", results.msg);
			return;
		}

		for (var result in results) {
			result = results[result];
			const listentry = document.createElement("li");
			const link = document.createElement("a");
			const note = document.createElement("span");
			const lines = document.createElement("span");

			link.className = "name";
			link.textContent = result.name;
			link.href = "/board/" + result.id;

			note.className = "distance";
			if (result.distance >= 1000) {
				note.textContent = (result.distance / 1000).toFixed(1) + " km"
			} else {
				note.textContent = result.distance + " m"
			}

			lines.className = "lines";

			if (result.products.nationalExpress) {
				lines.appendChild(mkTextNode("longdistance", "ICE"));
			}
			if (result.products.national) {
				lines.appendChild(mkTextNode("longdistance", "IC"));
			}
			if (result.products.regionalExp) {
				lines.appendChild(mkTextNode("longdistance", "RE"));
			}
			if (result.products.regional) {
				lines.appendChild(mkTextNode("longdistance", "R"));
			}
			if (result.products.suburban) {
				lines.appendChild(mkTextNode("suburban", "S"));
			}
			if (result.products.tram) {
				lines.appendChild(mkTextNode("tram", "T"));
			}
			if (result.products.bus) {
				lines.appendChild(mkTextNode("bus", "Bus"));
			}
			if (result.products.ferry) {
				lines.appendChild(mkTextNode("bus", "Fähre"));
			}
			if (result.products.taxi) {
				lines.appendChild(mkTextNode("taxi", "AST"));
			}

			listentry.appendChild(link);
			listentry.appendChild(note);
			listentry.appendChild(lines);
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

	const showError = function(header, text, code) {
		const errnode = document.createElement("div");
		const errhead = document.createElement("strong");
		const errtext = document.createTextNode(text);
		const errcode = document.createElement("div");

		errnode.className = "error";
		errcode.className = "errcode";

		errhead.textContent = header;
		errcode.textContent = code;

		errnode.appendChild(errhead);
		errnode.appendChild(errtext);
		errnode.appendChild(errcode);

		geoLocationButton.replaceWith(errnode);
	}

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
