import { http, HttpResponse } from "msw";
import { API_ENDPOINT } from "../../services/weatherApi.js";

export const mockWeatherResponse = {
  latitude: 59.3289,
  longitude: 18.072357,
  timezone: "Europe/Stockholm",
  current_units: {
    time: "iso8601",
    interval: "seconds",
    temperature_2m: "°C",
    weather_code: "wmo code",
  },
  current: {
    time: "2026-08-21T07:15",
    interval: 900,
    temperature_2m: 14.1,
    weather_code: 2,
  },
};

export const handlers = [
  http.get(API_ENDPOINT, () => {
    return HttpResponse.json(mockWeatherResponse);
  }),
];
