import React, { useState, useEffect } from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { Tooltip } from 'react-tooltip';

function CommentersComponent() {
  const [ContributorsData, setContribData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      fetch("./commentators.json")
        .then((res) => res.json())
        .then((jsonData) => setContribData(jsonData))
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div>
      {ContributorsData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{fontFamily: 'Manrope-900'}}>Commenters Data</Title>
            <a data-tooltip-id="my-anchor-element">💎</a>
            <Tooltip id="my-anchor-element">
                <p>The graph presents information about the number of actions of the named contributors.</p>
                <p>On the x-axis, the nicknames of the contributors are listed,</p>
                <p>while the y-axis represents the quantity of contributions to the organization.</p>
            </Tooltip>
          </div>
          <BarChart
            className="h-72 mt-4"
            data={ContributorsData}
            index="issue"
            categories={["Comments"]}
            colors={["sky"]}
          />
        </Card>
      )}
    </div>
  );
}

export default CommentersComponent;
