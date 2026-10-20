<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const city = ref('')
const weatherData = ref(null)
const searchedLocation = ref('')
const loading = ref(false)
const errorMessage = ref('')

const temperature = computed(() =>
  weatherData.value ? Math.round(weatherData.value.main.temp) : null,
)

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})

const displayLocation = computed(() => {
  if (searchedLocation.value) return searchedLocation.value
  return weatherData.value ? `${weatherData.value.name}, ${weatherData.value.sys.country}` : ''
})

const fetchWeatherData = async (params) => {
  errorMessage.value = ''
  loading.value = true

  try {
    if (!apiKey) {
      throw new Error('OpenWeather API key is missing. Add it to the .env file and restart Vite.')
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        ...params,
        appid: apiKey,
        units: 'metric',
      },
      timeout: 10000,
    })
    weatherData.value = response.data
  } catch (error) {
    weatherData.value = null

    if (error.response?.status === 401) {
      errorMessage.value = 'The API key is invalid or has not been activated yet.'
    } else if (error.response?.status === 404) {
      errorMessage.value = 'City not found. Try a value such as Clayton, AU.'
    } else {
      errorMessage.value = error.message || 'Unable to retrieve weather data.'
    }
  } finally {
    loading.value = false
  }
}

const searchByCity = async () => {
  const query = city.value.trim()
  if (!query) {
    errorMessage.value = 'Please enter a city.'
    return
  }

  await fetchWeatherData({ q: query })
  if (weatherData.value) searchedLocation.value = query
}

const fetchCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    errorMessage.value = 'Geolocation is not supported by this browser.'
    return
  }

  errorMessage.value = ''
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      searchedLocation.value = ''
      fetchWeatherData({ lat: coords.latitude, lon: coords.longitude })
    },
    () => {
      errorMessage.value = 'Location access was unavailable. Search for a city instead.'
    },
    { enableHighAccuracy: true, timeout: 10000 },
  )
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <section class="weather-page container py-5">
    <div class="weather-panel mx-auto">
      <p class="eyebrow">Current conditions</p>
      <h1>Weather Check</h1>
      <p class="intro">Search by city or use your current location.</p>

      <form class="search-form" @submit.prevent="searchByCity">
        <label class="visually-hidden" for="city">City</label>
        <input
          id="city"
          v-model="city"
          class="form-control"
          type="text"
          placeholder="Clayton, AU"
          autocomplete="off"
        >
        <button class="btn btn-primary" type="submit" :disabled="loading">
          {{ loading ? 'Loading…' : 'Search' }}
        </button>
        <button
          class="btn btn-outline-secondary"
          type="button"
          :disabled="loading"
          @click="fetchCurrentLocationWeather"
        >
          Use my location
        </button>
      </form>

      <p v-if="errorMessage" class="alert alert-danger mt-4" role="alert">
        {{ errorMessage }}
      </p>

      <main v-if="weatherData" class="weather-result" aria-live="polite">
        <div>
          <p class="result-label">Weather now</p>
          <h2>{{ displayLocation }}</h2>
          <p class="description">{{ weatherData.weather[0].description }}</p>
        </div>

        <div class="temperature-block">
          <img :src="iconUrl" :alt="`${weatherData.weather[0].description} weather icon`">
          <p>{{ temperature }}<span>°C</span></p>
        </div>
      </main>
    </div>
  </section>
</template>

<style scoped>
.weather-page {
  min-height: calc(100vh - 96px);
  display: grid;
  place-items: start center;
}

.weather-panel {
  width: min(100%, 760px);
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid #dfe5ec;
  border-radius: 24px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f7ff 100%);
  box-shadow: 0 18px 50px rgb(32 61 92 / 12%);
}

.eyebrow,
.result-label {
  margin-bottom: 0.35rem;
  color: #0d6efd;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin-bottom: 0.5rem;
  font-weight: 750;
}

.intro {
  color: #5f6b78;
}

.search-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.weather-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #d7e0ea;
}

.weather-result h2 {
  margin-bottom: 0.4rem;
}

.description {
  margin: 0;
  color: #5f6b78;
  font-size: 1.1rem;
  text-transform: capitalize;
}

.temperature-block {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.temperature-block img {
  width: 90px;
  height: 90px;
}

.temperature-block p {
  margin: 0;
  color: #152238;
  font-size: clamp(2.4rem, 8vw, 4.2rem);
  font-weight: 750;
  line-height: 1;
}

.temperature-block span {
  font-size: 0.45em;
  vertical-align: top;
}

@media (max-width: 680px) {
  .search-form {
    grid-template-columns: 1fr;
  }

  .weather-result {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
