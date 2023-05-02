const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let markers = [];
let markerDoc = [];

let places;
let eventBlocks;
let map;

function initMap() {

    const map = new google.maps.Map($("#map") , {

        zoom: 15,
        center: {lat: 40.751, lng: -73.985},
        disableDefaultUI: true,
        mapId: "ff7d481aed307195",
    });

    places = new google.maps.places.PlacesService(map);

    function addMarker(locations, t) {

        if (!locations.geometry || !locations.geometry.location) return;

        const marker = new google.maps.Marker({
            map, 
            position: locations.geometry.location,
            info: t,
        });

        marker.addListener("click", () => {

            console.log(marker.info.title)

            const contentString =
                `<button class='add_more' onclick='createEventbox("${marker.info.url}", "${marker.info.title}", "${marker.info.address}", "${marker.info.category}", ${marker.info.rating})'><i class='fa fa-plus'></i></button>`
            ;                                       

            const infowindow = new google.maps.InfoWindow({ 
                content: contentString,
            });

            infowindow.open({
                anchor: marker,
                map,
            });

            console.log(marker.info);
        });
    }

    function searchNearby(keywords, address) {

        const search = {
            types: ["point_of_interest"],
            location: { lat: 40.751, lng: -73.985 },
            radius: 4000,
        };

        places.nearbySearch(search, (results, status, pagination) => {

        let markersArray = [];

            if (status === google.maps.places.PlacesServiceStatus.OK && results) {

                for (let i = 0; i < results.length; i++) {

                    if (results[i].business_status == "CLOSED_TEMPORARILY" || !results[i].hasOwnProperty('photos')) {

                        continue;
                    }
                    
                    else if (results[i].business_status == "OPERATIONAL") {

                        console.log(results[i]);

                        markersArray[i] = {
                            url: results[i].photos[0].getUrl(),
                            title: results[i].name,
                            address: results[i].vicinity,
                            category: "Misc",
                            rating: results[i].rating,
                        }

                        addMarker(results[i], markersArray[i]);
                    }
                }

                const r = markersArray.filter(hasOwnProperty => true);
                markers = markers.concat(r);

                console.log(markers)
            }
        });
    }

    searchNearby();
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

window.initMap = initMap;