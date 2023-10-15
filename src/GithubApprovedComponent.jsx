import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';

function ApprovedIssuesComponent() {
  const [ApprovedIssuesData, SetApprovedIssuesData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      fetch("./github_closed_approved_issues.json")
        .then((res) => res.json())
        .then((jsonData) => SetApprovedIssuesData(jsonData))
        .catch((error) => {
          console.error("Ошибка загрузки данных из rewards.json:", error);
        });
    } catch (error) {
      console.error("Произошла ошибка при обработке данных:", error);
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
        <Card>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <Title>Closed Approved Issues Timeline</Title>
          </div>
          {showTooltip && (
            <div className="tooltip">
              This chart visualizes the timeline of GitHub issues that have been both confirmed and paid for. The Y-axis represents the number of closed, paid issues, while the X-axis indicates the corresponding dates
            </div>
          )}
          <AreaChart
            className="h-72 mt-4"
            data={ApprovedIssuesData}
            index="Dates"
            categories={["Closed Approved Issues"]}
            colors={["sky"]}
            curveType="monotone"
          />
        </Card>
      )}
    </div>
  );
}

export default ApprovedIssuesComponent;
