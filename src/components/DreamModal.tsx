import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import StarRating from './StarRating';
import EmotionTag, { EmotionType } from './EmotionTag';
import { useToast } from "@/hooks/use-toast";
import { Moon, Sparkles } from 'lucide-react';
import { addDream } from '@/utils/dreamStorage';
import ConfettiEffect from './ConfettiEffect';

interface DreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDreamLogged: () => void;
  initialDescription?: string;
}

const DreamModal: React.FC<DreamModalProps> = ({ isOpen, onClose, onDreamLogged, initialDescription = '' }) => {
  const { toast: uiToast } = useToast();
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(3);
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionType[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [errors, setErrors] = useState<{ description?: string }>({});
  const [showConfetti, setShowConfetti] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription || '');
      setCharCount(initialDescription?.length || 0);
      setRating(3);
      setSelectedEmotions([]);
      setErrors({});
      setShowConfetti(false);
    }
  }, [isOpen, initialDescription]);
  
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);
    setCharCount(value.length);
    
    if (errors.description && value.length >= 50) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  };
  
  const handleEmotionToggle = (emotion: EmotionType) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotion)) {
        return prev.filter(e => e !== emotion);
      } else {
        return [...prev, emotion];
      }
    });
  };
  
  const handleSubmit = () => {
    const newErrors: { description?: string } = {};
    
    if (description.length < 50) {
      newErrors.description = 'Please enter at least 50 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      addDream({
        description,
        emotions: selectedEmotions,
        rating,
        timestamp: new Date().toISOString(),
      });
      
      setShowConfetti(true);
      toast.success('Dream captured successfully!');
      setDescription('');
      
      setTimeout(() => {
        onDreamLogged();
        onClose();
      }, 500);
    } catch (error) {
      uiToast({
        title: "Error",
        description: "Failed to save your dream. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ConfettiEffect active={showConfetti} />
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] p-6 bg-gradient-to-br from-black/80 via-[#1A1A2E]/90 to-[#16213E]/90 backdrop-blur-lg border border-dream-purple/30 shadow-2xl text-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-2xl text-white">
              <Moon className="h-6 w-6 mr-2 text-dream-purple animate-pulse" strokeWidth={1.5} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-dream-purple to-dream-pink">
                Enchant Your Dream
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="dream-form space-y-6 my-4">
            <div className="w-full">
              <label 
                htmlFor="dream-description" 
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Describe your dream
              </label>
              <Textarea
                id="dream-description"
                ref={textareaRef}
                placeholder="What happened in your dream? How did it make you feel?"
                className="min-h-[150px] w-full p-3 rounded-lg border border-dream-purple/40 focus:border-dream-purple/80 focus:ring-0 transition-all duration-300 focus:outline-none bg-black/30 text-white placeholder:text-white/50"
                value={description}
                onChange={handleDescriptionChange}
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className={`${errors.description ? 'text-red-400' : 'text-white/60'}`}>
                  {errors.description || `${charCount < 50 ? `At least ${50 - charCount} more characters needed` : 'Great description!'}`}
                </span>
                <span className={`${charCount > 2000 ? 'text-red-400' : 'text-white/60'}`}>
                  {charCount}/2000
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                How did you feel in this dream?
              </label>
              <div className="flex flex-wrap gap-2">
                {['happy', 'sad', 'scared', 'confused', 'excited', 'peaceful', 'anxious', 'nostalgic'].map((emotion) => (
                  <EmotionTag
                    key={emotion}
                    emotion={emotion as EmotionType}
                    selected={selectedEmotions.includes(emotion as EmotionType)}
                    onClick={handleEmotionToggle}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                How realistic was this dream?
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>
          
          <DialogFooter className="flex gap-3 w-full px-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full border-dream-purple/40 text-white bg-transparent hover:bg-dream-purple/20 hover:border-dream-purple/60 transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-dream-purple to-dream-pink text-white hover:shadow-lg hover:shadow-dream-purple/30 flex items-center justify-center space-x-1 transition-all duration-300 hover:scale-[1.02]"
              disabled={description.length < 50 || description.length > 2000}
            >
              <Sparkles className="h-4 w-4" />
              <span>Capture Dream</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DreamModal;
