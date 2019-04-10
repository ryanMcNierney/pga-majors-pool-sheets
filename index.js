const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { cronON, cronOFF } = require('./cron-jobs')
if (process.env.NODE_ENV === 'development') require('dotenv').config()

app.get('/', (req, res) => res.send('<h1>PGA MAJORS POOL LIVE STATS</h1>'))

app.get('/on', (req, res) => {
  cronON()
  res.send('<h2>CRON ON</h2>')
})

app.get('/off', (req, res) => {
  cronOFF()
  res.send('<h2>CRON OFF</h2>')
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
