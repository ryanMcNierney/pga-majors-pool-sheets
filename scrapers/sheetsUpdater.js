const { google } = require('googleapis')
require('dotenv').config()

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets'])

//authenticate request
jwtClient.authorize(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully connected!')
  }
})

const updateGoogleScores = (batch) => {
  try {
    const data = [{ range: 'liveData!A4:K203', values: batch }]
    const resource = { data, valueInputOption: 'USER_ENTERED' }

    // write to google sheet
    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.batchUpdate({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource
    }, (err, result) => {
      if (err) {
        console.log('Error writing SCORES to google sheet', err)
      } else {
        console.log(`${result.data.totalUpdatedRows} Rows Updated`)
      }
    })
  } catch (e) {
    console.log('Error writing scores to Google', e)
  }
}

const updateGoogleTime = () => {
  try {
    // write the last pull time
    const time = new Date(Date.now()).toLocaleTimeString()
    const timeValue = [[time]]
    const timeResource = { values: timeValue }

    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource: timeResource,
      range: 'liveData!B1',
      valueInputOption: 'USER_ENTERED'
    }, (err) => {
      if (err) {
        console.log('Error writing TIME to google sheet', err)
      } else {
        console.log(`Time cell updated`)
      }
    })
  } catch (e) {
    console.log('error writing time to google')
  }
}

const updateGoogleDataON = () => {
  try {
    // write the last pull time
    const dataValue = [['ON']]
    const dataResource = { values: dataValue }

    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource: dataResource,
      range: 'liveData!E1',
      valueInputOption: 'USER_ENTERED'
    }, (err) => {
      if (err) {
        console.log('Error writing data ON to google sheet', err)
      } else {
        console.log(`Data cell updated ON`)
      }
    })
  } catch (e) {
    console.log('error writing data ON to google')
  }
}

const updateGoogleDataOFF = () => {
  try {
    // write the last pull time
    const dataValue = [['OFF']]
    const dataResource = { values: dataValue }

    const sheets = google.sheets('v4')
    sheets.spreadsheets.values.update({
      auth: jwtClient,
      spreadsheetId: '1LgVwRQ1GIB_Lx8FLEswC29dTQInj0qiBQWE2x1FyGiU',
      resource: dataResource,
      range: 'liveData!E1',
      valueInputOption: 'USER_ENTERED'
    }, (err) => {
      if (err) {
        console.log('Error writing data OFF to google sheet', err)
      } else {
        console.log(`Data cell updated OFF`)
      }
    })
  } catch (e) {
    console.log('error writing data OFF to google')
  }
}

module.exports = { updateGoogleScores, updateGoogleTime, updateGoogleDataON, updateGoogleDataOFF }
