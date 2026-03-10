'use client';

import { useState, useEffect } from 'react';
import { doc, Firestore } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Settings, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  db: Firestore;
  userId: string;
  currentProfile: any;
}

export function ProfileSettings({ db, userId, currentProfile }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(currentProfile?.displayName || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentProfile?.displayName) {
      setDisplayName(currentProfile.displayName);
    }
  }, [currentProfile]);

  const handleSave = () => {
    if (!displayName.trim()) {
      toast({
        title: "Validation Error",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const userRef = doc(db, 'users', userId);
    
    updateDocumentNonBlocking(userRef, {
      displayName: displayName.trim(),
      updatedAt: new Date().toISOString(),
    });

    // Simulate a small delay for better UX
    setTimeout(() => {
      setIsSaving(false);
      setIsOpen(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30">
          <Settings className="mr-3 h-4 w-4" />
          Account Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
              placeholder="Your full name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Email
            </Label>
            <Input
              value={currentProfile?.email || ''}
              className="col-span-3 bg-secondary/50 cursor-not-allowed"
              disabled
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
