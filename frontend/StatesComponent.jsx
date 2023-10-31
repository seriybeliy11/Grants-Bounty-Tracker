import React, { useEffect, useState } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

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

  return (
    <Card style={{borderRadius: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title style={{fontFamily: 'Manrope-900'}}>States Data</Title>
        <a data-tooltip-id="my-anchor-element_sqqw">💎</a>
              <Tooltip id="my-anchor-element_sqqw">
                  <p>The pie chart shows the ratio of closed to open tasks</p>
              </Tooltip>
      </div>
      <DonutChart data={chartData} category="que" index="state" />
    </Card>
  );
};

export default ChartStates;
