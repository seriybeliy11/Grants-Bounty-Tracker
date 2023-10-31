import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold, Subtitle } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const MXRWAgentCard = () => {
  const [maxContributorLogin, setMaxContributorLogin] = useState(null);

  useEffect(() => {
    fetch('./data_contributors.json')
      .then((response) => response.json())
      .then((jsonData) => {
        let maxContributions = -Infinity;
        let maxLogin = null;

        jsonData.forEach((contributor) => {
          if (contributor.contributions > maxContributions) {
            maxContributions = contributor.contributions;
            maxLogin = contributor.login;
          }
        });

        setMaxContributorLogin(maxLogin);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <Card style={{borderRadius: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Metric style = {{fontSize: '15px', fontFamily: 'Manrope-900'}}>Max Reward Ever</Metric>
        <a data-tooltip-id="my-anchor-element">💎</a>
            <Tooltip id="my-anchor-element">
                <p>The graph presents information about the number of actions of the named contributors.</p>
                <p>On the x-axis, the nicknames of the contributors are listed,</p>
                <p>while the y-axis represents the quantity of contributions to the organization.</p>
            </Tooltip>
      </div>
      <Metric style = {{fontSize: '27px', fontFamily: 'Manrope-900'}}>10,800$</Metric>
    </Card>
  );
};

export default MXRWAgentCard;
