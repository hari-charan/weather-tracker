import { useEffect, useLayoutEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const WeatherPage = () => {
  let [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  let [locationAccess, setLocationAccess] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);
  let [userName, setUserName] = useState<string>("");
  let [interval, setIntarval] = useState<string>("");
  let navigate = useNavigate();

  let createJob = async (userName: string, interval: string, latitude: number, longitude: number) => {
    let response = await axios.post<boolean>("http://localhost:8080/schedule", 
    {
      user_name: userName, 
      time: interval,
      latitude: latitude,
      longitude: longitude
    },
    );
    return response.data;
  }

  let getCoordinate = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAccess(true);
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        console.log("Unable to fetch location!");
        setLoading(false);
      }
    );
  };
  useLayoutEffect(() => {
    setLoading(true);
    getCoordinate();
  }, []);

  if (loading) {
    return <div className="loading-container">
    <h1>Loading...</h1>
    <div className="spinner"></div>
  </div>;
  } else {
    return locationAccess ? (
      <form onSubmit={async (e) => {
        e.preventDefault();
        let res = await createJob(userName, interval, coordinates?.latitude ?? 0, coordinates?.longitude ?? 0)
        if(res) alert("Created Job Sucessfully for "+ userName + " with a interval of " + interval)
        else alert("Unable to create the Job")
      }}>
        <div className="weather-container">
          <button onClick={() => navigate("/")} className="custom-button"> Home </button>
          <div className="location-info">
            <span className="heading block">Your Location</span>
            <span className="subheading block">
              Latitude: {coordinates?.latitude}, Longitude: {coordinates?.longitude}
            </span>
          </div>
          <div className="input-container">
            <span className="heading block">Schedule</span>
            <label htmlFor="user_name" className="subheading">
              User name
            </label>
            <input type="text" id="user_name" onChange={(e) => setUserName(e.target.value)} required className="input-field" />
            <label htmlFor="time_inputdata" className="subheading">
            Fetch interval ( In minutes )
            </label>
            <input type="number" id="time_inputdata" onChange={(e => setIntarval(e.target.value))} required className="input-field" />
            <button className="custom-button" type="submit"> Initate job</button>
          </div>
        </div>
      </form>
    ) : (
      <div>Please provide location access</div>
    );
  }
};

export default WeatherPage;
