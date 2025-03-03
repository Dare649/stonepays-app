import React from "react";

interface KeyFeatures {
    id: number;
    text: string;
    title: string;
};

interface DescriptionProps {
  desc?: string;
  key_features?: KeyFeatures[];
  reviews?: number;
}

const Description: React.FC<DescriptionProps> = ({ desc, key_features = [], reviews = 0 }) => {
  return (
    <div className="w-full">
        <h2 className='font-bold text-gray-400 capitalize my-5'>reviews ({reviews})</h2>
      {desc ? <p>{desc}</p> : <p>No description available.</p>}
      <div className="mt-10"> 
        {
            key_features.map((item) => (
                <div key={item.id} className="flex items-start">
                    <h2><span className="capitalize font-bold">{item.title}</span>{item.text}</h2>
                </div>

            ))
        }
      </div>
    </div>
  );
};

export default Description;
