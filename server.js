require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const baseURL = process.env.BASE_URL;
const fleetioKey = process.env.FLEETIO_API_KEY;
const token = process.env.FLEETIO_TOKEN;
const axios = require('axios');
const luxon = require('luxon');

app.use(express.json());
app.use(cors());

app.listen(5000, () => console.log('listening on port 5000'));

const headers = {
  'Authorization': `Token token=${fleetioKey}`, 
  'Account-Token': token
}

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
