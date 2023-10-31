import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

function ContributorsComponent() {
  const [contributorsData, setContributorsData] = useState(null);

  useEffect(() => {
    try {
      fetch("./data_contributors.json")
        .then((res) => res.json())
        .then((jsonData) => setContributorsData(jsonData))
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  return (
    <div>
      {contributorsData && (
        <Card style={{borderRadius: '16px'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{fontFamily: 'Manrope-900'}}>Contributors Data</Title>
            <a data-tooltip-id="my-anchor-element">💎</a>
            <Tooltip id="my-anchor-element">
                <p>The graph presents information about the number of actions of the named contributors.</p>
                <p>On the x-axis, the nicknames of the contributors are listed,</p>
                <p>while the y-axis represents the quantity of contributions to the organization.</p>
            </Tooltip>
          </div>
          <Subtitle style={{fontFamily: 'Manrope-600'}}>The graph presents information about the number of actions of the named contributors</Subtitle>
          <BarChart
            className="h-72 mt-4"
            data={contributorsData}
            index="login"
            categories={["contributions"]}
            colors={["sky"]}
          />
        </Card>
      )}
    </div>
  );
}

export default ContributorsComponent;
