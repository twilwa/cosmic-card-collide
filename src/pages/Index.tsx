
import { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [playAsGuest, setPlayAsGuest] = useState(true); // Default to guest mode for immediate gameplay
  const [showFirstVisitPrompt, setShowFirstVisitPrompt] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited && !user) {
      // Only show prompt if not logged in and first visit
      setShowFirstVisitPrompt(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, [user]);

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleContinueAsGuest = () => {
    setPlayAsGuest(true);
    setShowLoginModal(false);
    toast({
      title: "Playing as guest",
      description: "Your progress won't be saved"
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setPlayAsGuest(true); // Automatically continue as guest after signout
    toast({
      title: "Signed out",
      description: "You've been signed out successfully"
    });
  };

  // Show loading state during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="cyber-border p-6 rounded-md glow-corp">
          <h2 className="text-2xl text-center text-primary">Authenticating...</h2>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b border-border flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">
          <span className="text-cyber-corp">Cosmic</span>
          <span className="text-white">Card</span>
          <span className="text-cyber-runner">Collide</span>
        </h1>
        
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="cyber-border p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <UserIcon size={16} />
                  <span className="text-sm">{user.email || "User"}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="cyber-border"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          ) : playAsGuest ? (
            <div className="flex items-center gap-4">
              <div className="cyber-border p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <UserIcon size={16} />
                  <span className="text-sm">Guest</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShowLoginModal}
                className="cyber-border"
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowLoginModal}
              className="cyber-border glow-corp hover:glow-runner"
            >
              <LogIn size={16} className="mr-2" />
              Sign In / Play as Guest
            </Button>
          )}
        </div>
      </header>
      
      <main>
        <GameBoard />
      </main>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal} 
        onContinueAsGuest={handleContinueAsGuest} 
      />

      {/* First visit prompt */}
      <AlertDialog open={showFirstVisitPrompt} onOpenChange={setShowFirstVisitPrompt}>
        <AlertDialogContent className="cyber-border glow-corp">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyber-corp">Welcome to Cosmic Card Collide!</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to sign in to save your progress, or continue as a guest? 
              Guest progress won't be saved between sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinueAsGuest}>Continue as Guest</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setShowFirstVisitPrompt(false);
              setShowLoginModal(true);
            }}>Sign In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
