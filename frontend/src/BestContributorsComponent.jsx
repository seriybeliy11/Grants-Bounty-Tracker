import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold, Subtitle } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const BestAgentCard = () => {
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
        <Metric style = {{fontSize: '15px', fontFamily: 'Manrope-900'}}>Best Contributor</Metric>
        <a data-tooltip-id="my-anchor-element_mx">💎</a>
            <Tooltip id="my-anchor-element_mx">
                <p>this card shows the total</p>
                <p>number of active</p>
                <p>developers in the organization</p>
            </Tooltip>
      </div>
      <Metric style = {{fontSize: '27px', fontFamily: 'Manrope-900'}}>{maxContributorLogin}</Metric>
    </Card>
  );
};

export default BestAgentCard;
