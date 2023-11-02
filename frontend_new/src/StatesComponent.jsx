import React, { useEffect, useState } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const ChartStates = () => {
  const [chartData, setChartData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [currentYear, setCurrentYear] = useState('2023'); // Измените текущий год по умолчанию, если необходимо
  const availableYears = ['2022', '2023']; // Укажите доступные годы

  useEffect(() => {
    fetch('github_issues.json')
      .then((response) => response.json())
      .then((data) => {
        if (data[currentYear]) {
          const formattedData = data[currentYear].map((item) => ({
            que: item.value,
            state: item.state,
          }));
          setChartData(formattedData);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [currentYear]); // Обновление данных при изменении текущего года

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title style={{ fontFamily: 'Manrope-900' }}>States Data</Title>
        <a data-tooltip-id="my-anchor-element_sqqw">💎</a>
        <Tooltip id="my-anchor-element_sqqw">
          <p>The pie chart shows the ratio of closed to open tasks</p>
        </Tooltip>
        <div>
          <p>Select Year:</p>
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              style={{
                marginRight: '10px',
                background: year === currentYear ? 'lightblue' : 'red', // Подсветка активного года
              }}
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
