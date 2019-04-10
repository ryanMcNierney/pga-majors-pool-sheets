const CronJob = require('cron').CronJob
const { liveDataON } = require('../scrapers/scoreScraper')

console.log('Before job instantiation');
const job = new CronJob('0 */2 * * * *', function () {
  const d = new Date();
  console.log('Every 2nd Minute:', d)
  liveDataON()
});

console.log('After job instantiation');
job.start();
console.log('is job running? ', job.running);

module.exports = { job }
