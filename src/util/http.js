import axios from 'axios'

export const HTTP = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
  }
})