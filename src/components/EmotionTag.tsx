
import React from 'react';
import { cn } from '@/lib/utils';

export type EmotionType = 
  | 'happy' 
  | 'sad' 
  | 'scared' 
  | 'confused' 
  | 'excited' 
  | 'peaceful' 
  | 'anxious' 
  | 'nostalgic';

interface EmotionTagProps {
  emotion: EmotionType;
  selected: boolean;
  onClick: (emotion: EmotionType) => void;
}

const EMOTION_MAP: Record<EmotionType, { label: string; emoji: string }> = {
  happy: { label: 'Happy', emoji: '😊' },
  sad: { label: 'Sad', emoji: '😢' },
  scared: { label: 'Scared', emoji: '😨' },
  confused: { label: 'Confused', emoji: '😕' },
  excited: { label: 'Excited', emoji: '🤩' },
  peaceful: { label: 'Peaceful', emoji: '😌' },
  anxious: { label: 'Anxious', emoji: '😰' },
  nostalgic: { label: 'Nostalgic', emoji: '🥹' },
};

const EmotionTag: React.FC<EmotionTagProps> = ({ emotion, selected, onClick }) => {
  const { label, emoji } = EMOTION_MAP[emotion];
  
  return (
    <div className="emotion-tag">
      <input
        type="checkbox"
        id={`emotion-${emotion}`}
        className="hidden"
        checked={selected}
        onChange={() => onClick(emotion)}
      />
      <label
        htmlFor={`emotion-${emotion}`}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300",
          "bg-black/50 hover:bg-black/70 border border-dream-purple/30",
          selected ? "bg-dream-purple text-white shadow-lg" : "text-white"
        )}
      >
        <span>{emoji}</span>
        <span>{label}</span>
      </label>
    </div>
  );
};

export default EmotionTag;
