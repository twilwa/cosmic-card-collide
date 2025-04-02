
import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [playAsGuest, setPlayAsGuest] = useState(false);

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleContinueAsGuest = () => {
    setPlayAsGuest(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setPlayAsGuest(false);
  };

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
        {user || playAsGuest ? (
          <GameBoard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
            <div className="cyber-border p-6 rounded-md glow-corp max-w-lg text-center">
              <h2 className="text-2xl font-bold mb-4 text-cyber-corp">Welcome to Cosmic Card Collide</h2>
              <p className="mb-4">A cyberpunk deck-building game where corporations and runners battle for control of the network.</p>
              <Button 
                onClick={handleShowLoginModal} 
                size="lg" 
                className="bg-cyber-corp hover:bg-cyber-corp/80"
              >
                Start Playing
              </Button>
            </div>
          </div>
        )}
      </main>
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal} 
        onContinueAsGuest={handleContinueAsGuest} 
      />
    </div>
  );
};

export default Index;
