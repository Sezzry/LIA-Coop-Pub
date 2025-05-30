/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./styling.css";
import "./FlipClock.css";
import FlipClock from "./FlipClock.jsx"; 

const MapComponent = () => {
  const [weatherData, setWeatherData] = useState({});
  const [realTimeData, setRealTimeData] = useState([]);

  const apiKey = "Your API KEY";

  const locations = {
    solnaBusinessPark: {
      name: "Solna Business Park",
      coordinates: [59.359387, 17.979729],
      resRobotId: "740064052",
    },
    sundbyberg: {
      name: "Sundbyberg",
      coordinates: [59.361032, 17.970938],
      resRobotId: "740098248",
    },
  };

  const fetchWeatherData = useCallback(() => {
    const weatherPromises = Object.entries(locations)
      .filter(([key]) => key === "solnaBusinessPark")
      .map(([key, { coordinates }]) =>
        axios
          .get("https://api.open-meteo.com/v1/forecast", {
            params: {
              latitude: coordinates[0],
              longitude: coordinates[1],
              current_weather: true,
              daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
              timezone: "Europe/Stockholm",
            },
          })
          .then((response) => ({
            key,
            data: response.data,
          }))
      );

    Promise.all(weatherPromises)
      .then((responses) => {
        const weatherMap = responses.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});
        setWeatherData(weatherMap);
      })
      .catch((error) =>
        console.error("Error fetching weather data:", error)
      );
  }, []);

  const fetchRealTimeData = useCallback(() => {
    const realTimePromises = Object.entries(locations).map(([key, { resRobotId }]) =>
      axios
        .get("https://api.resrobot.se/v2.1/departureBoard", {
          params: {
            id: resRobotId,
            maxJourneys: 10,
            format: "json",
            accessId: apiKey,
          },
        })
        .then((response) => ({
          key,
          data: (response.data.Departure || []).filter((departure) => {
            if (key === "solnaBusinessPark") {
              return /\b30\b/.test(departure.name);
            } else if (key === "sundbyberg") {
              return /\b43\b/.test(departure.name);
            }
            return false;
          }),
        }))
    );

    Promise.all(realTimePromises)
      .then((responses) => {
        const realTimeMap = responses.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});
        setRealTimeData(realTimeMap);
      })
      .catch((error) =>
        console.error("Error fetching real-time data:", error)
      );
  }, []);

  useEffect(() => {
    const fetchAllData = () => {
      const day = new Date().getDay();
      if (day >= 1 && day <= 5) {
        fetchWeatherData();

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        let shouldRun = false;

        // Check if it's a weekday (Monday to Thursday) 1 = Monday, 5 = Friday
        if (day >= 1 && day <= 4) {  
          if ((hours === 12 && minutes >= 30) || (hours === 13 && minutes <= 20)) {
            shouldRun = true;
          }

          // Check if it's between 15:30 and 17:10
          // Adjust the time range as needed
        if ((hours === 15 && minutes >= 30) || (hours === 17 && minutes <= 10)) { 
          shouldRun = true;
          }
        }

        // Check if it's Friday, friday = 5
        if (day === 5) {
          if ((hours === 14 && minutes >= 30) || (hours === 16 && minutes <= 15)) {
            shouldRun = true;
          }
        }

        if (shouldRun) {
          fetchRealTimeData();
        } else {
          setRealTimeData({}); // Clear real-time data if not in the specified time range
        }
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 60 * 1000);
    const weatherInterval = setInterval(fetchWeatherData, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(weatherInterval);
    };
  }, [fetchWeatherData, fetchRealTimeData]);

  const getMinutesUntilDeparture = (departureTime) => {
    const now = new Date();
    const [hours, minutes] = departureTime.split(":").map(Number);
    const departureDate = new Date(now);
    departureDate.setHours(hours, minutes, 0, 0);

    const diffInMs = departureDate - now;
    return Math.max(Math.floor(diffInMs / (1000 * 60)), 0);
  };

  const getUpcomingDepartures = (key) => {
    const departures = realTimeData[key] || [];
    const sortedDepartures = departures.sort((a, b) => {
      const aMinutes = getMinutesUntilDeparture(a.time);
      const bMinutes = getMinutesUntilDeparture(b.time);
      return aMinutes - bMinutes;
    });

    if (key === "solnaBusinessPark") {
      const solnaDepartures = sortedDepartures.filter((departure) => departure.direction.includes("Solna"));
      const sicklaDepartures = sortedDepartures.filter((departure) => departure.direction.includes("Sickla"));
      return (
        <>
          <div>
            <h5>Tvärbana mot Solna station 🚆</h5>
            {solnaDepartures.slice(0, 5).map((departure, index) => (
              <div key={index} className="departure-item">
                <span className="timer">{getMinutesUntilDeparture(departure.time)} min </span>
                {departure.time.match(/\d+ min/) ? departure.time.match(/\d+ min/)[0] : ''} Mot {departure.direction.replace(/Spårv\s*\(.*?\)/, "").trim()}
              </div>
            ))}
          </div>
          <div>
            <h5>Tvärbana mot Sickla station 🚆</h5>
            {sicklaDepartures.slice(0, 5).map((departure, index) => (
              <div key={index} className="departure-item">
                <span className="timer">{getMinutesUntilDeparture(departure.time)} min </span>
                {departure.time.match(/\d+ min/) ? departure.time.match(/\d+ min/)[0] : ''} Mot {departure.direction.replace(/Spårv\s*\(.*?\)/, "").trim()}
              </div>
            ))}
          </div>
        </>
      );
    }

    if (key === "sundbyberg") {
      const northDepartures = sortedDepartures.filter((departure) =>
        ["Bålsta", "Kallhäll", "Kungsängen"].some((station) => departure.direction.includes(station))
      );
      const southDepartures = sortedDepartures.filter((departure) =>
        ["Handen", "Nynäshamn", "Västerhaninge"].some((station) => departure.direction.includes(station))
      );
      return (
        <>
          <div>
            <h5>Pendeltåg Norrgående Tåg från Sundbyberg 🚆</h5>
            {northDepartures.slice(0, 5).map((departure, index) => (
              <div key={index} className="departure-item">
                <span className="timer">{getMinutesUntilDeparture(departure.time)} min </span>
                {departure.time.match(/\d+ min/) ? departure.time.match(/\d+ min/)[0] : ''} Mot {departure.direction.replace(/\s*\(.*?\)/g, "").trim()}
              </div>
            ))}
          </div>
          <div>
            <h5>Pendeltåg Södergående Tåg från Sundbyberg 🚆</h5>
            {southDepartures.slice(0, 5).map((departure, index) => (
              <div key={index} className="departure-item">
                <span className="timer">{getMinutesUntilDeparture(departure.time)} min </span>
                {departure.time.match(/\d+ min/) ? departure.time.match(/\d+ min/)[0] : ''} Mot {departure.direction.replace(/\s*\(.*?\)/g, "").trim()}
              </div>
            ))}
          </div>
        </>
      );
    }

    return <div>Inga avgångar</div>;
  };

  return (
    <div className="dashboard-container">

      {/* FlipClock here */}
      <div className="flipclock-wrapper">
        <FlipClock />
      </div>

      <div className="data-container">
        <div className="weather-clock-container">
          <div className="weather-container">
            {Object.entries(locations)
              .filter(([key]) => key === "solnaBusinessPark")
              .map(([key, { name }]) => (
                <div key={key} className="weather-item">
                  <h2>{name}</h2>
                  {weatherData[key] ? (
                    <>
                      <p>Temperatur: {weatherData[key].current_weather.temperature}°C 🌡️</p>
                      <p>Vindhastighet: {weatherData[key].current_weather.windspeed} m/s 💨</p>
                      <p>Nederbörd: {weatherData[key].daily.precipitation_sum[0]} mm ☔</p>
                    </>
                  ) : (
                    <p>Laddar väderdata...</p>
                  )}
                </div>
              ))}
          </div>

          <div className="forecast-container">
            {weatherData["solnaBusinessPark"] && (
              <div className="forecast">
                {weatherData["solnaBusinessPark"].daily.time.slice(1, 5).map((date, index) => {
                  const dayOfWeek = new Date(date).toLocaleDateString("sv-SE", { weekday: "long" });
                  const formattedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
                  const maxTemp = weatherData["solnaBusinessPark"].daily.temperature_2m_max[index];
                  const minTemp = weatherData["solnaBusinessPark"].daily.temperature_2m_min[index];
                  const precipitation = weatherData["solnaBusinessPark"].daily.precipitation_sum[index];

                  return (
                    <div key={index} className="daily-weather">
                      <h1>Väder Prognos</h1>
                      <p>{formattedDayOfWeek} Lägsta {minTemp}° / Högsta {maxTemp}°  Nederbörd: {precipitation} mm</p>
                      <div className="weather-icon"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="departure-ticker">
          <div className="departure-ticker-item">
            {getUpcomingDepartures("solnaBusinessPark")}
          </div>
          <div className="departure-ticker-item">
            {getUpcomingDepartures("sundbyberg")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
