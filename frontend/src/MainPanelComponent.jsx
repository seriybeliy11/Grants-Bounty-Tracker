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
          <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
              </Tooltip>
        </div>
        <Metric style = {{fontSize: '27px', fontFamily:'Manrope-900'}}>{loginCount}</Metric>
      </Card>
    </div>
  );
};

export default AgentQueCard;
