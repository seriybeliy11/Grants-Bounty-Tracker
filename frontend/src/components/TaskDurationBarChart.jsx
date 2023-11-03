import React, { useState, useEffect } from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const ThreatenedSpeciesQueChart = () => {
  const [selectedYear, setSelectedYear] = useState("2022");
  const [chartData, setChartData] = useState([]);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        const response = await fetch("http://localhost:3000/issue_stats");
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;
        setApiData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchDataFromAPI();
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ fontFamily: 'Manrope-600' }}>Issue's Duration Data</Title>
          <a data-tooltip-id="my-anchor-element_season">💎</a>
          <Tooltip id="my-anchor-element_season">
            <p>
              This bar chart shows the duration in time (in days) for tasks. The x-axis shows the task numbers.
            </p>
            <p>
              The y-axis shows the duration (in days). It is also possible to select a moment in time (different tasks existed at different times).
            </p>
          </Tooltip>
        </div>
        <div className="space-x-2">
          {["2022", "2023"].map((year) => (
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
      <Subtitle style={{ fontFamily: 'Manrope-900' }}>
        The task duration graph is a visualization of the time taken to complete each task in the project.
      </Subtitle>
      {apiData ? (
        <BarChart
          className="mt-6"
          data={apiData[selectedYear]}
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
