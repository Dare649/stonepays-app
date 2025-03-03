import React from 'react';

interface MetaInfo {
  id: number;
  title: string;
  ans: string;
}

interface MetaProps {
  meta?: MetaInfo[];
  reviews?: number;
}

const Meta: React.FC<MetaProps> = ({ meta = [], reviews = 0 }) => {
  return (
    <div className="w-full">
      <h2 className='font-bold text-gray-400 capitalize my-5'>reviews ({reviews})</h2>
      {meta.map((item) => (
        <div key={item.id} className="flex items-center gap-x-2">
          <h2 className="uppercase font-bold">{item.title}:</h2>
          <p className="capitalize">{item.ans}</p>
        </div>
      ))}
    </div>
  );
};

export default Meta;
