ymaps.ready(function () {

    let myMap = new ymaps.Map('map-test', {
      center: [24.454661615336832,54.38475161777955],
      zoom: 13,
      controls: ['routePanelControl']
    });
  
    let control = myMap.controls.get('routePanelControl');
    let city = 'Abu-Dhabi';
  
  
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
  
    function success(pos) {
      const crd = pos.coords;
  
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
  
  
      let reverseGeocoder = ymaps.geocode([crd.latitude, crd.longitude]);
      let locationText = null;
      reverseGeocoder.then(function (res) {
        locationText = res.geoObjects.get(0).properties.get('text')
        console.log(locationText)
  
        control.routePanel.state.set({
          type: 'masstransit',
          fromEnabled: true,
          from: locationText,
          toEnabled: true,
          to: `${city}`,
        });
      });
  
      console.log(locationText)
    }
  
    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
  });