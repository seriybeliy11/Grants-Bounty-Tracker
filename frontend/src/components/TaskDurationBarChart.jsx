import React, { useState, useEffect } from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";

const ThreatenedSpeciesQueChart = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function fetchDataFromAPI() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issue_stats`);
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
          <Title style={{ fontFamily: 'Manrope-900' }}>Issue's Duration Data</Title>
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
      <Subtitle style={{ fontFamily: 'Manrope-600' }}>
      The task duration bar chart displays task completion times in the project.
      </Subtitle>
      {apiData ? (
        <BarChart
          className="mt-6"
          data={apiData[selectedYear]}
          index="number"
          categories={["Duration"]}
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
