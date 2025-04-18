'use client';


import { useState } from "react";

interface TabProps {
  titles: string[];
  contents: React.ReactNode[];
}

const Tab: React.FC<TabProps> = ({ titles, contents }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="w-full flex gap-5">
        {titles.map((title, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={` cursor-pointer capitalize font-bold transition-all 
              ${activeTab === index ? "text-primary-2" : ""}
              py-2 rounded-sm transition duration-200
            `}
          >
            <h2>{title}</h2>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="outlet w-full bg-white lg:mt-10 sm:mt-8">
        {contents[activeTab]}
      </div>
    </div>
  );
};

export default Tab;
