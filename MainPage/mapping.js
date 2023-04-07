const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//----- -- -- -- -- - - - - - -- - - - 

let markers;
let places;
let eventBlocks; // array for the newly created location drag and drop blocks.
let map;

function initMap() {

    const map = new google.maps.Map($("#map") , {

        zoom: 12,
        center: {lat: 40.751, lng: -73.985},
        disableDefaultUI: true,
    });

    places = new google.maps.places.PlacesService(map);

    function addMarker(locations) {

        if (!locations.geometry || !locations.geometry.location) return;

        const marker = new google.maps.Marker({
            map, 
            position: locations.geometry.location,
        });
    }

    const search = {
        types: ["art_gallery"],
        location: { lat: 40.751, lng: -73.985 },
        radius: 100,
    };

    places.nearbySearch(search, (results, status, pagination) => {

        if (status === google.maps.places.PlacesServiceStatus.OK && results) {

            console.log(results);

            for (let i = 0; i < results.length; i++) {

                addMarker(results[i]);
            }
        }
    });
}

window.initMap = initMap;