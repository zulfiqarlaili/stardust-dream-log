import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadDreams, downloadCSV, type Dream } from '@/utils/dreamStorage';
import DreamCard from '@/components/DreamCard';
import { Link } from 'react-router-dom';
import { Search, Download, BookHeart, CloudMoon, ArrowDown, ArrowUp } from 'lucide-react';
import { EmotionType } from '@/components/EmotionTag';
import StarRating from '@/components/StarRating';
import DreamDetailModal from '@/components/DreamDetailModal';

const Archive: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmotion, setFilterEmotion] = useState<EmotionType | ''>('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [groupedDreams, setGroupedDreams] = useState<Record<string, Dream[]>>({});
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Load dreams on component mount
  useEffect(() => {
    loadAllDreams();
  }, []);

  const loadAllDreams = () => {
    const allDreams = loadDreams();
    setDreams(allDreams);
    applyFilters(allDreams, searchQuery, filterEmotion, filterRating, sortDirection);
  };

  // Group dreams by month when filtered dreams change
  useEffect(() => {
    const grouped = filteredDreams.reduce((acc, dream) => {
      const date = new Date(dream.timestamp);
      const monthYear = date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(dream);
      return acc;
    }, {} as Record<string, Dream[]>);
    
    setGroupedDreams(grouped);
  }, [filteredDreams]);

  const applyFilters = (
    allDreams: Dream[], 
    query: string, 
    emotion: EmotionType | '', 
    rating: number,
    direction: 'asc' | 'desc'
  ) => {
    let filtered = [...allDreams];
    
    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(dream => 
        dream.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply emotion filter
    if (emotion) {
      filtered = filtered.filter(dream => 
        dream.emotions.includes(emotion)
      );
    }
    
    // Apply rating filter
    if (rating > 0) {
      filtered = filtered.filter(dream => 
        dream.rating >= rating
      );
    }
    
    // Apply sorting (newest/oldest)
    filtered.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return direction === 'desc' ? timeB - timeA : timeA - timeB;
    });
    
    setFilteredDreams(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(dreams, query, filterEmotion, filterRating, sortDirection);
  };

  const handleEmotionFilter = (emotion: EmotionType | '') => {
    setFilterEmotion(emotion);
    applyFilters(dreams, searchQuery, emotion, filterRating, sortDirection);
  };

  const handleRatingFilter = (rating: number) => {
    setFilterRating(rating);
    applyFilters(dreams, searchQuery, filterEmotion, rating, sortDirection);
  };

  const handleSortChange = () => {
    const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirection(newDirection);
    applyFilters(dreams, searchQuery, filterEmotion, filterRating, newDirection);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterEmotion('');
    setFilterRating(0);
    applyFilters(dreams, '', '', 0, sortDirection);
  };

  const openDetailModal = (dream: Dream) => {
    setSelectedDream(dream);
    setIsDetailModalOpen(true);
  };

  const emotions: EmotionType[] = ['happy', 'sad', 'scared', 'confused', 'excited', 'peaceful', 'anxious', 'nostalgic'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <BookHeart className="h-8 w-8 text-dream-purple mr-3" />
          <h1 className="text-3xl font-bold text-white">Dream Archive</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={downloadCSV}
            className="border-dream-purple/30 text-white hover:bg-dream-purple/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link to="/">
            <Button
              variant="ghost"
              className="text-dream-purple hover:text-dream-purple/90 hover:bg-dream-purple/10"
            >
              <CloudMoon className="h-4 w-4 mr-2" />
              New Dream
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card/70 backdrop-blur-sm rounded-xl p-4 mb-8 border border-dream-purple/20 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dream-indigo/60 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search your dreams..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 border-dream-purple/30 focus-visible:ring-dream-purple/30"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-dream-indigo/80">Sort:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSortChange}
              className="border-dream-purple/30 text-dream-indigo"
            >
              {sortDirection === 'desc' ? (
                <>Newest <ArrowDown className="ml-1 h-3 w-3" /></>
              ) : (
                <>Oldest <ArrowUp className="ml-1 h-3 w-3" /></>
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-dream-purple"
            disabled={!searchQuery && !filterEmotion && filterRating === 0}
          >
            Reset Filters
          </Button>
        </div>

        <Tabs defaultValue="emotions" className="mt-4">
          <TabsList className="bg-dream-purple/10">
            <TabsTrigger value="emotions">Filter by Emotion</TabsTrigger>
            <TabsTrigger value="rating">Filter by Rating</TabsTrigger>
          </TabsList>
          <TabsContent value="emotions" className="mt-2">
            <div className="flex flex-wrap gap-2">
              {emotions.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionFilter(filterEmotion === emotion ? '' : emotion)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    filterEmotion === emotion
                      ? 'bg-dream-purple text-white'
                      : 'bg-white/80 text-dream-indigo hover:bg-white border border-dream-purple/20'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="rating" className="mt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-dream-indigo/80">Minimum rating:</span>
              <StarRating value={filterRating} onChange={handleRatingFilter} />
              {filterRating > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRatingFilter(0)}
                  className="text-dream-purple h-7 px-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dreams Display */}
      {filteredDreams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-dream-indigo/60 mb-2">No dreams found</div>
          <p className="text-dream-indigo/80">
            {dreams.length === 0
              ? "You haven't recorded any dreams yet."
              : "No dreams match your current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedDreams).map(([monthYear, monthDreams]) => (
            <div key={monthYear}>
              <h2 className="font-display text-xl text-dream-indigo mb-4 border-b border-dream-purple/20 pb-2">
                {monthYear}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthDreams.map(dream => (
                  <div 
                    key={dream.id} 
                    className="dream-card p-4 rounded-xl cursor-pointer hover:bg-card/80 transition-all"
                    onClick={() => openDetailModal(dream)}
                  >
                    <DreamCard dream={dream} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dream Detail Modal */}
      <DreamDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        dream={selectedDream}
        onDreamDeleted={loadAllDreams}
      />
    </div>
  );
};

export default Archive;
