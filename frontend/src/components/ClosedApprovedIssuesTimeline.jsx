import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function ApprovedIssuesComponent() {
  const [approvedIssuesData, setApprovedIssuesData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/approved_issues`);
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;
        setApprovedIssuesData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {approvedIssuesData && (
        <Card style={{ borderRadius: '16px' }}>
          <div style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{ fontFamily: 'Manrope-900' }}>Closed Approved Issues</Title>
              <a data-tooltip-id="my-anchor-element_sla">💎</a>
              <Tooltip id="my-anchor-element_sla">
                <p>This line graph shows the number of</p>
                <p>closed and paid tasks at a point in time</p>
              </Tooltip>
            </div>
            <AreaChart
              className="h-72 mt-4"
              data={approvedIssuesData}
              index="Date"
              categories={["Closed Approved Issues"]}
              colors={["sky"]}
              curveType="monotone"
            />
          </div>
        </Card>
      )}
    </div>
  );
}

export default ApprovedIssuesComponent;
