import axios from "axios";
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = (lat, lon) =>
  axios
    .get(`${apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then((response) => response.data);

export default { getWeather };
