import React, { useEffect, useState } from 'react';
import ShopPerformanceCard from './Components/Card';

const averages = {
  down_time: '10 days',
  repair_cost: '$250',
  issues: '2.57 a month'
}

function App() {
  const [shops, setShops] = useState();

  useEffect(() => {
    fetch(`http://localhost:5000/shops`)
      .then(response => response.json())
      .then(data => setShops(data))
  }, [])

  return (
    <div className="App bg-gray-100">

      <ShopPerformanceCard averages={averages} shopName="Seifert's Automotive" letterGrade="A" />
      <ShopPerformanceCard averages={averages} shopName="Eli's Garage" letterGrade="C" />
      <ShopPerformanceCard averages={averages} shopName="Milltown Mechanics" letterGrade="F" />
    </div>
  );
}

export default App;
