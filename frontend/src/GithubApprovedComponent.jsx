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

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      {ApprovedIssuesData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{alignItems: 'center', justifyContent: 'center'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{fontFamily: 'Manrope-900'}}>Closed Approved Issues Timeline</Title>
              <a data-tooltip-id="my-anchor-element">💎</a>
                <Tooltip id="my-anchor-element">
                    <p>The graph presents information about the number of actions of the named contributors.</p>
                    <p>On the x-axis, the nicknames of the contributors are listed,</p>
                    <p>while the y-axis represents the quantity of contributions to the organization.</p>
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
