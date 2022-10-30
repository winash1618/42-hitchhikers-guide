
var map = new google.maps.Map(document.getElementById('map-canvas'), {
	mapTypeId: google.maps.MapTypeId.ROADMAP
});
function initialize() {

    var markers = [];
    

    var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(24.519937, 54.3679991),
    new google.maps.LatLng(24.461, 54.40));
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
			// position = geoFindMe();
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

	// console.log("hi");
}

initialize();
// function geoFindMe() {
	
// 	const status = document.querySelector('#status');
// 	// const mapLink = document.querySelector('#map-link');
	
// 	// mapLink.href = '';
// 	// mapLink.textContent = '';
	
// 	function success(position)
// 	{
// 		const latitude  = position.coords.latitude;
// 		const longitude = position.coords.longitude;
// 		status.textContent = '';
// 		return position;
// 		//   mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
// 		//   mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
		
// 	}
	
// 	function error()
// 	{
		
// 		// initialize();
// 		// initMap(24.4934196,54.3685304);
// 		// console.log("hi");
// 		status.textContent = 'Unable to retrieve your location';
// 	}
	
// 	if (!navigator.geolocation)
// 	{
// 		status.textContent = 'Geolocation is not supported by your browser';
// 	}
// 	else
// 	{
// 		status.textContent = 'Locating…';
// 		navigator.geolocation.getCurrentPosition(success, error);
// 	}
	
// }
// function initMap() {
// 	const myLatLng = { lat: -25.363, lng: 131.044 };
// 	const map = new google.maps.Map(document.getElementById("map-canvas"), {
// 	  zoom: 4,
// 	  center: myLatLng,
// 	});
  
// 	new google.maps.Marker({
// 	  position: myLatLng,
// 	  map,
// 	  title: "Hello World!",
// 	});
//   }
  
//   window.initMap = initMap;
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


var locations = {};//A repository for markers (and the data from which they were contructed).

//initial dataset for markers
var locs = {
	1: { info:'11111. Some random info here', lat:-37.8139, lng:144.9634 },
	2: { info:'22222. Some random info here', lat:46.0553, lng:14.5144 },
	3: { info:'33333. Some random info here', lat:-33.7333, lng:151.0833 },
	4: { info:'44444. Some random info here', lat:27.9798, lng:-81.731 }
};
// var map = new google.maps.Map(document.getElementById('map_2385853'), {
// 	zoom: 1,
// 	maxZoom: 8,
// 	minZoom: 1,
// 	streetViewControl: false,
// 	center: new google.maps.LatLng(40, 0),
// 	mapTypeId: google.maps.MapTypeId.ROADMAP
// });
var infowindow = new google.maps.InfoWindow();

var auto_remove = true;//When true, markers for all unreported locs will be removed.

function setMarkers(locObj) {
	if(auto_remove) {
		//Remove markers for all unreported locs, and the corrsponding locations entry.
		$.each(locations, function(key) {
			if(!locObj[key]) {
				if(locations[key].marker) {
					locations[key].marker.setMap(null);
				}
				delete locations[key];
			}
		});
	}

	$.each(locObj, function(key, loc) {
		if(!locations[key] && loc.lat!==undefined && loc.lng!==undefined) {
			//Marker has not yet been made (and there's enough data to create one).

			//Create marker
			loc.marker = new google.maps.Marker({
				position: new google.maps.LatLng(loc.lat, loc.lng),
				map: map
			});

			//Attach click listener to marker
			google.maps.event.addListener(loc.marker, 'click', (function(key) {
				return function() {
					if(locations[key]) {
						infowindow.setContent(locations[key].info);
						infowindow.open(map, locations[key].marker);
					}
				}
			})(key));

			//Remember loc in the `locations` so its info can be displayed and so its marker can be deleted.
			locations[key] = loc;
		}
		else if(locations[key] && loc.remove) {
			//Remove marker from map
			if(locations[key].marker) {
				locations[key].marker.setMap(null);
			}
			//Remove element from `locations`
			delete locations[key];
		}
		else if(locations[key]) {
			//Update the previous data object with the latest data.
			$.extend(locations[key], loc);
			if(loc.lat!==undefined && loc.lng!==undefined) {
				//Update marker position (maybe not necessary but doesn't hurt).
				locations[key].marker.setPosition(
					new google.maps.LatLng(loc.lat, loc.lng)
				);
			}
			//locations[key].info looks after itself.
		}
	});
}

var ajaxObj = {//Object to save cluttering the namespace.
	options: {
		url: "........",//The resource that delivers loc data.
		dataType: "json"//The type of data tp be returned by the server.
	},
	delay: 10000,//(milliseconds) the interval between successive gets.
	errorCount: 0,//running total of ajax errors.
	errorThreshold: 5,//the number of ajax errors beyond which the get cycle should cease.
	ticker: null,//setTimeout reference - allows the get cycle to be cancelled with clearTimeout(ajaxObj.ticker);
	get: function() { //a function which initiates 
		if(ajaxObj.errorCount < ajaxObj.errorThreshold) {
			ajaxObj.ticker = setTimeout(getMarkerData, ajaxObj.delay);
		}
	},
	fail: function(jqXHR, textStatus, errorThrown) {
		console.log(errorThrown);
		ajaxObj.errorCount++;
	}
};

//Ajax master routine
function getMarkerData() {
	$.ajax(ajaxObj.options)
		.done(setMarkers) //fires when ajax returns successfully
		.fail(ajaxObj.fail) //fires when an ajax error occurs
		.always(ajaxObj.get); //fires after ajax success or ajax error
}

setMarkers(locs);//Create markers from the initial dataset served with the document.
//ajaxObj.get();//Start the get cycle.

// *******************
//test: simulated ajax
var testLocs = {
	1: { info:'1. New Random info and new position', lat:24.4888, lng:54.3618901 },//update info and position
	2: { lat:24.4959241, lng:54.3832259 },//update position
	3: { info:'3. New Random info', lat:24.4710285, lng:54.3768338 },//update info
	5: { info:'55555. Added', lat:24.51946899999999, lng:54.371633 }//add new marker
};
setTimeout(function() {
	setMarkers(testLocs);
}, ajaxObj.delay, 30);
// *******************
