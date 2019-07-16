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
    $('.sportName.golf').children('div').each((i, elem) => {
      // rows
      const id = $(elem).attr('id')
      if (id) {
        const row = $(elem).children()
        // stats
        const position = $(row[0]).text()
        const player = $(row[1]).text()
        const par = parCheck(position, Number($(row[2]).text()))
        const thru = $(row[3]).text()
        const today = Number($(row[4]).text())
        const rnd_1 = (position === 'WD') ? 80 : Number($(row[5]).text())
        const rnd_2 = (position === 'WD') ? 80 : Number($(row[6]).text())
        const rnd_3 = (position === 'CUT' || position === 'WD') ? 80 : Number($(row[7]).text())
        const rnd_4 = (position === 'CUT' || position === 'WD') ? 80 : Number($(row[8]).text())
        const totalNum = Number($(row[9]).text()) // total helper
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
