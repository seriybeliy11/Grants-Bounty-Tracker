import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function IssuesAllComponent() {
  const [allIssuesData, setAllIssuesData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/count_issues"); // Replace with the correct API endpoint
        if (!response.ok) {
          throw new Error('Error');
        }
        const jsonData = await response.json();
        const parsedValueData = jsonData.result;
        setAllIssuesData(parsedValueData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card style={{ borderRadius: '16px' }}>
      {allIssuesData && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{ fontFamily: 'Manrope-900' }}>All Issues Timeline</Title>
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
        </div>
      )}
    </Card>
  );
}

export default IssuesAllComponent;
