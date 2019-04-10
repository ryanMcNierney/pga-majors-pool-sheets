const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV === 'development') require('dotenv').config()

app.get('/', (req, res) => res.send('<h1>PGA MAJORS POOL LIVE STATS</h1>'))

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
