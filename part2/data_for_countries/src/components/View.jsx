import React, { useState, useEffect } from 'react';
import axios from 'axios'

const Languages = ({languages}) => {
    return <div>
        <h2>Languages</h2>
        <ul>{Object.entries(languages).map(([code, language]) => (
              <li key={code}>{language}</li>
            ))}</ul>
        </div>
}

const Weather = ({country}) => {
    const [weather, setWeather] = useState(null);
    const api_key = import.meta.env.VITE_WEATHER_API_KEY;

    useEffect(() => {
        if (country.capital) {
            const capital = country.capital[0];
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`;

            axios.get(url)
                .then(response => {
                    setWeather(response.data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                });
        }
    }, [country, api_key]);

    return <div>
            <h2>Weather in {country.capital[0]}</h2>
                <div>
                    Temperature: {weather.main.temp} °C
                </div>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
            <div>Wind {weather.wind.speed} m/s</div>
        </div>
}

const View = ({country}) => {
    return <div>
        <h1>{country.name.common}</h1>
            Capital(s): <div>{country.capital.map((capital) => <div>{capital}</div>)}</div>
            Area: <div>{country.area}</div>
            <Languages languages={country.languages}/>
            <img src={country.flags.svg} alt={country.flags.alt} width="500"/>
            <Weather country={country} />
    </div>
}

export default View