import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Lock, Mail, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// This page is ONLY accessible at /admin/setup
// Once one admin exists, this should be disabled or removed
const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Stub function - Supabase removed
    console.warn("Supabase removed - wire up your own backend here");
    
    // Mock setup
    setTimeout(() => {
      toast({ 
        title: "Auth Not Configured", 
        description: "Supabase has been removed. Wire up your own authentication backend.", 
        variant: "destructive" 
      });
      setLoading(false);
    }, 500);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Account Created!</h2>
          <p className="text-muted-foreground text-sm mb-2">
            Your admin account (<strong>{email}</strong>) has been created.
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            Wire up your own authentication backend to enable login.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="w-full">
            Go to Admin Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary shadow-lg">
                <UserPlus className="w-10 h-10 text-primary" />
              </div>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Create Admin Account</h1>
          <p className="text-muted-foreground text-sm mt-1">First-time admin setup</p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 bg-muted border border-border rounded-lg p-3 mb-6">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs text-muted-foreground">
              This page creates an admin account. Wire up your own authentication backend.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@kakamegaschool.ac.ke" value={email}
                  onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirmPassword" type="password" placeholder="Repeat password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-4">
          <a href="/admin/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Already have an account? Sign in
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSetup;
