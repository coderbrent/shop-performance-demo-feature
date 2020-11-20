require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const baseURL = process.env.BASE_URL;
const fleetioKey = process.env.FLEETIO_API_KEY;
const token = process.env.FLEETIO_TOKEN;
const axios = require('axios');

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
  
  console.log(shopsOnly)
  
  res.json(shopsOnly)
})
