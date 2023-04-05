// This example uses the autocomplete feature of the Google Places API.
// It allows the user to find all hotels in a given place, within a given
// country. It then displays markers for all the hotels returned,
// with on-click details for each hotel.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let places;

function initMap() {

    const map = new google.maps.Map(document.getElementById("map"), {

        zoom: 12,
        center: { lat: 40.751, lng: -73.985 },
        disableDefaultUI: true,
    });

    places = new google.maps.places.PlacesService(map);

        const search = {
          types: ["lodging"],
          location: { lat: 40.751, lng: -73.985 },
          radius: 100,
        };
      
        places.nearbySearch(search, (results, status, pagination) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icons
      
              console.log(results);
      
              for (let i = 0; i < results.length; i++) {
                  createMarker(results[i]);
              }
          }
        });
      

      function createMarker(place) {
        if (!place.geometry || !place.geometry.location) return;
      
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
        });
      }
}


// When the user selects a city, get the place details for the city and
// zoom the map in on the city.

// Search for hotels in the selected city, within the viewport of the map.

window.initMap = initMap;