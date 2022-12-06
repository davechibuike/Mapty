"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

class App {
  constructor() {}

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap, () =>
        alert("Could not get your position")
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    console.log(`https://www.google.com/maps/@${latitude},${longitude},13z`);

    const coords = [latitude, longitude];
    map = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Handling clicks on map
    map.on("click", function (mapE) {
      mapEvent = mapE;
      form.classList.remove("hidden");
      inputDistance.focus();
    });
  }

  _showForm() {}

  _toggleElevationField() {}

  _newWorkout() {}
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  inputCadence.value =
    inputDuration.value =
    inputDistance.value =
    inputElevation.value =
      "";

  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

inputType.addEventListener("change", function () {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
