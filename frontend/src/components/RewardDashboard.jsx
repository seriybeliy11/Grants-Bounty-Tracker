import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const RewardsComponent = () => {
  const [rewardsData, setRewardsData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2022");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/issue_rewards");
        if (response.ok) {
          const data = await response.json();
          const jsonData = data.result;
          setRewardsData(jsonData);
        } else {
          console.error("Error:", response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const dataFormatter = (number) => `$ ${Intl.NumberFormat("us").format(number)}`;

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ fontFamily: 'Manrope-600' }}>Reward's Data</Title>
          <a data-tooltip-id="my-anchor-element_sea">💎</a>
          <Tooltip id="my-anchor-element_sea">
            <p>The line graph shows on the x-axis the numbers of tasks and on</p>
            <p>the y-axis the reward amounts for each task in dollars</p>
          </Tooltip>
        </div>
        <div className="space-x-2">
          {rewardsData && Object.keys(rewardsData).map((year) => (
            <button
              key={year}
              className={`px-2 py-1 rounded ${selectedYear === year ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      <AreaChart
        className="h-72 mt-4"
        data={rewardsData ? rewardsData[selectedYear] : []}
        index="Issue Number"
        categories={["Rewards (th. $)"]}
        colors={["sky"]}
        valueFormatter={dataFormatter}
        curveType="monotone"
      />
    </Card>
  );
};

export default RewardsComponent;
