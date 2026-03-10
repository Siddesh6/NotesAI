
'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, Firestore, deleteDoc } from 'firebase/firestore';
import { updateDocumentNonBlocking, useAuth } from '@/firebase';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Loader2, Key, Upload, Camera, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettingsProps {
  db: Firestore;
  userId: string;
  currentProfile: any;
}

export function ProfileSettings({ db, userId, currentProfile }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(currentProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentProfile?.photoURL || '');
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentProfile) {
      setDisplayName(currentProfile.displayName || '');
      setPhotoURL(currentProfile.photoURL || '');
    }
  }, [currentProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoURL(result);
    };
    reader.readAsDataURL(file);
  };

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
      photoURL: photoURL,
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

  const handleSendResetEmail = async () => {
    if (!currentProfile?.email) return;
    
    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, currentProfile.email);
      toast({
        title: "Reset Email Sent",
        description: "A password reset link has been sent to your email address.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsDeleting(true);
    try {
      // 1. Delete Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);

      // 2. Delete the user from Firebase Auth
      await deleteUser(user);

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently removed.",
      });
      router.push('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({
          title: "Action Required",
          description: "For security reasons, please sign out and sign in again before deleting your account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Deletion Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-secondary/30">
            <Settings className="mr-3 h-4 w-4" />
            Account Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Update your profile details and security settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={photoURL} alt={displayName} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {displayName?.charAt(0) || currentProfile?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs"
                >
                  <Upload className="mr-2 h-3 w-3" />
                  Change Photo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="col-span-3"
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input
                  value={currentProfile?.email || ''}
                  className="col-span-3 bg-secondary/50 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-semibold flex items-center">
                <Key className="mr-2 h-4 w-4 text-accent" />
                Security
              </h4>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-secondary/30">
                <div className="space-y-1">
                  <p className="text-xs font-bold">Password Management</p>
                  <p className="text-[10px] text-muted-foreground">Receive a reset link via email</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSendResetEmail} 
                  disabled={isSendingReset}
                  className="text-xs h-8"
                >
                  {isSendingReset ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send Reset Link"}
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-semibold text-destructive flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Danger Zone
              </h4>
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <p className="text-xs text-destructive mb-3">Deleting your account is permanent and will remove all your transcripts and tasks.</p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete My Account
                </Button>
              </div>
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteAccount();
              }}
              className="bg-destructive hover:bg-destructive/90 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
