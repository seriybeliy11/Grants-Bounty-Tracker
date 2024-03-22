import React, { useEffect, useState } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const ChartStates = () => {
  const [chartData, setChartData] = useState([]);
  const [currentYear, setCurrentYear] = useState('2023');
  const availableYears = ['2022', '2023'];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issue_type`);
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;
        if (jsonData[currentYear]) {
          const formattedData = jsonData[currentYear].map((item) => ({
            que: item.value,
            state: item.state,
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, [currentYear]);

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ fontFamily: 'Manrope-900' }}>States Data</Title>
          <a data-tooltip-id="my-anchor-element_sqqw">💎</a>
          <Tooltip id="my-anchor-element_sqqw">
            <p>The pie chart shows the ratio of closed to open tasks</p>
          </Tooltip>
        </div>
        <div className="space-x-2">
          {availableYears.map((year) => (
            <button
              key={year}
              className={`px-2 py-1 rounded ${currentYear === year ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setCurrentYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      <DonutChart data={chartData} category="que" index="state" />
    </Card>
  );
};

export default ChartStates;
