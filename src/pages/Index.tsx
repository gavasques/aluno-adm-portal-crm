
import Hero from "@/components/ui/hero";
import { GridBackground } from "@/components/ui/grid-background";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <GridBackground />
      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
};

export default Index;
