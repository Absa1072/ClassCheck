/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// need to include an API key to integrate into code, just wanted to include this from Google as reference
// API Key: AIzaSyCZz6vK3hk_UluFowXy0lPscMP3yUnWAyU
// need to implement in the front end
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: lat: { 40.5038, lng: -74.4628 },
    zoom: 10,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.getElementById("button");

  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton
  );
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent(`Location found: (${pos.lat}, ${pos.lng})`);
          infoWindow.open(map);
          map.setCenter(pos);

        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        callback(pos);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Unable to retrieve location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}


window.initMap = initMap;
