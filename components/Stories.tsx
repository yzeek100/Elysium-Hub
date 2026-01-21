import React from 'react';
import { Creator } from '../types';

interface StoriesProps {
  creators: Creator[];
  onCreatorClick: (id: string) => void;
}

const Stories: React.FC<StoriesProps> = ({ creators, onCreatorClick }) => {
  const onlineCreators = creators.filter(c => c.online).slice(0, 15);

  if (onlineCreators.length === 0) return null;

  return (
    <div className="w-full py-2">
      <div className="flex gap-5 overflow-x-auto no-scrollbar px-4 md:px-0">
        {onlineCreators.map(creator => (
          <button 
            key={creator.id}
            onClick={() => onCreatorClick(creator.id)}
            className="flex flex-col items-center gap-2 group shrink-0"
          >
            <div className="relative p-[3px] rounded-full story-gradient group-hover:scale-105 transition-transform duration-300">
              <div className="p-[2px] bg-white rounded-full">
                <img 
                  src={creator.avatar} 
                  alt={creator.name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-700 max-w-[70px] truncate">
              {creator.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Stories;