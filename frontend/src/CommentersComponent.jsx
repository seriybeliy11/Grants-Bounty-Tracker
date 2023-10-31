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
            <a data-tooltip-id="my-anchor-element_commenters">💎</a>
            <Tooltip id="my-anchor-element_commenters">
                <p>Bar chart shows on the x-axis the number of tasks, on the y-axis - the number of comments for each task</p>
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
