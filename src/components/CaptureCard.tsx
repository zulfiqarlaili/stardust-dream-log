import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

const CaptureCard = () => {
  return (
    <div className="w-full space-y-4">
      <Card className="w-full min-h-[320px] p-6">
        <CardContent className="p-0">
          {/* Your existing card content here */}
          <div className="space-y-4">
            <Input 
              className="w-full"
              placeholder="Describe your dream..."
            />
            {/* Other form elements */}
          </div>
        </CardContent>
      </Card>
      <Button className="w-full">
        Capture Dream
      </Button>
    </div>
  );
};

export default CaptureCard;
