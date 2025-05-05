
import { EmotionType } from '@/components/EmotionTag';

export interface Dream {
  id: string;
  description: string;
  timestamp: string;
  emotions: EmotionType[];
  rating: number;
}

const STORAGE_KEY = 'dream-journal-entries';

// Save dreams to localStorage
export const saveDreams = (dreams: Dream[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  } catch (error) {
    console.error('Error saving dreams to localStorage:', error);
  }
};

// Load dreams from localStorage
export const loadDreams = (): Dream[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading dreams from localStorage:', error);
    return [];
  }
};

// Add a new dream
export const addDream = (dream: Omit<Dream, 'id'>): Dream => {
  const dreams = loadDreams();
  const newDream = {
    ...dream,
    id: crypto.randomUUID(),
  };
  
  saveDreams([newDream, ...dreams]);
  return newDream;
};

// Delete a dream by ID
export const deleteDream = (id: string): void => {
  const dreams = loadDreams();
  const filteredDreams = dreams.filter(dream => dream.id !== id);
  saveDreams(filteredDreams);
};

// Export dreams to CSV
export const exportToCSV = (): string => {
  const dreams = loadDreams();
  if (dreams.length === 0) return '';
  
  // CSV Header
  const headers = ['Date', 'Description', 'Emotions', 'Rating'];
  
  // CSV Rows
  const rows = dreams.map(dream => [
    new Date(dream.timestamp).toLocaleString(),
    `"${dream.description.replace(/"/g, '""')}"`, // Escape quotes in description
    dream.emotions.join(', '),
    dream.rating.toString()
  ]);
  
  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Download CSV file
export const downloadCSV = (): void => {
  const csvContent = exportToCSV();
  if (!csvContent) return;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `dream-journal-export-${dateStr}.csv`);
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
