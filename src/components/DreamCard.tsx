import React from 'react';
import type { Dream } from '@/utils/dreamStorage';
import { EmotionType } from '@/components/EmotionTag';
import { Star } from 'lucide-react';

interface DreamCardProps {
  dream: Dream;
}

const EMOTION_EMOJIS: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  scared: '😨',
  confused: '😕',
  excited: '🤩',
  peaceful: '😌',
  anxious: '😰',
  nostalgic: '🥹',
};

const DreamCard: React.FC<DreamCardProps> = ({ dream }) => {
  const formattedDate = new Date(dream.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = new Date(dream.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm text-white font-medium">{formattedDate}</div>
          <div className="text-xs text-white/60">{formattedTime}</div>
        </div>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5"
              fill={i < dream.rating ? "#FFDE59" : "transparent"}
              stroke={i < dream.rating ? "#FFDE59" : "#666"}
            />
          ))}
        </div>
      </div>
      
      <p className="text-white mt-2 text-sm line-clamp-3">
        {dream.description}
      </p>
      
      {dream.emotions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {dream.emotions.map(emotion => (
            <span
              key={emotion}
              className="text-xs bg-dream-purple/20 text-dream-purple px-2 py-0.5 rounded-full flex items-center"
            >
              <span className="mr-1">{EMOTION_EMOJIS[emotion]}</span>
              {emotion}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default DreamCard;
