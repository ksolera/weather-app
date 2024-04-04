import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ForecastTable from './ForecastTable';

function App() {
  const [data, setData] = useState({});
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const apiKey = '9c75df0e5b64d9f9bb171c838c82f261';
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(weatherURL)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching current weather:', error);
        });

      axios.get(forecastURL)
        .then((response) => {
          setForecast(response.data.list);
        })
        .catch((error) => {
          console.error('Error fetching forecast:', error);
        });

      setLocation('');
    }
  };

  useEffect(() => {
    if (!location) return;

    axios.get(weatherURL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching current weather:', error);
      });

    axios.get(forecastURL)
      .then((response) => {
        setForecast(response.data.list);
      })
      .catch((error) => {
        console.error('Error fetching forecast:', error);
      });
  }, [location, weatherURL, forecastURL]);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentIndex < forecast.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className='weather-content'>
      <a href="/" target="_blank" className="back-button"> &larr; Back to Home</a>


      <div className="weather-display">
        <h1>Weather App</h1>
        <input
          className="search"
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
        
        <h2>{data.name} Forecast</h2>

        {
          data.weather ?
          <img className="weather-icon" src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt='' /> :
          null
        }
        
        {data.name && (
          <div className="container">
            <div className="top">
             
              <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].description}</p> : null}
              </div>
              <div className="temp-range">
                {data.main ? <p>High {data.main.temp_max.toFixed()}°F / Low {data.main.temp_min.toFixed()}°F</p> : null}
              </div>
              <div className="error">
                {data.cod === '404' ? <p>Location not found</p> : null}
              </div>
              <div className="forecast-container">
                <div className="forecast">
                <h2>3-Hour Forecast</h2>
                <ul>
                  {forecast.slice(currentIndex, currentIndex + 3).map((item, index) => (
                    <li key={index}>
                      <p>{formatDateTime(item.dt_txt)}</p>
                      <p>{item.main.temp.toFixed()}°F</p>
                      <p>{item.weather[0].description}</p>
                      <img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt='' />
                    </li>
                  ))}
                </ul>
                <div className="forecast-buttons">
                  <button onClick={handlePrevClick}>Prev</button>
                  <button onClick={handleNextClick}>Next</button>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
        <div className="forecast-table">
          <ForecastTable forecast={forecast} />
        </div>
      </div>
    </div>
  );
}

export default App;
