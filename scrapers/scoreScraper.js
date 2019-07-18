// get the live scores
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// helper functions
const { parCheck, bonusCheck, totalCheck } = require('./scoreUtils')
const { updateGoogleScores, updateGoogleTime, updateGoogleDataON, updateGoogleDataOFF } = require('./sheetsUpdater')

const url = 'https://www.flashscore.com/golf/pga-tour/the-open-championship/'

const createScoreTable = async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.sportName.golf')
    const html = await page.content()
    const $ = cheerio.load(html)

    const scoreTable = []
    $('.sportName.golf > div').children('div').each((i, elem) => {
      const id = $(elem).attr('id')
      if (id) {
        const divCount = $(elem).children().length
        const rows = $(elem).children()

        // stats
        const position = $(elem).children('.event__rating').text()
        const player = $(elem).children('.event__participant').text()
        const par = parCheck(position, Number($(rows[divCount - 8]).text()))
        const thru = $(rows[divCount - 7]).text()
        const today = Number($(rows[divCount - 6]).text())
        const rnd_1 = (position === 'WD') ? 80 : Number($(rows[divCount - 5]).text())
        const rnd_2 = (position === 'WD') ? 80 : Number($(rows[divCount - 4]).text())
        const rnd_3 = (position === 'CUT' || position === 'WD') ? 80 : Number($(rows[divCount - 3]).text())
        const rnd_4 = (position === 'CUT' || position === 'WD') ? 80 : Number($(rows[divCount - 2]).text())
        const totalNum = Number($(rows[divCount - 1]).text()) // total helper
        const total = totalCheck(position, totalNum)

        // bonus check
        const bonus = bonusCheck(position)

        // build the scoreTable
        scoreTable.push([position, player, par, bonus, today, thru, rnd_1, rnd_2, rnd_3, rnd_4, total])
      }
    })

    await browser.close()
    return scoreTable

  } catch (e) {
    console.log('Error', e)
  }
}

// update google sheets
const updateGoogle = async (batch) => {
  try {
    await updateGoogleScores(batch)
    await updateGoogleTime()
    await updateGoogleDataON()
  } catch (e) {
    console.log('Error updateGoogle()', e)
  }
}

const updateData = async () => {
  try {
    console.log('---Building scoreTable---')
    const scoreTable = await createScoreTable()
    console.log('---Updating Google Sheet---')
    await updateGoogle(scoreTable)
  } catch (e) {
    console.log('Error updateData()', e)
  }
}

const liveDataON = () => {
  console.log('----LIVE DATA IS ON----')
  updateData()
}

const liveDataOFF = () => {
  console.log('----LIVE DATA IS OFF----')
  updateGoogleDataOFF()
}

module.exports = { liveDataON, liveDataOFF }
