const { job } = require('./cronON')
const { liveDataOFF } = require('../scrapers/scoreScraper')

job.stop()
console.log('is job running? ', job.running)

liveDataOFF()
