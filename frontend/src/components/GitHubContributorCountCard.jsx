import React, { useEffect, useState } from 'react';
import { Card, Metric } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const AgentQueCard = () => {
  const [loginCount, setLoginCount] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/github_contributors"); // Replace with the correct API endpoint
        if (!response.ok) {
          throw new Error('Error');
        }
        const jsonData = await response.json();
        const contributorCount = jsonData.result;
        setLoginCount(contributorCount);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Metric style = {{fontSize: '15px', fontFamily:'Manrope-900'}}>Contributor's Value</Metric>
          <a data-tooltip-id="my-anchor-element_mpanel">💎</a>
        <Tooltip id="my-anchor-element_mpanel">
          <p>The card shows the number</p>
          <p>of all active developers</p>
        </Tooltip>
      </div>
      <Metric style={{ fontSize: '27px', fontFamily: 'Manrope-900' }}>
        {loginCount !== null ? loginCount : "Loading..."}
      </Metric>
    </Card>
  );
};

export default AgentQueCard;
