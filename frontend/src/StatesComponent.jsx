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

  const handleMouseEnter = (state) => {
    setTooltipText('The pie chart shows the ratio between open and closed tasks in the project');
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipText('');
  };

  return (
    <Card style={{borderRadius: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title style={{fontFamily: 'Manrope-900'}}>States Data</Title>
        <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
              </Tooltip>
      </div>
      <DonutChart data={chartData} category="que" index="state" />
    </Card>
  );
};

export default ChartStates;
