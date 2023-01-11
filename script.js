'use strict';

class Workout{
    date = new Date()
    id = (Date.now() + '').slice(-10)
    constructor(cords, duration, distance){
       this.cords = cords
       this.duration = duration
       this.distance = distance
    }

    _setDescription(){
        const months = ['january', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
}

class Cycling extends Workout{
    type = 'cycling'
    constructor(cords, duration, distance,elevation){
        super(cords, duration, distance)
        this.elevation = elevation
        this.calcSpeed()
        this._setDescription()
    }

    calcSpeed(){
        this.speed = this.distance / (this.duration/60)
        return this.speed.toFixed(1)
    }
}

class Running extends Workout{
    type = 'running'
    constructor(cords, duration, distance, cadence){
        super(cords, duration, distance)
        this.cadence = cadence
        this.calcPace()
        this._setDescription()
    }

    calcPace(){
        this.pace = this.duration / this.distance
        return this.pace.toFixed(1)
    }
}

//elements
const workoutCon = document.querySelector('.form__con')
const form = document.querySelector('.form')
const inputType = document.querySelector('.form__input--type')
const inputDistance = document.querySelector('#distance')
const inputDuration = document.querySelector('#duration')
const inputElevation = document.querySelector('#elevation')
const inputCadence = document.querySelector('#cadence')


class App {
    #map
    #mapZoomLevel = 13
    #mapEvent
    #workout = []

    constructor(){
        //get user position
        this._getPosition()

        //get localstorage
        this._getLocalStorage()

        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleElevationField)
        workoutCon.addEventListener('click', this._moveToPopup.bind(this))
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
        this.#map = L.map('map').setView(locationCord, this.#mapZoomLevel)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         }).addTo(this.#map);

        this.#map.on('click',this._showForm.bind(this))

        this.#workout.forEach((work)=>{
            this._renderWorkoutMarkup(work)
        })
    }

    _showForm(mapE){
        this.#mapEvent = mapE
        form.classList.remove('hidden')
        inputDistance.focus()
    }

    _hideForm(){
        inputDistance.value = inputDuration.value = inputElevation.value = ''
        form.classList.add('hidden')
    }

    _toggleElevationField(){
        inputElevation.closest('.form__item').classList.toggle('form__item--hidden')
        inputCadence.closest('.form__item').classList.toggle('form__item--hidden')
    }

    _newWorkout(e){
        e.preventDefault()
        const {lat,lng} = this.#mapEvent.latlng
        const duration = +inputDuration.value
        const distance = +inputDistance.value
        const type = inputType.value

        const validInput = (...inputs)=> inputs.every(input => Number.isFinite(input))
        const positiveInput = (...inputs)=> inputs.every(input => input > 0)
        let workout

        if(type === 'cycling'){
            const elevation = Number(inputElevation.value)
            if(!validInput(elevation, duration, distance) || !positiveInput(duration, distance)){
               return alert('please enter a positive number')
            }

            workout = new Cycling([lat,lng],duration, distance, elevation)
            this.#workout.push(workout)
            
        }

        if(type === 'running'){
            const cadence = Number(inputCadence.value)
            if(!validInput(cadence, duration, distance) || !positiveInput(cadence, duration, distance)){
                return alert('please enter a positive number')
            }

            workout = new Running([lat,lng],duration,distance,cadence)
            this.#workout.push(workout)
        }
        //render workout markup
        this._renderWorkoutMarkup(workout)

        //render workout on sidebar
        this._renderWorkout(workout)

        //hide form
        this._hideForm()
        
        //set workout to local storage
        this._setLocalStorage()
    }

    _renderWorkoutMarkup(workout){
        L.marker(workout.cords).addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth: 300,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`
            })
        )
        .setPopupContent(`${workout.type=== 'running' ? '🏃' : '🚴' } ${workout.description}`)
        .openPopup();
    }

    _renderWorkout(workout){
        let html = `
            <li class="cycling panel metric__card card__border-${workout.type}" data-id="${workout.id}">
            <h2>${workout.description}</h2>
            <div class="metric">
                <div class="metric__detail">
                    <span class="activity_icon">${workout.type === 'running' ? "🏃‍♂️" : '🚴‍♂️'}</span>
                    <span class="value">${workout.distance}</span>
                    <span class="unit">KM</span>
                </div>
                <div class="metric__detail">
                    <span class="activity_icon">⏲️</span>
                    <span class="value">${workout.duration}</span>
                    <span class="unit">MIN</span>
                </div>
        `

        if (workout.type === 'running'){
            html += `
                        <div class="metric__detail">
                        <span class="icon">⚡</span>
                        <span class="value">${workout.pace}</span>
                        <span class="unit">MIN/KM</span>
                    </div>
                    <div class="metric__detail">
                        <span class="icon">🛤️</span>
                        <span class="value">${workout.cadence}</span>
                        <span class="unit">SPM</span>
                    </div>
                </div>
            </li>
            `
        }

        if(workout.type === 'cycling'){
            html += `
                        <div class="metric__detail">
                        <span class="activity_icon">⚡</span>
                        <span class="value">${workout.speed}</span>
                        <span class="unit">KM/H</span>
                    </div>
                    <div class="metric__detail">
                        <span class="activity_icon">🏔️</span>
                        <span class="value">${workout.elevation}</span>
                        <span class="unit">M</span>
                    </div>
                </div>
            </li>
            
            `
        }
        form.insertAdjacentHTML('afterend', html)
    }

    _moveToPopup(e){
        const workoutEl = e.target.closest('.metric__card')
        if(!workoutEl) return

        const workoutCard = this.#workout.find(work => work.id === workoutEl.dataset.id)

        this.#map.setView(workoutCard.cords, this.#mapZoomLevel,{
            animate: true,
            pan: {
                duration:1
            }
        })
    }

    _setLocalStorage(){
        localStorage.setItem('workout', JSON.stringify(this.#workout))
    }

    _getLocalStorage(){
        const data = JSON.parse(localStorage.getItem('workout'))

        if(!data) return
        this.#workout = data
        this.#workout.forEach((work)=>{
            this._renderWorkout(work)
        })
    }

    reset(){
        localStorage.removeItem('workout')
        location.reload()
    }
}

const app = new App()