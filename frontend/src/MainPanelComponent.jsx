import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold, Title } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

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
      <Card style={{borderRadius: '16px'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Metric style = {{fontSize: '15px', fontFamily:'Manrope-900'}}>Contributor's Value</Metric>
          <a data-tooltip-id="my-anchor-element_mpanel">💎</a>
              <Tooltip id="my-anchor-element_mpanel">
                  <p>The card shows the number</p>
                  <p>of all active developers</p>
              </Tooltip>
        </div>
        <Metric style = {{fontSize: '27px', fontFamily:'Manrope-900'}}>{loginCount}</Metric>
      </Card>
    </div>
  );
};

export default AgentQueCard;
