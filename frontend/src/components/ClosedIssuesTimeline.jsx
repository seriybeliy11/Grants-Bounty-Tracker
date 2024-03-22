import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const JustClosedIssuesComponent = () => {
  const [justClosedIssuesData, setJustClosedIssuesData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/closed_issues`);
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;
        setJustClosedIssuesData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {justClosedIssuesData && (
        <Card style={{ borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{ fontFamily: 'Manrope-900' }}>Closed Issues</Title>
            <a data-tooltip-id="my-anchor-element_cla">💎</a>
            <Tooltip id="my-anchor-element_cla">
              <p>This line graph shows the number of</p>
              <p>closed unpaid tasks at the moment of time</p>
            </Tooltip>
          </div>
          <AreaChart
            className="h-72 mt-4"
            data={justClosedIssuesData}
            index="Date"
            categories={["Closed Issues"]}
            colors={["sky"]}
            curveType="monotone"
          />
        </Card>
      )}
    </div>
  );
};

export default JustClosedIssuesComponent;
