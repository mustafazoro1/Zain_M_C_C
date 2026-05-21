import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const { data: me } = useGetAdminMe({
    query: { retry: false, throwOnError: false }
  });
  const loginMutation = useAdminLogin();

  useEffect(() => {
    if (me?.authenticated) {
      setLocation("/admin");
    }
  }, [me, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { username, password } }, {
      onSuccess: (data) => {
        if (data.authenticated) {
          setLocation("/admin");
        } else {
          setError("Invalid credentials");
        }
      },
      onError: () => {
        setError("Invalid username or password");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-lg font-serif font-bold uppercase tracking-tight text-foreground">Zain Manzoor</p>
          <p className="text-[9px] tracking-[0.4em] uppercase text-[hsl(38,72%,52%)]">Co.</p>
          <div className="mt-5 w-8 h-px bg-[hsl(38,72%,52%)] mx-auto" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[hsl(220,12%,45%)] mt-4">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              data-testid="input-username"
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[hsl(220,12%,45%)] mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              data-testid="input-password"
              className="w-full bg-[hsl(220,18%,12%)] border border-[hsl(220,15%,20%)] text-foreground px-4 py-3 text-sm focus:outline-none focus:border-[hsl(38,72%,52%)] transition-colors placeholder:text-[hsl(220,12%,30%)]"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loginMutation.isPending || !username || !password}
              data-testid="button-login"
              className="w-full bg-[hsl(38,72%,52%)] text-[hsl(220,18%,9%)] py-3 text-xs tracking-[0.25em] uppercase font-bold hover:bg-[hsl(38,72%,60%)] transition-colors disabled:opacity-40"
            >
              {loginMutation.isPending ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
