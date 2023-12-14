import React, {useEffect, useState} from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_API_KEY_OPEN_WEATHER


const Weather = ({ capital }) => {
    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
        .then(response => {
            setWeatherData(response.data)
        })
        .catch(error => {
            console.log('error while fetching data', error)
        })
    }, [capital])

    return (
        <div>
            <h3>Weather in {capital}</h3>
            {weatherData ? (
                <div>
                    <div>Temperature: {weatherData.main.temp} Celsius</div>
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="icon" />
                    <div>Wind: {weatherData.wind.speed} m/s</div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    )
}

export default Weather