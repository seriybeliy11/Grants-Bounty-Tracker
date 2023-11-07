import React, { useEffect, useState } from 'react';
import { Card, Metric } from "@tremor/react";

const BestAgentCard = () => {
  const [maxContributorLogin, setMaxContributorLogin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/github_contributors");
        if (!response.ok) {
          throw new Error('Error');
        }
        const data = await response.json();
        const jsonData = data.result;

        let maxContributions = -Infinity;
        let maxLogin = null;

        jsonData.forEach((contributor) => {
          if (contributor.Contributions > maxContributions) {
            maxContributions = contributor.Contributions;
            maxLogin = contributor.login;
          }
        });

        setMaxContributorLogin(maxLogin);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card style={{ borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Metric style = {{fontSize: '15px', fontFamily: 'Manrope-900'}}>Best Contributor</Metric>
      </div>
      <Metric style={{ fontSize: '27px', fontFamily: 'Manrope-900' }}>
        {maxContributorLogin !== null ? maxContributorLogin : "Loading..."}
      </Metric>
    </Card>
  );
};

export default BestAgentCard;
