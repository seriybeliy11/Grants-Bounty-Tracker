import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold, Title } from "@tremor/react";

const AgentQueCard = () => {
  const [loginCount, setLoginCount] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetch('./data_contributors.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const count = jsonData.length;
        setLoginCount(count);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card>
        <Metric style = {{fontSize: '13px'}}>👨‍👨‍👦‍👦Contributor's Value</Metric>
        <Metric style = {{fontSize: '22px'}}>{loginCount}</Metric>
      </Card>
    </div>
  );
};

export default AgentQueCard;
