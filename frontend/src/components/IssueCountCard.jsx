import React, { useEffect, useState } from 'react';
import { Card, Metric } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const IssuesQueCard = () => {
  const [totalIssuesValue, setTotalIssuesValue] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/issue_type"); // Замените на правильный URL для вашего сервера
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
        <a data-tooltip-id="my-anchor-element_stst">💎</a>
        <Tooltip id="my-anchor-element_stst">
          <p>The card shows the number of all tasks that have ever existed</p>
        </Tooltip>
      </div>
      <Metric style={{ fontSize: '27px', fontFamily: 'Manrope-900' }}>
        {totalIssuesValue}
      </Metric>
    </Card>
  );
};

export default IssuesQueCard;
