const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//----- -- -- -- -- - - - - - -- - - - 

let markers;
let places;
let eventBlocks; // array for the newly created location drag and drop blocks.
let map;

function initMap() {

    const map = new google.maps.Map($("#map") , {

        zoom: 15,
        center: {lat: 40.751, lng: -73.985},
        disableDefaultUI: true,
        mapId: "ff7d481aed307195",
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

function createEventbox(url, title, address, estTime, category, rating) {

    let eventboxContainer = $(".add_container");
    let minimumTime = estTime - 5;
    let maxTime = estTime + 5;
    let time = minimumTime + "—" + maxTime + " min";

    let eventbox = 
        "<div class='individual_eventbox'>" + 
            "<div class='image_container'>" +
                `<img src='${url}' class='event_image'>` +
            "</div>" + 

            "<div class='information_container'>" +
                `<h2 class='event_title'>${title}</h2>` +
                `<p class='event_subtext'>${address}</p>` +
                `<p class='event_subtext'>${time}</p>` +
                `<h4 class='event_category'>${category}</h4>` +
                `<div class='rating_container'><p class='rating'>${rating}</p></div>` +
            "</div>" +
        "</div>"
    ;

    eventboxContainer.insertAdjacentHTML("beforebegin", eventbox);
}

$(".add_more i").addEventListener('click', function () {

    createEventbox("https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/d0/f4/07/escape-the-room-offers.jpg?w=1200&h=-1&s=1", "Escape Room", "123St Brooklyn", 55, "Fun", "2.2");
})

window.initMap = initMap;