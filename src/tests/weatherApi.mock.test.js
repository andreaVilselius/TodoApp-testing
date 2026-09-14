import { http, HttpResponse } from "msw";
import { server } from "./mocks/server.js";
import { API_ENDPOINT, getStockholmWeather } from "../services/weatherApi.js";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const validWeatherCodes = [
  0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77,
  80, 81, 82, 85, 86, 95, 96, 99,
];

describe("Open-Meteo med MSW", () => {
  test("returnerar ett objekt som inte är null", async () => {
    const data = await getStockholmWeather();

    expect(data).not.toBeNull();
    expect(typeof data).toBe("object");
  });

  test("innehåller temperature och weathercode", async () => {
    const data = await getStockholmWeather();

    expect(data.temperature).not.toBe(null);
    expect(typeof data.temperature).toBe("number");

    expect(data.weatherCode).not.toBe(null);
    expect(typeof data.weatherCode).toBe("number");
  });

  test("returnerar en giltig temperatur", async () => {
    const data = await getStockholmWeather();

    expect(Number.isFinite(data.temperature)).toBe(true);
    expect(data.temperature).toBe(14.1);
  });

  test("returnerar en giltig väderkod", async () => {
    const data = await getStockholmWeather();

    expect(Number.isInteger(data.weatherCode)).toBe(true);
    expect(validWeatherCodes).toContain(data.weatherCode);
    expect(data.weatherCode).toBe(2);
  });

  test("accepterar minusgrader", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.json({
          current: {
            temperature_2m: -15.5,
            weather_code: 71,
          },
        });
      }),
    );

    const data = await getStockholmWeather();

    expect(data.temperature).toBe(-15.5);
  });

  test("testa att saknad temperatur returnerar undefined", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.json({
          current: {
            weather_code: 71,
          },
        });
      }),
    );

    const data = await getStockholmWeather();
    expect(data.temperature).toBe(undefined);
  });

  test("testa att saknad väderkod returnerar undefined", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.json({
          current: {
            temperature_2m: 23,
          },
        });
      }),
    );

    const data = await getStockholmWeather();
    expect(data.weatherCode).toBe(undefined);
  });

  //felhantering
  test("kastar ett begripligt fel vid HTTP 500", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    await expect(getStockholmWeather()).rejects.toThrow(
      "Det gick inte att hämta vädret.",
    );
  });

  test("kastar ett fel när nätverket bryts", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.error();
      }),
    );

    await expect(getStockholmWeather()).rejects.toThrow();
  });

  test("kastar ett fel om svaret inte är giltig JSON", async () => {
    server.use(
      http.get(API_ENDPOINT, () => {
        return HttpResponse.text("inte json", {
          headers: { "Content-Type": "application/json" },
        });
      }),
    );

    await expect(getStockholmWeather()).rejects.toThrow();
  });
});
