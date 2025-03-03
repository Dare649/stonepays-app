'use client'

import { useState } from "react";

interface TabProps {
  content1?: React.ReactNode;
  content2?: React.ReactNode;
  content3?: React.ReactNode;
  content4?: React.ReactNode;
  content5?: React.ReactNode;


  title1?: string;
  title2?: string;
  title3?: string;
  title4?: string;
  title5?: string;

}

const Tab: React.FC<TabProps> = ({ content1, content2, content3, content4, content5, title1, title2, title3, title4, title5 }) => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3" | "tab4" | "tab5">("tab1");

  return (
    <div className="w-full">
      {/* Tab Header */}
      <div className="w-full lg:py-0 flex overflow-hidden ">
        {[{ id: "tab1", title: title1 }, { id: "tab2", title: title2 } , { id: "tab3", title: title3 } ,{ id: "tab4", title: title4 } ,{ id: "tab5", title: title5 } ].map((tab, index, arr) => (
          <h1
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "tab1" | "tab2" | "tab3" | "tab4" | "tab5")}
            className={`flex-1 text-center cursor-pointer capitalize font-bold transition-all 
              ${activeTab === tab.id ? "text-primary-2 " :  ""}
              
            `}
          >
            {tab.title}
          </h1>
        ))}
      </div>
      {/* Tab Content */}
      <div className="outlet w-full bg-white lg:mt-10 sm:mt-8 border-8 border-gray-200 lg:p-5 sm:p-3 rounded-4xl">
        {activeTab === "tab1" && <div className="duration-500">{content1}</div>}
        {activeTab === "tab2" && <div>{content2}</div>}
        {activeTab === "tab3" && <div>{content3}</div>}
        {activeTab === "tab4" && <div>{content4}</div>}
        {activeTab === "tab5" && <div>{content5}</div>}
      </div>
    </div>
  );
};

export default Tab;
