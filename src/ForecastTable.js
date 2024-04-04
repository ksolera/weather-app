import React from 'react';

function ForecastTable({ forecast }) {
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleString('en-US', options);
  };

  // Filter forecast to include only one entry per day
  const filteredForecast = forecast.reduce((acc, current) => {
    const date = new Date(current.dt_txt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = current;
    }
    return acc;
  }, {});

  const forecastData = Object.values(filteredForecast);

  return (
    <div className="forecast-table">
      <h2>Future Forecasts</h2>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Temperature (°F)</th>
            <th>Description</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          {forecastData.map((item, index) => (
            <tr className="table-row" key={index}>
              <td className='table-cell'>{formatDateTime(item.dt_txt)}</td>
              <td className='table-cell'>{item.main.temp.toFixed()}</td>
              <td className='table-cell'>{item.weather[0].description}</td>
              <td className='table-cell'><img src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt='' /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <br></br>
      </div>
    </div>
  );
}

export default ForecastTable;
