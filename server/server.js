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
  'Account-Token': token,
  'Server-Timing': 'miss, db;dur=53, app;dur=47.2'
};

//This route uses the Google Places API to get a shops operating hours and adds it to their vendor profile in a custom field.
app.get('/vendor_hours/:id', async (req, res) => { 
  const urlEncoder = str => str.replace(/[ ]/g, '%20');
  //we grab the vendor from fleetio by it's id...
  let vendorFromFleetio = await axios
    .get(`${baseURL}vendors/${req.params.id}`, { headers })
    .then(response => {
      if(!response) {
        return res.send('There was an issue fetching a vendor from Fleetio.')
      } else if(response.data.latitude == null) {
        return res.send('This vendor does not have a valid lat/lng. Check in the Fleetio UI to see if there is a proper address provided.' )
      } else {
        return response.data
      }
    })
    .catch(error => console.error(error));

  //Note that SOME vendors do NOT have lat, lng properties - if they do not, this operation aborts.
  const { name, id, latitude, longitude } = vendorFromFleetio;

  let googlePlacesIdLookupURL = `/findplacefromtext/json?input=${urlEncoder(name)}&inputtype=textquery&locationbias=point:${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`;

  // we go out and grab the placeID based on the lat/lng & name of the vendor...
  let placeID = await axios
    .get(baseGoogleURL + googlePlacesIdLookupURL)
    .then(response => { 
      if(!response.data.candidates[0].place_id || !response) {
        return res.send('No placeID was found for the requested vendor.')
      } else {
        return response.data.candidates[0].place_id
      }
    })
    .catch(error => console.error(error));

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
        //converted the response schedule to something easier to use here..
        vendorScheduleData['name'] = name;
        vendorScheduleData['id'] = id;
        
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

//Stored this data to a custom field since there wasn't any other way to do it.
  axios
    .patch(`${baseURL}vendors/${req.params.id}`, {
      custom_fields: {
        operating_hours: vendorSchedule
      },
    }, { headers }).then(response => res.json(response.data))
    .catch(error => console.error(error));

//This data is obviously not perfect because it is ultimately on the shop to maintain it (update a GMB with accurate hours (or at all)).
//I do typically try to steer away from making design decisions where core functionality rests on the whims of shopkeepers! lol.
//I implemented this anyway for the following reasons:

//1. This feature can still be manually overridden - a user that wants to take adv of the shop performance feature can
//simply enter the shop's hours if they want the rest of the feature to work!
//2. It is my belief that Fleetio has actually made similar design decisions to this in the past - namely
//with odometer readings. In other words, a decision was made to allow a key piece of data (key being that accurate odo records play a huge role in other very useful Fleetio features)
//to be overridden or otherwise ignored by the user in the event they either do not wish to keep up with tracking or make too many innaccurate entries.
});

const timeTrim = num => num.replace(/[0]/g, '');

app.get('/calculate_hours/:service_id', async (req, res) => {
  let service = await 
    axios
      .get(`${baseURL}service_entries/${req.params.service_id}`, { headers })
        .then(response => response.data)
        .catch(error => console.error(error));

  let vendorSchedule = await 
    axios
      .get(`${baseURL}vendors/${service.vendor_id}`, { headers })
        .then(response => { 
          if(!response.data.custom_fields.operating_hours) 
            return res.send('no schedule set for vendor. please set a schedule first.')
            else
            return JSON.parse(response.data.custom_fields.operating_hours)
        })
        .catch(error => console.error(error));

  let bookHours = service.custom_fields.book_time_hours;
  let startedAt = luxon.DateTime.fromISO(service.started_at);
  let completedAt = luxon.DateTime.fromISO(service.completed_at);

  let totalDownTime = 
    completedAt
      .diff(
        startedAt, 
        ['weeks', 'days', 'hours', 'minutes'])
      .toObject();

  let openTime = 
    luxon.DateTime
      .local(
        startedAt.year, 
        startedAt.month, 
        startedAt.day, 
        +(timeTrim(vendorSchedule[startedAt.weekdayLong].open))
      );

  let closeTime = 
    luxon.DateTime
      .local(
        startedAt.year, 
        startedAt.month, 
        startedAt.day, 
        +(timeTrim(vendorSchedule[startedAt.weekdayLong].close))
      );

  let actualWorkHours = 
    closeTime
      .diff(
        openTime,
        ['hours', 'minutes'])
      .toObject();

  //I'm not great with math or statistics, but this seemed like a good starting point for a formula that
  //outputs the efficiency rate of a shop on job-by-job basis. Explanation:
  //1. We first find the total_hours_of_operation over the course of the entire repair. Again, we do this
  //to avoid penalizing a shop for off hours (this is why we needed the shops schedule first).
  //2. We divide the resulting workable hours against the proposed book time standard.
  //3. We convert to a % and round down to the nearest whole num.

  let efficiencyRateOfJob = 
    Math.floor((bookHours / (actualWorkHours.hours * totalDownTime.days)) * 100);

  axios
    .patch(`${baseURL}service_entries/${service.id}`, {
      custom_fields: {
        shop_efficiency_rate: efficiencyRateOfJob
      },
    }, { headers }).then(response => res.json(response.data))
    .catch(error => console.error(error));
});

app.get('/get_vendor_performance/:vendor_id', async (req, res) => {
  let allEfficiencyRates = [];
  let scoreCard = Object.create(null);
  let allServiceEntriesByVendor = await 
    axios
      .get(`${baseURL}service_entries?q[vendor_id_eq]=${req.params.vendor_id}`, { headers })
      .then(response => {
        if(!response.data) {
          res.json('No service entries were found for this vendor.')
        } else {
          return response.data
        }
      })
      .catch(error => console.error(error))

  allServiceEntriesByVendor.forEach(el => {
    if(!el.custom_fields.shop_efficiency_rate) {
      return res.json('This shop does not have a set schedule - please visit the shops profile in the UI and set one or use the automated url.')
    }
    allEfficiencyRates.push(el.custom_fields.shop_efficiency_rate)
  })

  let overallAvgEfficiency = 
    allEfficiencyRates
      .reduce((a, b) => (+a + +b)) / allServiceEntriesByVendor.length

  scoreCard.name = allServiceEntriesByVendor[0].vendor_name;
  scoreCard.id = req.params.vendor_id;
  scoreCard.average = overallAvgEfficiency;
  
  res.json(scoreCard);
});

app.get('/all_vendors', async (req, res) => {
  let vendors = await 
    axios
      .get(`${baseURL}vendors`, { headers })
      .then(response => response.data)
      .catch(error => console.error(error));

      res.json(vendors);
});