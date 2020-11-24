import React, { useEffect, useState } from 'react';
import ShopPerformanceCard from './Components/Card';

const averages = {
  down_time: '10 days',
  repair_cost: '$250',
  issues: '2.57 a month'
}

function App() {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/shops`)
      .then(response => response.json())
      .then(data => setShops(data))
  }, [])

  return (
    <div className="App flex flex-row flex-wrap justify-evenly bg-gray-100">
      { shops.map(el => (
        <ShopPerformanceCard
          key={el.id}
          shopName={el.name} 
          averages={averages}
          letterGrade={'A'} 
        />
      ))}
    </div>
  );
}

export default App;
