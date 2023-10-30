import React, { useEffect, useState } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';

const ChartStates = () => {
  const [chartData, setChartData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    fetch('github_issues.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.state.map((item) => ({
          que: item.value,
          state: item.state,
        }));
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleMouseEnter = (state) => {
    setTooltipText('The pie chart shows the ratio between open and closed tasks in the project');
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipText('');
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <Title>States Data</Title>
      </div>
      {showTooltip && (
        <div className="tooltip">
          Visualizes open and closed GitHub issues, offering a quick overview of project status. Color-coded for clarity, with hover tooltips for details. Efficient for instant assessment and task prioritization.
        </div>
      )}
      <DonutChart data={chartData} category="que" index="state" />
    </Card>
  );
};

export default ChartStates;
