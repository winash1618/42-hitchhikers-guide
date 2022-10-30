function initialize() {

    var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));
    map.fitBounds(defaultBounds);

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */
    (
    document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */ (input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {

        var places = searchBox.getPlaces();
		var latInput;
		var lngInput;
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        markers = [];
        var bounds = new google.maps.LatLngBounds();

        for (var i = 0, place; place = places[i]; i++) {
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                draggable:true,
                title: place.name,
                position: place.geometry.location
            });
            
            var latInput = document.getElementsByName('latitude')[0];
            var lngInput = document.getElementsByName('longitude')[0];
            latInput.value = place.geometry.location.lat()
            lngInput.value = place.geometry.location.lng();
            google.maps.event.addListener(marker, 'dragend', function (e) {
                latInput.value = e.latLng.lat();
                lngInput.value = e.latLng.lng();
            });
			
			console.log(latInput.value);
			console.log(lngInput.value);
			position = geoFindMe();
			directionsService = new google.maps.DirectionsService,
			directionsDisplay = new google.maps.DirectionsRenderer({
				map: map
			});
			pointA = new google.maps.LatLng(latInput.value, lngInput.value),
        	pointB = new google.maps.LatLng(24.519937,54.3679992);
			calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
			markers.push(marker);

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });
	position = geoFindMe();

	// console.log("hi");
}

initialize();
function geoFindMe() {
	
	const status = document.querySelector('#status');
	// const mapLink = document.querySelector('#map-link');
	
	// mapLink.href = '';
	// mapLink.textContent = '';
	
	function success(position)
	{
		const latitude  = position.coords.latitude;
		const longitude = position.coords.longitude;
		status.textContent = '';
		return position;
		//   mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
		//   mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		
	}
	
	function error()
	{
		
		// initialize();
		// initMap(24.4934196,54.3685304);
		// console.log("hi");
		status.textContent = 'Unable to retrieve your location';
	}
	
	if (!navigator.geolocation)
	{
		status.textContent = 'Geolocation is not supported by your browser';
	}
	else
	{
		status.textContent = 'Locating…';
		navigator.geolocation.getCurrentPosition(success, error);
	}
	
}

// function initMap(latitude, longitude) {
//     var pointA = new google.maps.LatLng(latitude, longitude),
//         pointB = new google.maps.LatLng(24.519937,54.3679992),
//         myOptions = {
//             zoom: 7,
//             center: pointA,
// 			mapTypeId: google.maps.MapTypeId.ROADMAP
//         },
//         map = new google.maps.Map(document.getElementById('map'), myOptions),
//         // Instantiate a directions service.
//         directionsService = new google.maps.DirectionsService,
//         directionsDisplay = new google.maps.DirectionsRenderer({
//             map: map
//         }),
//         markerA = new google.maps.Marker({
//             position: pointA,
//             title: "point A",
//             label: "A",
//             map: map
//         }),
//         markerB = new google.maps.Marker({
//             position: pointB,
//             title: "point B",
//             label: "B",
//             map: map
//         });

//     calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

// }



function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
        origin: pointA,
        destination: pointB,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

	document.querySelector('#find-me').addEventListener('click', geoFindMe);