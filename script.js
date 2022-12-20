"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, duration, distance) {
    this.coords = coords; // [lat, lng]
    this.duration = duration; // in KM
    this.distance = distance; // in Min
  }
}

class Running extends Workout {
  constructor(coords, duration, distance, candence) {
    super(coords, duration, distance);
    this.candence = candence;

    this.calcPace();
  }

  calcPace() {
    // Min / Km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, duration, distance, elevationGain) {
    super(coords, duration, distance);
    this.elevationGain = elevationGain;

    this.calcSpeed();
  }

  calcSpeed() {
    // Km/h
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

/////////////////////////////////
// Application Architecture

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//////////////////////////////////////
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () =>
        alert("Could not get your position")
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    console.log(`https://www.google.com/maps/@${latitude},${longitude},13z`);

    const coords = [latitude, longitude];
    this.#map = L.map("map").setView(coords, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    // validation func
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    // Validation for all Positive numbers
    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;

    // If activity is running, Create running object
    if (type === "running") {
      // Check if data is valid
      const candence = +inputCadence.value;

      // Check if data is vaild
      if (
        !validInputs(distance, duration, candence) ||
        !allPositive(distance, duration, candence)
      )
        return alert("Inputs have to be positive numbers");

      const workout = new Running([lat, lng], duration, distance, candence);
      this.#workouts.push(workout);
    }

    // If activity is cycling, Create cyclying object
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        !validInputs(distance, elevation, duration) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers");
    }

    // Add the new object to the workout array
    // Render workout on map as marker
    // Render Workout on list

    // Clear input fields
    inputCadence.value =
      inputDuration.value =
      inputDistance.value =
      inputElevation.value =
        "";

    //* Display Marker

    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();
