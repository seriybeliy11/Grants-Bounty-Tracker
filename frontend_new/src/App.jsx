import { useState, useEffect } from 'react';
import './App.css';
import RewardsComponent from './LinePlotRewardsComponent.jsx';
import ContributorsComponent from './BarChartContirbutorsComponent';
import IssuesAllComponent from './IssuesAllComponent';
import JustClosedIssuesComponent from './GihubClosedApprovedComponent';
import ApprovedIssuesComponent from './GithubApprovedComponent';
import LabelsComponent from './StatesComponent';
import StatesComponent from './StatesComponent';
import AgentQueCard from './MainPanelComponent';
import BestAgentCard from './BestContributorsComponent';
import IssuesQueCard from './IssuesQueCardComponent';
import { Metric, Title, Subtitle, Bold, Italic, Text } from "@tremor/react";
import ThreatenedSpeciesQueChart from './IssuesSeasonComponent';
import CommentersComponent from './CommentersComponent';
import ThemeButton from './ThmButton';
import ChartStates from './StatesComponent';
import ChartsLabels from './LabelsComponent';
import { Accordion, AccordionHeader, AccordionBody, AccordionList } from "@tremor/react";


function App() {
  const [count, setCount] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const appContainerClassName = isDarkTheme ? 'app-container dark' : 'app-container';
  const headerClassName = isDarkTheme ? 'header dark' : 'header';
  const ContentName = isDarkTheme ? 'content dark' : 'content-container';

  return (
    <div className='app-container'>
        <div className='header'>
          <div className='toolb'>
            <ThemeButton/>
          </div>
            <Title style={{fontFamily: 'Manrope-900', fontSize: '59px', lineHeight: '28px', marginBottom: '80px'}}>Grant's & Bounties</Title>
            <Title style = {{fontFamily: 'Manrope-900'}} className='options'>Activity monitoring system in the TON Society organization</Title>
        </div>
      <main className="main-content">
        <div className='content-container'>
          <div className='main-metrics-text'>
            <Title style={{fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px'}}>Main metric's</Title>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="card">
              <AgentQueCard />
            </div>
            <div className="card">
              <BestAgentCard />
            </div>
            <div className="card">
              <IssuesQueCard />
            </div>
          </div>
          <div className='c-agent-component'>
              <ContributorsComponent/>
          </div>
          <div className='issues-metrics-text'>
            <Title style={{fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px'}}>Issues metric's</Title>
          </div>
          <div className='c-agent-component'>
            <ThreatenedSpeciesQueChart/>
          </div>
          <div className='grid grid-cols-2 gap-6 mt-6'>
            <ChartStates/>
            <ChartsLabels/>
          </div>
          <div className='grid grid-cols-2 gap-6 mt-6'>
            <ApprovedIssuesComponent/>
            <JustClosedIssuesComponent/>
            <IssuesAllComponent/>
          </div>
          <div className='rewards-metrics-text'>
            <Title style={{fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px'}}>Rewards metric's</Title>
          </div>
          <div className='c-agent-component'>
            <RewardsComponent/>
          </div>
          <div className='commenters-metrics-text'>
            <Title style={{fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px'}}>Commenter's metric's</Title>
          </div>
          <div className='c-agent-component'>
            <CommentersComponent/>
          </div>
        </div>
        <footer class="bg-opacity-0 rounded-t-lg mt-10 py-6 px-4 flex justify-between items-center border-t-10 border-black">
        <div class="w-1/3 dark:text-white">
          <h3 class="text-lg font-semibold">Creators</h3>
          <span class="block leading-8">delovoyhomie</span>
          <span class="block leading-8">seriybeliy11</span>
        </div>
        <div class="w-1/3 dark:text-white">
          <h3 class="text-lg font-semibold">Contacts</h3>
          <span class="block leading-8">@acaedb (tg)</span>
          <span class="block leading-8">@delovoyhomie (tg)</span>
        </div>
        <div class="w-1/3 text-center dark:text-white">
        <p class="text-lg" style={{ fontFamily: 'Manrope-700' }}>
          <span class="text-base">Know your Step</span>
          <span class="text-2xl ml-1">📐</span>
        </p>
        </div>
        </footer>
        <hr class="border-b-1 border-black"></hr>
        <div class="flex justify-between items-center mt-4">
          <div class="left-column">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
            <image href="108139178.png" x="0" y="0" height="24" width="24"/>
          </svg>
          </div>
          <div class="dark:text-white flex items-center h-full">
              <p style={{fontFamily: 'Manrope-700'}}>TON Society. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
