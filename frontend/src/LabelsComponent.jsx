import React, { useState, useEffect } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const ChartsLabels = () => {
  const [selectedYear, setSelectedYear] = useState('2023');
  const [chartData, setChartData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  const availableYears = ['2022', '2023']; // Обновите этот массив с нужными годами

  useEffect(() => {
    fetch('label_counts.json')
      .then((response) => response.json())
      .then((data) => {
        if (data[selectedYear]) {
          const formattedData = data[selectedYear].map((item) => ({
            que: item.value,
            label: item.label,
          }));
          setChartData(formattedData);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [selectedYear]);

  const handleMouseEnter = (label) => {
    setTooltipText(label);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipText('');
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div className="flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title style={{ fontFamily: 'Manrope-900' }}>Label's Data</Title>
          <a data-tooltip-id="my-anchor-element_labels">💎</a>
          <Tooltip id="my-anchor-element_labels">
            <p>The pie chart shows the ratio of different types of tasks, 1 color - 1 category of tasks</p>
          </Tooltip>
        </div>
        <div className="space-x-2">
          {availableYears.map((year) => (
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
      <DonutChart data={chartData} category="que" index="label" />
    </Card>
  );
};

export default ChartsLabels;
