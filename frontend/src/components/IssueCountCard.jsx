import React, { useEffect, useState } from 'react';
import { Card, Metric } from "@tremor/react";

const IssuesQueCard = () => {
  const [totalIssuesValue, setTotalIssuesValue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/issue_type`);
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();

        const result = data.result;

        const years = Object.keys(result);
        let totalValue = 0;

        years.forEach(year => {
          const yearData = result[year];
          const closedIssuesValue = yearData.find(item => item.state === 'closed').value;
          const openIssuesValue = yearData.find(item => item.state === 'open').value;
          totalValue += closedIssuesValue + openIssuesValue;
        });

        setTotalIssuesValue(totalValue);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Metric style={{ fontSize: '15px', fontFamily: 'Manrope-900' }}>Issue's Value</Metric>
      </div>
      <Metric style={{ fontSize: '27px', fontFamily: 'Manrope-900' }}>
        {totalIssuesValue !== null ? totalIssuesValue : "Loading..."}
      </Metric>
    </Card>
  );
};

export default IssuesQueCard;
