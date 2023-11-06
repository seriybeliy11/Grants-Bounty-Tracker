import React, { useState } from 'react';
import './App.css';
import RewardsComponent from './components/RewardDashboard.jsx';
import ContributorsComponent from './components/ContributorsDashboard';
import IssuesAllComponent from './components/AllIssuesTimeline';
import JustClosedIssuesComponent from './components/ClosedIssuesTimeline';
import ApprovedIssuesComponent from './components/ClosedApprovedIssuesTimeline';
import AgentQueCard from './components/ContributorCountCard';
import BestAgentCard from './components/BestAgentCard';
import IssuesQueCard from './components/IssueCountCard';
import ThreatenedSpeciesQueChart from './components/TaskDurationBarChart';
import CommentersComponent from './components/CommentersDashboard';
import ThemeButton from './components/ThemeToggleButton';
import ChartStates from './components/StatesDonutChartCard';
import ChartsLabels from './components/LabelStatsChart';
import { Title } from "@tremor/react";


function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const containerClassName = isDarkTheme ? 'dark' : '';
  const headerClassName = isDarkTheme ? 'dark' : '';
  const contentClassName = isDarkTheme ? 'dark' : '';

  return (
    <div className={`app-container ${containerClassName}`}>
      <div className={`header ${headerClassName}`}>
        <div className="toolb">
          <ThemeButton />
        </div>
        <Title style={{ fontFamily: 'Manrope-900', fontSize: '59px', lineHeight: '28px', marginBottom: '80px' }}>
          Grants & Bounties
        </Title>
        <Title style={{ fontFamily: 'Manrope-900' }} className="options">
          Activity monitoring system in the TON Society organization
        </Title>
      </div>
      <main className="main-content">
        <div className={`content-container ${contentClassName}`}>
          {/* Main metrics */}
          <div className="main-metrics-text">
            <Title style={{ fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px' }}>Main metric's</Title>
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

          {/* Issues metrics */}
          <div className="c-agent-component">
            <ContributorsComponent />
          </div>
          <div className="issues-metrics-text">
            <Title style={{ fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px' }}>Issues metric's</Title>
          </div>
          <div className="c-agent-component">
            <ThreatenedSpeciesQueChart />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <ChartStates />
            <ChartsLabels />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <ApprovedIssuesComponent />
            <JustClosedIssuesComponent />
            <IssuesAllComponent />
          </div>

          {/* Rewards metrics */}
          <div className="rewards-metrics-text">
            <Title style={{ fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px' }}>Rewards metric's</Title>
          </div>
          <div className="c-agent-component">
            <RewardsComponent />
          </div>

          {/* Commenters metrics */}
          <div className="commenters-metrics-text">
            <Title style={{ fontFamily: 'Manrope-900', fontSize: '22px', lineHeight: '28px' }}>Commenter's metric's</Title>
          </div>
          <div className="c-agent-component">
            <CommentersComponent />
          </div>
        </div>
        <footer className="bg-opacity-0 rounded-t-lg mt-10 py-6 px-4 flex justify-between items-center border-t-10 border-black">
          <div className="w-1/3 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
            <h3 className="text-lg font-semibold">Creators</h3>
            <span className="block leading-8">delovoyhomie</span>
            <span className="block leading-8">seriybeliy11</span>
          </div>
          <div className="w-1/3 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <span className="block leading-8">@delovoyhomie (tg)</span>
            <span className="block leading-8">@acaedb (tg)</span>
          </div>
          <div className="w-1/3 text-center text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
            <p className="text-lg" style={{ fontFamily: 'Manrope-700' }}>
              <span className="text-base">Know your Step</span>
            </p>
          </div>
        </footer>
        <hr className="border-b-1 border-black"></hr>
        <div className="flex justify-between items-center mt-4">
          <div className="left-column">
            <img src="images/logo.png" alt="Logo" className="w-6 h-6" />
          </div>
          <div className="text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis flex items-center h-full">
            <p style={{ fontFamily: 'Manrope-700' }}>TON Society. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
