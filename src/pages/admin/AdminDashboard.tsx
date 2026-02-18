import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, Building2, BookOpen, Trophy, FlaskConical,
  LogOut, Save, Edit3, X, Check, LayoutDashboard, RefreshCw, Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import schoolBadge from "@/assets/school-badge.jpeg";

interface SchoolStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  stat_category: string;
  updated_at: string;
}

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  students: { label: "Students", icon: GraduationCap, color: "text-blue-600" },
  staff: { label: "Staff", icon: Users, color: "text-green-600" },
  facilities: { label: "Facilities", icon: Building2, color: "text-purple-600" },
  academics: { label: "Academics", icon: BookOpen, color: "text-gold" },
  "co-curricular": { label: "Co-Curricular", icon: Trophy, color: "text-orange-500" },
  general: { label: "General", icon: FlaskConical, color: "text-primary" },
};

const StatCard = ({
  stat,
  onSave,
}: {
  stat: SchoolStat;
  onSave: (id: string, value: string) => Promise<void>;
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(stat.stat_value);
  const [saving, setSaving] = useState(false);
  const config = categoryConfig[stat.stat_category] || categoryConfig.general;
  const Icon = config.icon;

  const handleSave = async () => {
    setSaving(true);
    await onSave(stat.id, value);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(stat.stat_value);
    setEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {config.label}
          </span>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-lg font-bold h-10"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">{stat.stat_label}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1 gap-1.5">
              {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="gap-1.5">
              <X className="w-3 h-3" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-3xl font-display font-extrabold text-foreground mb-1">{stat.stat_value}</p>
          <p className="text-sm text-muted-foreground">{stat.stat_label}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-2">
            Updated {new Date(stat.updated_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </>
      )}
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<SchoolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("school_stats")
      .select("*")
      .order("stat_category")
      .order("stat_label");

    if (error) {
      toast({ title: "Error loading stats", description: error.message, variant: "destructive" });
    } else {
      setStats(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (id: string, value: string) => {
    const { error } = await supabase
      .from("school_stats")
      .update({ stat_value: value, updated_by: user?.id })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Statistic updated successfully." });
      setStats((prev) => prev.map((s) => s.id === id ? { ...s, stat_value: value, updated_at: new Date().toISOString() } : s));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/admin/login");
  };

  const categories = ["all", ...Object.keys(categoryConfig)];
  const filteredStats = activeCategory === "all" ? stats : stats.filter((s) => s.stat_category === activeCategory);

  // Group by category for display
  const grouped = filteredStats.reduce<Record<string, SchoolStat[]>>((acc, stat) => {
    const cat = stat.stat_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(stat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={schoolBadge} alt="Badge" className="w-8 h-8 rounded-full object-cover border-2 border-primary" />
            <div>
              <h1 className="font-display font-bold text-foreground leading-tight text-sm md:text-base">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-muted-foreground">Kakamega School • Administration Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <Shield className="w-3 h-3 text-primary" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="hidden md:flex gap-1.5 text-xs">
              <LayoutDashboard className="w-3.5 h-3.5" /> View Site
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-1.5 text-xs">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            School Statistics
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Click the <Edit3 className="inline w-3.5 h-3.5 mx-0.5" /> icon on any card to update a value.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const config = cat === "all" ? null : categoryConfig[cat];
            const Icon = config?.icon;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                {cat === "all" ? "All Categories" : (config?.label ?? cat)}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => {
              const config = categoryConfig[category] || categoryConfig.general;
              const Icon = config.icon;
              return (
                <section key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-5 h-5 ${config.color}`} />
                    <h3 className="font-display text-lg font-bold text-foreground">{config.label}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
                      {items.length} stats
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((stat) => (
                      <StatCard key={stat.id} stat={stat} onSave={handleSave} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
