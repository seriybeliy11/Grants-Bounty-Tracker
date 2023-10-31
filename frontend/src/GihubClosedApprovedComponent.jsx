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
            <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
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
