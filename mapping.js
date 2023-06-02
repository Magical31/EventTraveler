const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let markers = [];
let searchResult;

function hi() {

    return "hello"
}

async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const {Autocomplete} = await google.maps.importLibrary("places")
    const {PlacesService} = await google.maps.importLibrary("places")
    const {InfoWindow} = await google.maps.importLibrary("maps")

    const map = new Map($("#map") , {

        zoom: 15, // MAKE MAP HAVE A CERTAIN MAX
        center: {lat: 40.751, lng: -73.985},
        disableDefaultUI: true,
        mapId: "ff7d481aed307195",
    });

    function addMarker(locations, t) {

        if (!locations.geometry || !locations.geometry.location) return;

        const markerRating = document.createElement("div"); // MARKER SHOWS RATING
        markerRating.className = "marker_rating";
        markerRating.textContent = t.rating;

        const locName = document.createElement("p");
        locName.className = "loc_name";
        locName.textContent = t.title;

        markerRating.append(locName)

        const marker =  new AdvancedMarkerElement({
            map,
            position: locations.geometry.location,
            content: markerRating,
        });

        
        marker.addListener("click", () => { // The Info Window -- CSS REQUIRED

            const btnCnt = document.createElement("button"); // MARKER SHOWS RATING
            btnCnt.className = "add_more";

            const btn = document.createElement("i");
            btn.className = "fa fa-plus";

            btnCnt.addEventListener("click", function() {

                createEventbox(t.url, t.title, t.address, t.category, t.rating);
            });

            btnCnt.append(btn);

            const infowindow = new InfoWindow({ 
                content: btnCnt,
            });

            infowindow.open({
                anchor: marker,
                map,
            });
        });
    }

    const input = $(".search_bar");

    const autocomplete = new Autocomplete(input, {
        fields: ["geometry", "formatted_address", "name", "type"],
    });

    const sw = {lat: 40.621009, lng: -74.055318}
    const ne = {lat: 40.841163, lng: -73.722197}

    const corner = new google.maps.LatLngBounds(sw, ne)
    autocomplete.setBounds(corner)

    autocomplete.addListener("place_changed", () => {

        let v = input.value;
        let kw = v.substring(0, v.indexOf(","));

        const place = autocomplete.getPlace();
        let t = place.types[0];

        if (!place.geometry || !place.geometry.location) {
        return;
        }
    
        if (place.geometry.viewport) {

            map.fitBounds(place.geometry.viewport);
            searchNearby(place, kw, t);
            map.setZoom(15);
        }
    });

    function searchNearby(l, kw, t) {

        let search;

        if (/\d/.test(kw) == true) {

            search = {
                type: t,
                location: l.geometry.location,
                radius: 5000,
            };
        } else {

            search = {
                keyword: kw,
                location: l.geometry.location,
                radius: 5000,
            };
        }

        let places = new PlacesService(map);

        places.nearbySearch(search, (results, status, pagination) => {

            let markersArray = []
            
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {

                    for (let i = 0; i < results.length; i++) {

                        if (results[i].business_status == "CLOSED_TEMPORARILY" || !results[i].hasOwnProperty('photos')) {

                            continue;
                        }

                        else if (results[i].business_status == "OPERATIONAL") {

                            markersArray[i] = {
                                url: results[i].photos[0].getUrl(),
                                title: results[i].name,
                                address: results[i].vicinity,
                                category: "Misc",
                                rating: results[i].rating,
                            }
    
                            addMarker(results[i], markersArray[i], i);
                        }
                    }

                    searchResult = JSON.stringify(results, null, 4);

                    console.log(results)

                    if (results.length < 5) {
                        
                        searchNearby(l, "0", "point_of_interest")
                    }
                }
        });
    }
}

function createEventbox(url, title, address, category, rating) {

    let eventboxContainer = $(".add_container");

    let eventbox = 
        "<div class='individual_eventbox'>" + 
            "<div class='info_eventbox'>" +
                "<div class='image_eventbox'>" +
                    `<img src='${url}'>` +
                "</div>" +  

                `<div class='title_eventbox'><p>${title}</p></div>` +
                `<div class='address_eventbox'><p>${address}</p></div>` +
                `<div class='category_eventbox'><p>${category}</p></div>` +
                `<div class='rating_eventbox'><p>${rating}</p></div>` +
            "</div>" +
        "</div>"
    ;

    eventboxContainer.insertAdjacentHTML("beforebegin", eventbox);
}

initMap();
