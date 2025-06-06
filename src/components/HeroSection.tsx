import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Book, CloudMoon, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import DreamModal from './DreamModal';
import DreamCard from './DreamCard';
import DreamDetailModal from './DreamDetailModal';
import { loadDreams, type Dream, addDream } from '@/utils/dreamStorage';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const HeroSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [hasDreams, setHasDreams] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [description, setDescription] = useState('');
  const [quickLogDream, setQuickLogDream] = useState<{description: string} | null>(null);
  
  useEffect(() => {
    loadAllDreams();
  }, []);
  
  const loadAllDreams = () => {
    const loadedDreams = loadDreams();
    setDreams(loadedDreams);
    setHasDreams(loadedDreams.length > 0);
  };
  
  const handleDreamLogged = () => {
    loadAllDreams();
  };

  const openDetailModal = (dream: Dream) => {
    setSelectedDream(dream);
    setIsDetailModalOpen(true);
  };

  const handleQuickLog = () => {
    if (description.trim().length < 50) {
      toast.error('Please enter at least 50 characters');
      return;
    }

    setQuickLogDream({description});
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 py-8 lg:py-16">
      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
        <CloudMoon className="w-16 h-16 mx-auto text-dream-purple animate-float" />
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          Record Your Nightly Adventures
        </h1>
        
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Capture your dreams before they fade away. Your personal dream journal helps you remember and understand the mysterious world of your subconscious.
        </p>
        
        <div className="pt-4 w-full">
          <div className="relative bg-black/20 backdrop-blur-sm border border-dream-purple/20 rounded-2xl p-1 w-full">
            <Textarea
              placeholder="Describe your dream... (min 50 characters)"
              className="min-h-[225px] w-full p-4 rounded-xl border-none bg-transparent text-white focus:ring-0 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-end mt-4">
            <Button 
              onClick={handleQuickLog}
              disabled={description.trim().length < 50}
              className="log-button bg-dream-purple hover:bg-dream-purple/90 text-white font-medium px-6 py-6 text-lg rounded-full shadow-md w-full"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Capture Dream
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recent Dreams Timeline */}
      <div className={cn(
        "w-full max-w-2xl mx-auto mt-12 md:mt-16 transition-all duration-500",
        hasDreams ? "opacity-100" : "opacity-0 pointer-events-none h-0"
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display text-white">Your Dream Timeline</h2>
          <Link 
            to="/archive" 
            className="text-dream-purple hover:text-dream-purple/80 flex items-center text-sm font-medium"
          >
            <Book className="w-4 h-4 mr-1" />
            View Archive
          </Link>
        </div>
        
        <div className="space-y-4 w-full">
          {dreams.map(dream => (
            <div 
              key={dream.id}
              className="dream-card p-4 rounded-xl cursor-pointer hover:bg-card/80 transition-all w-full"
              onClick={() => openDetailModal(dream)}
            >
              <DreamCard dream={dream} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dream Modals */}
      <DreamModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setQuickLogDream(null);
        }} 
        onDreamLogged={handleDreamLogged}
        initialDescription={quickLogDream?.description || ''}
      />
      
      <DreamDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        dream={selectedDream}
        onDreamDeleted={handleDreamLogged}
      />
    </div>
  );
};

export default HeroSection;
