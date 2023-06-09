const formEntry = document.getElementById('form-entry')
const brand = document.getElementById('brand')
const model = document.getElementById('model')
const color = document.getElementById('color')
const licensePlate = document.getElementById('license-plate')
const place = document.getElementById('place')
const parking = document.getElementById('parking')

const formExit = document.getElementById('form-exit')
const licensePlateExit = document.getElementById('license-plate-exit')
const placeExit = document.getElementById('place-exit')

const select = document.getElementById('place')

const buttonRegister = document.querySelector('.button-register')
const buttonDelete = document.querySelector('.button-delete')

const buttonCloseFormEntry = document.getElementById('button-close-form-entry')
const buttonCloseFormExit = document.getElementById('button-close-form-exit')

const overlay = document.querySelector('.overlay')

const fragment = document.createDocumentFragment()

const date = document.getElementById('date')

date.innerHTML = new Date().toLocaleDateString('en-EN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

for (let floor = 1; floor <= 5; floor++) {
  for (let place = 1; place <= 10; place++) {
    const option = document.createElement('option')
    option.value = `P${floor}L${place}`
    option.textContent = `Floor ${floor} - Place ${place}`
    fragment.appendChild(option)
  }
}

select.appendChild(fragment)

showParking()

function saveVehicle (vehicle) {
  const vehicleJSON = JSON.stringify(vehicle)
  window.localStorage.setItem(vehicle.licensePlate, vehicleJSON)
}

function retrieveVehicle (licensePlate) {
  const vehicleJSON = window.localStorage.getItem(licensePlate)
  const vehicle = JSON.parse(vehicleJSON)
  return vehicle
}

function retrieveVehicleByPlace (place) {
  const keys = Object.keys(window.localStorage)

  for (const key of keys) {
    const vehicle = retrieveVehicle(key)
    if (vehicle.place === place) {
      return vehicle
    }
  }
  return null
}

function showParking () {
  parking.innerHTML = ''
  for (let floor = 1; floor <= 5; floor++) {
    const divFloor = document.createElement('div')
    divFloor.classList.add('floor')
    for (let number = 1; number <= 10; number++) {
      const divPlace = document.createElement('div')
      divPlace.classList.add('place')
      const idPlace = 'P' + floor + 'L' + number
      divPlace.id = idPlace
      const vehicle = retrieveVehicleByPlace(idPlace)
      if (vehicle) {
        divPlace.classList.add('place-vehicle')
        divPlace.style.backgroundColor = vehicle.color
        const spanLicensePlate = document.createElement('span')
        spanLicensePlate.textContent = vehicle.licensePlate
        const pBrand = document.createElement('p')
        pBrand.textContent = `brand: ${vehicle.brand}`
        const pModel = document.createElement('p')
        pModel.textContent = `model: ${vehicle.model}`

        const hr = document.createElement('hr')
        hr.style.width = '75%'
        hr.style.border = '1px solid #333'
        hr.style.align = 'center'
        hr.style.margin = '4px'

        divPlace.appendChild(spanLicensePlate)

        divPlace.appendChild(hr)
        divPlace.appendChild(pBrand)
        divPlace.appendChild(pModel)

        divPlace.onmouseover = function () {
          const ps = divPlace.querySelectorAll('p')
          for (const p of ps) {
            p.style.display = 'inline'
          }
          const hrs = divPlace.querySelectorAll('hr')
          for (const hr of hrs) {
            hr.style.display = 'inline'
          }
        }

        divPlace.onmouseout = function () {
          const ps = divPlace.querySelectorAll('p')
          for (const p of ps) {
            p.style.display = 'none'
          }
          const hrs = divPlace.querySelectorAll('hr')
          for (const hr of hrs) {
            hr.style.display = 'none'
          }
        }
      }

      divFloor.appendChild(divPlace)
    }
    parking.appendChild(divFloor)
  }
}

function assignPlace (vehicle) {
  const idPlace = vehicle.place
  const divPlace = document.getElementById(idPlace)
  if (divPlace) {
    divPlace.style.backgroundColor = vehicle.color
    const spanLicensePlate = document.createElement('span')
    spanLicensePlate.textContent = vehicle.licensePlate
    divPlace.appendChild(spanLicensePlate)
    saveVehicle(vehicle)
    console.log(
      'The place ' +
        idPlace +
        ' has been correctly assigned to the vehicle with license plate ' +
        vehicle.licensePlate
    )
  } else {
    console.error('No place was found with the identifier ' + idPlace)
  }
}

function freePlace (licensePlate) {
  const vehicle = retrieveVehicle(licensePlate)
  console.log({ vehicle })
  if (vehicle) {
    const idPlace = vehicle.place
    const divPlace = document.getElementById(idPlace)
    if (divPlace) {
      divPlace.style.backgroundColor = '#fff'
      divPlace.innerHTML = ''
      window.localStorage.removeItem(licensePlate)
      console.log(
        'The place ' +
          idPlace +
          ' occupied by the vehicle with license plate ' +
          licensePlate +
          ' has been correctly freed'
      )
    } else {
      console.error('No place was found with that identifier')
    }
  } else {
    console.error('No vehicle was found with that license plate')
  }
}

formEntry.addEventListener('submit', function (event) {
  event.preventDefault()

  const brandValue = brand.value
  const modelValue = model.value

  const colorValue = color.value
  const licensePlateValue = licensePlate.value
  const placeValue = place.value

  if (
    brandValue &&
    modelValue &&
    colorValue &&
    licensePlateValue &&
    placeValue
  ) {
    const vehicle = {
      brand: brandValue,
      model: modelValue,
      color: colorValue,
      licensePlate: licensePlateValue,
      place: placeValue
    }

    assignPlace(vehicle)

    showParking()
  }
})

formExit.addEventListener('submit', function (event) {
  event.preventDefault()

  const licensePlateExitValue = licensePlateExit.value
  const vehicle = retrieveVehicle(licensePlateExitValue)

  freePlace(licensePlateExitValue)
  placeExit.value = vehicle.place
  showParking()
})

buttonRegister.addEventListener('click', function () {
  overlay.classList.toggle('hidden')
  overlay.classList.add('flex')
  formEntry.classList.toggle('hidden')
  formEntry.classList.add('block')
})

buttonDelete.addEventListener('click', function () {
  overlay.classList.toggle('hidden')
  overlay.classList.add('flex')
  formExit.classList.toggle('hidden')
  formExit.classList.add('block')
})

buttonCloseFormEntry.addEventListener('click', function () {
  overlay.classList.add('hidden')
  overlay.classList.toggle('flex')

  formEntry.classList.add('hidden')
  formEntry.classList.toggle('block')
})

buttonCloseFormExit.addEventListener('click', function () {
  overlay.classList.add('hidden')
  overlay.classList.toggle('flex')

  formExit.classList.add('hidden')
  formExit.classList.toggle('block')
})
