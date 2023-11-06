import React, { useState, useEffect } from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function CommentersComponent() {
  const [contributorsData, setContribData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2022");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/issue_comments");
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const jsonData = data.result;
        setContribData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div>
      {contributorsData && (
        <Card style={{ borderRadius: '16px' }}>
          <div className="flex justify-between items-center">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{ fontFamily: 'Manrope-900' }}>Commenters Data</Title>
              <a data-tooltip-id="my-anchor-element_commenters">💎</a>
              <Tooltip id="my-anchor-element_commenters">
                <p>Bar chart shows on the x-axis the number of tasks,</p>
                <p>on the y-axis - the number of comments for each task</p>
              </Tooltip>
            </div>
            <div className="space-x-2">
              {Object.keys(contributorsData).map((year) => (
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
          <BarChart
            className="h-72 mt-4"
            data={contributorsData ? contributorsData[selectedYear] : []}
            index="issue"
            categories={["Comments"]}
            colors={["sky"]}
          />
        </Card>
      )}
    </div>
  );
}

export default CommentersComponent;
