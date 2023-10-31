import React, { useState, useEffect } from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

const dataFormatter = (number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

function RewardsComponent() {
  const [rewardsData, setRewardsData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  useEffect(() => {
    try {
      fetch("./rewards.json")
        .then((res) => res.json())
        .then((jsonData) => setRewardsData(jsonData))
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <div>
      {rewardsData && (
        <Card style={{borderRadius: '16px'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{fontFamily: 'Manrope-900'}}>Reward's Data</Title>
              <a data-tooltip-id="my-anchor-element_rewards">💎</a>
              <Tooltip id="my-anchor-element_rewards">
                  <p>The line graph shows on the x-axis the numbers of tasks and on the y-axis the reward amounts for each task in dollars</p>
              </Tooltip>
            </div>
            <AreaChart
            className="h-72 mt-4"
            data={rewardsData}
            index="Issue Number"
            categories={["Rewards (th. $)"]}
            colors={["sky"]}
            valueFormatter={dataFormatter}
            curveType="monotone"
          />
        </Card>
      )}
    </div>
  );
}

export default RewardsComponent;
