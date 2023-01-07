'use strict';

//elements
const form = document.querySelector('.form')
const inputDistance = document.querySelector('#distance')
const inputDuration = document.querySelector('#duration')
const inputElevation = document.querySelector('#elevation')

let map, mapEvent

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