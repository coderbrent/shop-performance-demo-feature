require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const axios = require('axios');
const luxon = require('luxon');
const baseURL = process.env.BASE_URL;
const baseGoogleURL = `https://maps.googleapis.com/maps/api/place`;
const fleetioKey = process.env.FLEETIO_API_KEY;
const token = process.env.FLEETIO_TOKEN;

app.use(express.json());
app.use(cors());

app.listen(5000, () => console.log('live and listening on port 5000'));

const headers = {
  'Authorization': `Token token=${fleetioKey}`, 
  'Account-Token': token
};

app.get('/shops', async (req, res) => {
  let shopsOnly = 
    await axios.get(baseURL + `vendors?q[service]=true`, { headers });
    
  res.send(shopsOnly.data)
});

//get ALL service entries from a SPECIFIC shop -> get downtime of each repair -> add up all downtimes ->
//divide sum of downtime over all service entries -> save resulting "average downtime" metric
//to DB to collate later with other metrics? <- what mechanism do we use here? Need to think this through better.
app.get('/service_entries/:id', async (req, res) => {
  let allEntries = 
    await axios.get(baseURL + `service_entries?q[vendor_id_eq]=${req.params.id}`, { headers });
    //grab the start/end date-time data from each
    let startDate = luxon.DateTime.fromISO(allEntries.data[0].started_at);
    let completedAt = luxon.DateTime.fromISO(allEntries.data[0].completed_at);
    
    //use luxon to get the elapsed downtime and store in a var called 'diff'
    let diff = completedAt.diff(startDate, ['months', 'days']).values.days;
    
    console.log(diff)

    res.send(allEntries.data)
})

//since Fleetio does not provide a place to store shop hours, I put together a workaround that uses
//fleetios api + google places api to fetch the shop hours from google via the vendor id. 

app.get('/vendor_hours/:id', async (req, res) => {
  //simple util to encode the name for google places lookup - TODO: some vendor names include special characters
  //ex. 'Shell #4290' - this function should be expanded to parse/replace these types of names.
  const urlEncoder = str => str.replace(/[ ]/g, '%20');
  
  //we grab the vendor from fleetio by it's id...
  let vendorFromFleetio = await axios
    .get(baseURL + `vendors/${req.params.id}`, { headers })
    .then(response => response.data)
    .catch(error => console.error(error));

  //we deconstruct the lat, lng and name from the result and construct the google place url...
  //Note that SOME vendors do NOT have lat, lng properties - if they do not, this operation aborts.
  const { latitude, longitude, name } = vendorFromFleetio;
  let googlePlacesIdLookupURL = `/findplacefromtext/json?input=${urlEncoder(name)}&inputtype=textquery&locationbias=point:${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`;

  // we go out and grab the placeID based on the lat/lng & name of the vendor...
  let placeID = await axios
    .get(baseGoogleURL + googlePlacesIdLookupURL)
    .then(response => response.data.candidates[0].place_id)
    .catch(error => console.error(error));

  //we use the placeID to create a places detail search...
  let googlePlacesDetails = `/details/json?place_id=${placeID}&fields=name,opening_hours&key=${process.env.GOOGLE_API_KEY}`;
  
  //we store the returned schedule...
  let vendorSchedule = await axios
    .get(baseGoogleURL + googlePlacesDetails)
    .then(response => { 
      let vendorScheduleData = Object.create(null);
      if(!response.data.result.opening_hours.periods[0]) {
        return res.status(400).send('No hours were found via google places search for this vendor.')
      } else {
        let hours = response.data.result.opening_hours.periods;
        //converted the response schedule to something easier to use here
        for(let key in hours) {
          vendorScheduleData[luxon.Info.weekdays()[key]] = { 
            open: hours[key].open.time,
            close: hours[key].close.time,
          }
        }
        return vendorScheduleData;
      }
    })
    .catch(error => console.error(error));
    
    //vendorSchedule.Monday -> { open: '0900', close: '1700' } .. and so on..

})