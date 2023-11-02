import React, { useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionList } from "@tremor/react";

const MyAccordionComponent = () => {
  const [accordionData, setAccordionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/accordionData.json");
        const data = await response.json();
        setAccordionData(data);
      } catch (error) {
        console.error("Error fetching accordion data:", error);
      }
    };

    fetchData();
  }, []); 

  return (
    <AccordionList>
      {accordionData.map((item, index) => (
        <Accordion key={index}>
          <AccordionHeader>{item.header}</AccordionHeader>
          <AccordionBody>{item.body}</AccordionBody>
        </Accordion>
      ))}
    </AccordionList>
  );
};

export default MyAccordionComponent;
