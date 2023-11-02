import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const dataFormatter = (number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

function RewardsComponent() {
  const [rewardsData, setRewardsData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [selectedYear, setSelectedYear] = useState("2022");

  useEffect(() => {
    try {
      fetch("./rewards.json")
        .then((res) => res.json())
        .then((jsonData) => setRewardsData(jsonData))
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ fontFamily: 'Manrope-600' }}>Reward's Data</Title>
          <a data-tooltip-id="my-anchor-element_season">💎</a>
          <Tooltip id="my-anchor-element_season">
            <p>The line graph shows on the x-axis the numbers of tasks and on the y-axis the reward amounts for each task in dollars</p>
            <p>It is also possible to select a moment in time (different tasks existed at different times)</p>
          </Tooltip>
        </div>
        <div className="space-x-2">
          {rewardsData && Object.keys(rewardsData).map((year) => (
            <button
              key={year}
              className={`px-2 py-1 rounded ${
                selectedYear === year ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
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
}

export default RewardsComponent;
