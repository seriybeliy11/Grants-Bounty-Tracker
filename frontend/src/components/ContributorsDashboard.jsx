import { Card, Title, BarChart, Subtitle } from '@tremor/react';
import React, { useState, useEffect } from 'react';

function ContributorsComponent() {
  const [contributorsData, setContributorsData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/github_contributors");
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;
        setContributorsData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {contributorsData && (
        <Card style={{ borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title style={{ fontFamily: 'Manrope-900' }}>Contributors Data</Title>
          </div>
          <Subtitle style={{ fontFamily: 'Manrope-600' }}>
            The bar chart presents information about the number of actions of the named contributors
          </Subtitle>
          <BarChart
            className="h-72 mt-4"
            data={contributorsData}
            index="login"
            categories={["Contributions"]}
            colors={["sky"]}
          />
        </Card>
      )}
    </div>
  );
}

export default ContributorsComponent;
