import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [location, setLocation] = useLocation();
  
  const { data: me, isLoading: checkingAuth } = useGetAdminMe();
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (me?.authenticated) {
      setLocation("/admin/dashboard");
    }
  }, [me, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    loginMutation.mutate({ data: { password } }, {
      onSuccess: () => {
        setLocation("/admin/dashboard");
      },
      onError: () => {
        setError("Invalid credentials");
      }
    });
  };

  if (checkingAuth) return null;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif tracking-tighter uppercase text-white mb-2">Restricted Access</h1>
          <p className="text-neutral-500 text-sm tracking-widest uppercase">Admin Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Enter passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-4 focus:outline-none focus:border-white transition-colors placeholder:text-neutral-600 tracking-widest text-center"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || !password}
            className="w-full bg-white text-black py-4 font-serif uppercase tracking-widest hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loginMutation.isPending ? "Authenticating..." : "Enter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
