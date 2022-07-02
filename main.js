

const storage = {
    city : '',
    country: '',
    saveItem(){
localStorage.setItem('BD_CITY', this.city)
localStorage.setItem('BD_COUNTRY', this.country)

    },
    getItem(){
        const city = localStorage.getItem('BD_CITY')
        const country = localStorage.getItem('BD_COUNTRY')
        return {
            city , country
        }
    }
};
const weatherData = {
    city: '',
    country: '',
    API_KEY: '0a7a2f786dba0f58757a6c8c25019ccc',
    async getWeather() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&units=metric&appid=${this.API_KEY}`
        )
        const { name, main, weather } = await res.json()
        return {
          name,
          main,
          weather,
        }
      } catch (err) {
        UI.showMessage('Error In Fetching Data')
      }
    },
  }
const UI = {
  loadSelector() {
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector("#w-city");
    const iconElm = document.querySelector("#w-icon");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const formElm = document.querySelector("#form");
    const countryElm = document.querySelector("#country");
    const messageElm = document.querySelector("#messageWrapper");
    return {
      cityInfoElm,
      cityElm,
      countryElm,
      iconElm,
      temperatureElm,
      pressureElm,
      feelElm,
      humidityElm,
      formElm,
      messageElm,
    };
  },
  hideMessage(){
    const messageElm = document.querySelector('#message')
    setTimeout(() => {
        messageElm.remove()
    }, 2000);
  },

  showMessage(msg){
    const {messageElm} = this.loadSelector()
    const elm = `<div class='alert alert-danger' id='message'>${msg}</div>`
    messageElm.insertAdjacentHTML('afterbegin',elm);
    this.hideMessage()
  },
  validateInput(country , city){
    if (country === '' || city === '') {
        this.showMessage('please provide necessary information')
        return true
      } else {
        return false
      }
  },

  getInputValues() {
    const { countryElm, cityElm } = this.loadSelector()
    //get the result
    //if result is false (not right) you should stop here
    const isInValid = this.validateInput(countryElm.value, cityElm.value)
    if (isInValid) return
    return {
      country: countryElm.value,
      city: cityElm.value,
    }
  

   
  },
  resetInputs(){
    const {cityElm , countryElm} = this.loadSelector()
    cityElm.value = ''
    countryElm.value = ''
  },
  async handleRemoteData(){
    const data = await weatherData.getWeather()
    return data;
  },
  getIcon(iconCode){
    return `https://openweathermap.org/img/w/${iconCode}.png`
  },
  populateUI(data){
    const {
        cityInfoElm,
        temperatureElm,
        pressureElm,
        humidityElm,
        feelElm,
        iconElm, 
      } = this.loadSelector()
      const {name,
         main: {temp, pressure, humidity},
         weather,
        } = data;

      cityInfoElm.textContent = name
      temperatureElm.textContent = `Temparature: ${temp}°C`
      pressureElm.textContent = `Pressure: ${pressure}kpa`
      humidityElm.textContent = `Humidity: ${humidity}`
      feelElm.textContent = weather[0].description
      iconElm.setAttribute('src',this.getIcon(weather[0].icon))

  },
  setDataToStorage(city,country){
    storage.city =city
    storage.country =country
  },

  init() {
    const { formElm } = this.loadSelector();
    formElm.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      // get input values 
      const {country , city} = this.getInputValues();
      weatherData.city = city
      weatherData.country = country;
      
      this.setDataToStorage(city,country)
      storage.saveItem();

        this.resetInputs() 
    //   console.log(country,city);

     const data = await this.handleRemoteData()
   
     this.populateUI(data)
     
    
    })

    window.addEventListener('DOMContentLoaded', async()=>{
        let {city , country} = storage.getItem()
        if (!city || !country) {
            city = 'Rangpur'
            country = 'BD'
        }
        weatherData.city = city
        weatherData.country = country
        const data = await this.handleRemoteData()
   
     this.populateUI(data)
    })
  },
};
UI.init();


