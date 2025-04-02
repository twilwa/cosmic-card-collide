
import GameBoard from "@/components/GameBoard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b border-border">
        <h1 className="text-3xl font-bold text-center text-primary">
          <span className="text-cyber-corp">Cosmic</span>
          <span className="text-white">Card</span>
          <span className="text-cyber-runner">Collide</span>
        </h1>
      </header>
      
      <main>
        <GameBoard />
      </main>
    </div>
  );
};

export default Index;
