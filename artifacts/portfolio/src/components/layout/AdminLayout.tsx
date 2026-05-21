import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetAdminMe } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: me, isLoading } = useGetAdminMe();

  useEffect(() => {
    if (!isLoading && !me?.authenticated) {
      setLocation("/admin");
    }
  }, [me, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!me?.authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black">
      <div className="px-6 py-12 max-w-screen-xl mx-auto">
        {children}
      </div>
    </div>
  );
}
