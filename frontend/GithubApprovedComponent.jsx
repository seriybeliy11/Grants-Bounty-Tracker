import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function ApprovedIssuesComponent() {
  const [ApprovedIssuesData, SetApprovedIssuesData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      fetch("./github_closed_approved_issues.json")
        .then((res) => res.json())
        .then((jsonData) => SetApprovedIssuesData(jsonData))
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <div>
      {ApprovedIssuesData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{fontFamily: 'Manrope-900'}}>Closed Approved Issues Timeline</Title>
              <a data-tooltip-id="my-anchor-element_sla">💎</a>
                <Tooltip id="my-anchor-element_sla">
                    <p>This line graph shows the</p>
                    <p>number of closed and</p>
                    <p>paid tasks at a point</p> 
                    <p>in time</p>
                </Tooltip>
            </div>
            <AreaChart
              className="h-72 mt-4"
              data={ApprovedIssuesData}
              index="Dates"
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
