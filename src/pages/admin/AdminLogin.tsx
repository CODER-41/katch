import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import schoolBadge from "@/assets/school-badge.jpeg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Stub function - Supabase removed
    console.warn("Supabase removed - wire up your own backend here");
    
    // Mock login failure for now
    setTimeout(() => {
      toast({ 
        title: "Auth Not Configured", 
        description: "Supabase has been removed. Wire up your own authentication backend.", 
        variant: "destructive" 
      });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={schoolBadge}
              alt="Kakamega School Badge"
              className="w-20 h-20 rounded-full border-4 border-primary shadow-lg object-cover"
            />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Kakamega School Administration</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kakamegaschool.ac.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Restricted to authorised school administrators only.
          </p>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to School Website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
