import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold } from "@tremor/react";
import { Tooltip } from 'react-tooltip';

const IssuesQueCard = ({ isDarkTheme }) => {
  const [totalIssuesValue, setTotalIssuesValue] = useState(null);

  useEffect(() => {
    fetch('./github_issues.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const closedIssuesValue = jsonData.state.find((item) => item.state === 'closed').value;
        const openIssuesValue = jsonData.state.find((item) => item.state === 'open').value;

        const totalValue = closedIssuesValue + openIssuesValue;

        setTotalIssuesValue(totalValue);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <Card style={{borderRadius: '16px'}}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Metric style = {{fontSize: '15px', fontFamily: 'Manrope-900'}}>Issue's Value</Metric>
        <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
              </Tooltip>
      </div>
      <Metric style = {{fontSize: '27px', fontFamily: 'Manrope-900'}}>{totalIssuesValue}</Metric>
    </Card>
  );
};

export default IssuesQueCard;
