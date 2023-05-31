import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { config } from "dotenv";
config();

const { TOKEN, OPEN_WEATHER_ID } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async (msg) => {
    console.log(msg)
  const chatId = msg.chat.id;
  const userInput = msg.text;

  if (userInput === "/start") {
    const welcomeMessage = `Welcome to WeatherBot ${msg.chat.first_name}! 
A4 Team is here to provide you with weather information.
Please enter the name of a city to get the current weather conditions.`;
    bot.sendMessage(chatId, welcomeMessage);
  } else {
    console.log(userInput);
    try {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${OPEN_WEATHER_ID}`
        )
        .then((response) => {
          console.log(response.data);
          const data = response.data;
          const weather = data.weather[0].description;
          const temperature = data.main.temp - 273.15;
          const city = data.name;
          const humidity = data.main.humidity;
          const pressure = data.main.pressure;
          const windSpeed = data.wind.speed;
          const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(
            2
          )}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.
             -----From Team A4`;
          bot.sendMessage(chatId, message);
        })
        .catch((error) => {
          bot.sendMessage(chatId, "City doesn't exist.");
        });
    } catch (error) {
      bot.sendMessage(chatId, "City doesn't exist.");
    }
  }
});
