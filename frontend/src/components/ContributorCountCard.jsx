import React, { useEffect, useState } from 'react';
import { Card, Metric } from "@tremor/react";

const AgentQueCard = () => {
  const [loginCount, setLoginCount] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/github_contributors`);
        if (!response.ok) {
          throw new Error('Error');
        }
        const jsonData = await response.json();
        const contributorCount = jsonData.result;
        setLoginCount(contributorCount.length);
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
      </div>
      <Metric style={{ fontSize: '27px', fontFamily: 'Manrope-900' }}>
        {loginCount !== null ? loginCount : "Loading..."}
      </Metric>
    </Card>
  );
};

export default AgentQueCard;
