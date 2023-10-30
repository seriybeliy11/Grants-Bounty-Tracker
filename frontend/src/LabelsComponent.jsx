import React, { useState, useEffect } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import 'react-tooltip/dist/react-tooltip.css'

const ChartsLabels = () => {
  const [ChartData, setChartData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    fetch('label_counts.json')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          que: item.value,
          label: item.label,
        }));
        setChartData(formattedData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleMouseEnter = (label) => {
    setTooltipText(label);
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
        <Title>Label's Data</Title>
      </div>
      {showTooltip && (
        <div className="tooltip">
          This circular chart provides an overview of the distribution of GitHub issue labels. Each section of the circle represents a specific label, showcasing the proportionate contribution of different labels to the overall set of issues
        </div>
      )}
      <DonutChart
        data={ChartData}
        category="que"
        index="label"
      />
    </Card>
  );
}

export default ChartsLabels;
