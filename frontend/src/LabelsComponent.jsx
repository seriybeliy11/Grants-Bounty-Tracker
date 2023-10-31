import React, { useState, useEffect } from 'react';
import { Card, Title, DonutChart } from '@tremor/react';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip';

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
    <Card style={{borderRadius: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title style={{fontFamily: 'Manrope-900'}}>Label's Data</Title>
        <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
              </Tooltip>
      </div>
      <DonutChart
        data={ChartData}
        category="que"
        index="label"
      />
    </Card>
  );
}

export default ChartsLabels;
