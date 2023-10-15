import React, { useEffect, useState } from 'react';
import { Card, Metric, Text, Bold } from "@tremor/react";

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
        console.error("Ошибка при загрузке JSON-файла:", error);
      });
  }, []);

  return (
    <Card>
      <Metric style = {{fontSize: '13px'}}>📌Issue's Value</Metric>
      <Metric style = {{fontSize: '22px'}}>{totalIssuesValue}</Metric>
    </Card>
  );
};

export default IssuesQueCard;
