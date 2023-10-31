import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold, Subtitle } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const DurateAgentCard = () => {
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
        <Metric style = {{fontSize: '15px', fontFamily: 'Manrope-900'}}>Average Duration</Metric>
        <a data-tooltip-id="my-anchor-elementAVD">💎</a>
            <Tooltip id="my-anchor-elementAVD">

            </Tooltip>
      </div>
      <Metric style = {{fontSize: '27px', fontFamily: 'Manrope-900'}}>324 days</Metric>
    </Card>
  );
};

export default DurateAgentCard;
