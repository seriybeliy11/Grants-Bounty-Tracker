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

  const handleMouseEnter = () => {
    setShowTooltip(true);
    setTooltipText("A graph with task numbers on the X-axis and their costs on the Y-axis provides a compact representation of the cost of each task in the project.");
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipText("");
  };

  return (
    <div>
      {rewardsData && (
        <Card style={{borderRadius: '16px'}}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Title style={{fontFamily: 'Manrope-900'}}>Reward's Data</Title>
              <a data-tooltip-id="my-anchor-element">💎</a>
              <Tooltip id="my-anchor-element">
                  <p>The graph presents information about the number of actions of the named contributors.</p>
                  <p>On the x-axis, the nicknames of the contributors are listed,</p>
                  <p>while the y-axis represents the quantity of contributions to the organization.</p>
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
