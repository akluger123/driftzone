import DriftGame from "@/components/DriftGame";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <DriftGame auth={auth} />
    </div>
  );
};

export default Index;
