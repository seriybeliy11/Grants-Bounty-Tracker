import React, { useState, useEffect } from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const ThreatenedSpeciesQueChart = () => {
  const [selectedYear, setSelectedYear] = useState("2022");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("./initialChartData.json")
      .then((res) => res.json())
      .then((jsonData) => {
        const selectedData = jsonData[selectedYear];
        if (selectedData) {
          setChartData(selectedData);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Card style={{borderRadius: '16px'}}>
      <div className="flex justify-between items-center">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title style={{fontFamily: 'Manrope-600'}}>Issue's Duration Data</Title>
        <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
              </Tooltip>
      </div>
        <div className="space-x-2">
          {["2022", "2023"].map((year) => (
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
      <Subtitle style={{fontFamily: 'Manrope-900'}}>
        The task duration graph is a visualization of the time taken to complete each task in the project
      </Subtitle>
      {chartData && chartData.length > 0 ? (
        <BarChart
          className="mt-6"
          data={chartData}
          index="number"
          categories={["duration"]}
          colors={["sky"]}
          yAxisWidth={48}
        />
      ) : (
        <div>Loading...</div>
      )}
    </Card>
  );
};

export default ThreatenedSpeciesQueChart;
