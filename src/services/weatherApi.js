export const API_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
export const WEATHER_URL = `${API_ENDPOINT}?latitude=59.3293&longitude=18.0686&current=temperature_2m,weather_code&temperature_unit=celsius&timezone=Europe%2FStockholm`;
export const getStockholmWeather = async () => {
  const response = await fetch(WEATHER_URL);

  if (!response.ok) {
    throw new Error("Det gick inte att hämta vädret.");
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    weatherCode: data.current.weather_code,
  };
};
