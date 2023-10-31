import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function IssuesAllComponent() {
  const [allIssuesData, setAllIssuesData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("./github_all_issues.json");
        if (!response.ok) {
          throw new Error('Error');
        }
        const jsonData = await response.json();
        setAllIssuesData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {allIssuesData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{fontFamily: 'Manrope-900'}}>All Issues Timeline</Title>
            <a data-tooltip-id="my-anchor-element_states">💎</a>
              <Tooltip id="my-anchor-element_states">
                  <p>A line graph shows the number of all existing tasks at a given point in time</p>
              </Tooltip>
          </div>
          <AreaChart
            className="mt-6"
            data={allIssuesData}
            index="Dates"
            categories={["All Issues"]}
            colors={["sky"]}
            curveType="monotone"
            yAxisWidth={48}
          />
        </Card>
      )}
    </div>
  );
}

export default IssuesAllComponent;
