import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import React, { useState, useEffect } from 'react';

function ContributorsComponent() {
  const [contributorsData, setContributorsData] = useState(null);

  useEffect(() => {
    try {
      fetch("./data_contributors.json")
        .then((res) => res.json())
        .then((jsonData) => setContributorsData(jsonData))
        .catch((error) => {
          console.error("Ошибка загрузки данных из data_contributors.json:", error);
        });
    } catch (error) {
      console.error("Произошла ошибка при обработке данных:", error);
    }
  }, []);

  return (
    <div>
      {contributorsData && (
        <Card>
          <Title>Contributors Data</Title>
          <Subtitle>The graph presents information about the number of actions of the named contributors</Subtitle>
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
