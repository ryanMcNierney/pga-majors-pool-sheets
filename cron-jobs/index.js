var cron = require('node-cron');
const { liveDataON, liveDataOFF } = require('../scrapers/scoreScraper')

const job = cron.schedule('*/2 * * * *', () => {
  liveDataON()
}, {
    scheduled: false
  })

const cronON = () => {
  job.start()
  console.log('Cron job ON')
}

const cronOFF = () => {
  job.stop()
  console.log('Cron job OFF')
  liveDataOFF()
}

module.exports = { cronON, cronOFF }
