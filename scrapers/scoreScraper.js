// get the live scores
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

// helper functions
const { parCheck, bonusCheck, totalCheck } = require('./scoreUtils')
const { updateGoogleScores, updateGoogleTime, updateGoogleDataON, updateGoogleDataOFF } = require('./sheetsUpdater')

const url = 'https://www.flashscore.com/golf/pga-tour/masters-tournament/'

const createScoreTable = async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.fs-table')
    const html = await page.content()
    const $ = cheerio.load(html)

    const scoreTable = []
    $('.table-main > table > tbody').children('tr').each((i, elem) => {
      // stats
      const position = $(elem).find('.cell_ra').text()
      const player = $(elem).find('.cell_ab').text()
      const par = parCheck(position, Number($(elem).find('.cell_sc').text()))
      const thru = $(elem).find('.cell_su').text()
      const today = Number($(elem).find('.cell_sw').text())
      const rnd_1 = (position === 'WD') ? 80 : Number($(elem).find('.cell_sd').text())
      const rnd_2 = (position === 'WD') ? 80 : Number($(elem).find('.cell_se').text())
      const rnd_3 = (position === 'CUT' || position === 'WD') ? 80 : Number($(elem).find('.cell_sf').text())
      const rnd_4 = (position === 'CUT' || position === 'WD') ? 80 : Number($(elem).find('.cell_sg').text())
      const totalNum = Number($(elem).find('.cell_sh').text()) // total helper
      const total = totalCheck(position, totalNum)

      // bonus check
      const bonus = bonusCheck(position)

      // build the scoreTable
      scoreTable.push([position, player, par, bonus, today, thru, rnd_1, rnd_2, rnd_3, rnd_4, total])

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
