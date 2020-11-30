import React, { useEffect, useState } from 'react';
import ShopPerformanceCard from './Components/ShopPerformanceCard';
import { grader } from './utils/grader';

const averages = {
  down_time: '10 days',
  repair_cost: '$250',
  issues: '2.57 a month'
}

function App() {
  const [score, setScore] = useState([]);
  const [vendors, setVendors] = useState([]);

  const getShopPerformanceCard = shopID => {
    fetch(`https://fleetio-demo-api.herokuapp.com/get_vendor_performance/${shopID}`, { mode: 'no-cors'})
      .then(res => res.json())
      .then(data => setScore([data]))
  };

  try {
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Server Timing', entry.serverTiming);
      }
    });
    po.observe({ 
      type: 'navigation', 
      buffered: true 
    });
  } catch (e) {
  //blah
  };

  useEffect(() => {
    fetch(`https://fleetio-demo-api.herokuapp.com/all_vendors`, { mode: 'no-cors'})
      .then(res => res.json())
      .then(data => setVendors(data))
  },[]);

  return (
    <>
    <div className="App flex flex-col flex-wrap justify-center bg-gray-100">
      { score ? score.map(el => (
        <ShopPerformanceCard
          key={el.id}
          shopName={el.name}
          averages={averages}
          letterGrade={grader(el.average)}
        />
      )) : null }
    <select onChange={e => getShopPerformanceCard(e.target.value)}>
        { vendors.map(shop => (
          <option 
            value={shop.id} 
            key={shop.id}>
              {shop.name}
          </option>
        ))}
    </select>
    </div>
    </>
  );
}

export default App;
