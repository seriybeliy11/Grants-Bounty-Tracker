import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';

function IssuesAllComponent() {
  const [allIssuesData, setAllIssuesData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("./github_all_issues.json");
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const jsonData = await response.json();
        setAllIssuesData(jsonData);
      } catch (error) {
        console.error("Произошла ошибка при загрузке данных:", error);
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
      {allIssuesData && (
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
            <Title>All Issues Timeline</Title>
          </div>
          {showTooltip && (
            <div className="tooltip">
              This chart illustrates the cumulative creation of project issues over a period. The Y-axis reflects the total number of created issues, and the X-axis represents different dates
            </div>
          )}
          <AreaChart
            className="h-72 mt-4"
            data={allIssuesData}
            index="Dates"
            categories={["All Issues"]}
            colors={["sky"]}
            curveType="monotone"
          />
        </Card>
      )}
    </div>
  );
}

export default IssuesAllComponent;
