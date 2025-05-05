import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Moon, Star, Trash2, AlertTriangle } from 'lucide-react';
import { EmotionType } from '@/components/EmotionTag';
import type { Dream } from '@/utils/dreamStorage';
import { deleteDream } from '@/utils/dreamStorage';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface DreamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dream: Dream | null;
  onDreamDeleted?: () => void;
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

const DreamDetailModal: React.FC<DreamDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  dream,
  onDreamDeleted = () => {} 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!dream) return null;

  const formattedDate = new Date(dream.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedTime = new Date(dream.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    deleteDream(dream.id);
    toast.success("Dream successfully removed from your journal");
    setIsDeleteDialogOpen(false);
    onClose();
    onDreamDeleted();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] p-6 bg-card/90 backdrop-blur-md border border-dream-purple/20 shadow-xl text-white rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center text-2xl text-white">
              <Moon className="h-6 w-6 mr-2 text-dream-purple" strokeWidth={1.5} />
              Dream Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 my-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <div className="font-medium text-white">{formattedDate}</div>
                <div className="text-white/60">{formattedTime}</div>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm mr-2 text-white/80">Realism:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < dream.rating ? "#FFDE59" : "transparent"}
                    stroke={i < dream.rating ? "#FFDE59" : "#666"}
                  />
                ))}
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl overflow-y-auto max-h-[50vh]">
              <p className="text-white whitespace-pre-wrap break-words">
                {dream.description}
              </p>
            </div>
            
            {dream.emotions.length > 0 && (
              <div>
                <h3 className="text-white text-sm mb-2">Emotions:</h3>
                <div className="flex flex-wrap gap-2">
                  {dream.emotions.map(emotion => (
                    <span
                      key={emotion}
                      className="text-sm bg-dream-purple/20 text-dream-purple px-3 py-1 rounded-full flex items-center"
                    >
                      <span className="mr-1">{EMOTION_EMOJIS[emotion]}</span>
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2 justify-between sm:justify-end w-full">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Dream
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="bg-dream-purple text-white hover:bg-dream-purple/90 w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border border-dream-purple/20 text-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Delete Dream
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this dream? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DreamDetailModal;
