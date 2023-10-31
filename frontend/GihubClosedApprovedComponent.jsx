import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function JustClosedIssuesComponent() {
  const [justClosedIssuesData, setJustClosedIssuesData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("./github_just_closed_issues.json");
        if (!response.ok) {
          throw new Error('Error');
        }
        const jsonData = await response.json();
        setJustClosedIssuesData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      {justClosedIssuesData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{fontFamily: 'Manrope-900'}}>Just Closed Issues Timeline</Title>
            <a data-tooltip-id="my-anchor-element_cla">💎</a>
              <Tooltip id="my-anchor-element_cla">
                  <p>This line graph shows the number of closed unpaid tasks at the moment of time</p>
              </Tooltip>
          </div>
          <AreaChart
            className="h-72 mt-4"
            data={justClosedIssuesData}
            index="Dates"
            categories={["Closed Issues"]}
            colors={["sky"]}
            curveType="monotone"
          />
        </Card>
      )}
    </div>
  );
}

export default JustClosedIssuesComponent;
