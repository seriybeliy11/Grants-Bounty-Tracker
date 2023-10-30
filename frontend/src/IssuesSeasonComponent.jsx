import React, { useState, useEffect } from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";

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
    <Card>
      <div className="flex justify-between items-center">
        <Title>Issue's Duration Data</Title>
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
      <Subtitle>
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
