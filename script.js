'use strict';

//elements
const form = document.querySelector('.form')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('#distance')
const inputDuration = document.querySelector('#duration')
const inputElevation = document.querySelector('#elevation')
const inputCadence = document.querySelector('#cadence')

let map, mapEvent

// class App {
//     #map
//     #mapEvent
//     constructor(){
//         this._getPosition()
//         this._showForm()
//     }

//     _getPosition(){
//         if(navigator.geolocation)
//         navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), ()=>{
//             alert('you can not access the geolocation')
//         })
//     }

//     _loadMap(position){
//         const {latitude,longitude} = position.coords
//         const locationCord = [latitude,longitude]
//         this.#map = L.map('map').setView(locationCord, 13)

//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//          }).addTo(this.#map);
//     }

//     _showForm(){
//         // this.#map.on('click',(mapE)=>{
//         //     this.#mapEvent = mapE
//         //     console.log(this.#mapEvent)
//         // })
//     }

//     _toggleElevationField(){}

//     _newWorkout(){}
// }

// const app = new App()

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){    
        const {latitude, longitude} = position.coords
        const locationCord = [latitude, longitude]
        map = L.map('map').setView(locationCord, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // L.marker(locationCord).addTo(map)
        // .bindPopup('Activity')
        // .openPopup();

        map.on('click', function(mapE){
            mapEvent = mapE
            form.classList.remove('hidden')
            inputDistance.focus()
        })
        },
        function(){
        alert('you can not access geolocation')
    })
}

form.addEventListener('submit',function(e){
    e.preventDefault()
    inputDistance.value = inputDuration.value = inputElevation.value = 0
    const {lat,lng} = mapEvent.latlng
    L.marker([lat,lng]).addTo(map)
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
})

inputType.addEventListener('change',()=>{
    inputElevation.closest('.form__item').classList.toggle('form__item--hidden')
    inputCadence.closest('.form__item').classList.toggle('form__item--hidden')
    
})