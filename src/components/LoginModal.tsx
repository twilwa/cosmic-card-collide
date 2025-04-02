
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Github, Twitter, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onContinueAsGuest }) => {
  const { signIn, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (provider: 'github' | 'discord' | 'twitter' | 'google') => {
    try {
      toast({
        title: "Redirecting...",
        description: `Redirecting to ${provider} for authentication`,
      });
      await signIn(provider);
      // Don't close yet - wait for the redirect
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      toast({
        title: "Sign In Error",
        description: error.message || `Failed to sign in with ${provider}`,
        variant: "destructive"
      });
    }
  };

  const handleContinueAsGuest = () => {
    onContinueAsGuest();
    onClose();
    toast({
      title: "Playing as guest",
      description: "Your progress won't be saved between sessions"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md cyber-border glow-corp">
        <DialogHeader>
          <DialogTitle className="text-cyber-corp text-center text-xl font-bold">
            JOIN THE NETWORK
          </DialogTitle>
          <DialogDescription className="text-center">
            Play as a guest or sign in to save your progress across sessions
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            onClick={handleContinueAsGuest} 
            className="w-full bg-cyber-corp hover:bg-cyber-corp/80" 
            size="lg"
            disabled={isLoading}
          >
            Play Now as Guest
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or sign in with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => handleSignIn('github')} 
              className="cyber-border" 
              variant="outline"
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            
            <Button 
              onClick={() => handleSignIn('twitter')} 
              className="cyber-border" 
              variant="outline"
              disabled={isLoading}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            
            <Button 
              onClick={() => handleSignIn('discord')} 
              className="cyber-border" 
              variant="outline"
              disabled={isLoading}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Discord
            </Button>
            
            <Button 
              onClick={() => handleSignIn('google')} 
              className="cyber-border" 
              variant="outline"
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google
            </Button>
          </div>

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground">
              <div className="mt-2 h-1 w-full bg-secondary overflow-hidden rounded">
                <div className="h-full bg-cyber-corp animate-pulse"></div>
              </div>
              <p className="mt-2">Authenticating...</p>
            </div>
          )}
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            Note: Social login may be unavailable until the app is deployed.
            <br />
            Using guest mode is recommended for now.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
