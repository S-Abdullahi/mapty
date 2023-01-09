'use strict';

//elements
const form = document.querySelector('.form')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('#distance')
const inputDuration = document.querySelector('#duration')
const inputElevation = document.querySelector('#elevation')
const inputCadence = document.querySelector('#cadence')

class Workout{
    date = new Date()
    id = (Date.now() + '').slice(-10)
    constructor(cords, duration, distance){
       this.cords = cords
       this.duration = duration
       this.distance = distance
    }
}

class Cycling extends Workout{
    constructor(cords, duration, distance,elevation){
        super(cords, duration, distance)
        this.elevation = elevation
        this.calcSpeed
    }

    calcSpeed(){
        this.speed = this.distance / (this.duration/60)
        return this.speed
    }
}

class Running extends Workout{
    constructor(cords, duration, distance, cadence){
        super(cords, duration, distance)
        this.cadence = cadence
        this.calcPace
    }

    calcPace(){
        this.pace = this.duration / this.distance
        return this.pace
    }
}


class App {
    #map
    #mapEvent
    constructor(){
        this._getPosition()
        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition(){
        if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), ()=>{
            alert('you can not access the geolocation')
        })
    }

    _loadMap(position){
        const {latitude,longitude} = position.coords
        const locationCord = [latitude,longitude]
        this.#map = L.map('map').setView(locationCord, 13)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(this.#map);

        this.#map.on('click',this._showForm.bind(this))
    }

    _showForm(mapE){
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _toggleElevationField(){
        inputElevation.closest('.form__item').classList.toggle('form__item--hidden')
        inputCadence.closest('.form__item').classList.toggle('form__item--hidden')
    }

    _newWorkout(e){
        e.preventDefault()
        inputDistance.value = inputDuration.value = inputElevation.value = 0
        const {lat,lng} = this.#mapEvent.latlng
        L.marker([lat,lng]).addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'card__border-running'
            })
        )
        .setPopupContent('workout')
        .openPopup();
    }
}

const app = new App()