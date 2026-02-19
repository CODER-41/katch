import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, Building2, BookOpen, Trophy, FlaskConical,
  LogOut, Save, Edit3, X, Check, LayoutDashboard, RefreshCw, Shield, Plus, Mail, Phone, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SchoolStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  stat_category: string;
  updated_at: string;
}

interface StaffMember {
  id: string;
  name: string;
  photo: string;
  subject: string;
  email: string;
  phone: string;
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
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({ name: "", photo: "", subject: "", email: "", phone: "" });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    
    // Stub function - Supabase removed
    console.warn("Supabase removed - wire up your own backend here");
    
    // Mock data for demonstration
    const mockStats: SchoolStat[] = [
      { id: "1", stat_key: "total_students", stat_value: "2,500+", stat_label: "Total Students", stat_category: "students", updated_at: new Date().toISOString() },
      { id: "2", stat_key: "teaching_staff", stat_value: "120", stat_label: "Teaching Staff", stat_category: "staff", updated_at: new Date().toISOString() },
      { id: "3", stat_key: "classrooms", stat_value: "45", stat_label: "Classrooms", stat_category: "facilities", updated_at: new Date().toISOString() },
      { id: "4", stat_key: "mean_grade", stat_value: "A-", stat_label: "KCSE Mean Grade", stat_category: "academics", updated_at: new Date().toISOString() },
    ];
    
    setStats(mockStats);
    setLoading(false);
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: "", photo: "", subject: "", email: "", phone: "" });
    setShowModal(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({ name: member.name, photo: member.photo, subject: member.subject, email: member.email, phone: member.phone });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...editingStaff, ...formData } : s));
      toast({ title: "Staff updated successfully" });
    } else {
      setStaff([...staff, { id: Date.now().toString(), ...formData }]);
      toast({ title: "Staff added successfully" });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff(staff.filter(s => s.id !== id));
      toast({ title: "Staff deleted successfully" });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (id: string, value: string) => {
    // Stub function - Supabase removed
    console.warn("Supabase removed - wire up your own backend here");
    
    toast({ title: "Mock Save", description: "Supabase removed. Wire up your backend to persist changes." });
    setStats((prev) => prev.map((s) => s.id === id ? { ...s, stat_value: value, updated_at: new Date().toISOString() } : s));
  };

  const handleLogout = async () => {
    // Stub function - Supabase removed
    console.warn("Supabase removed - wire up your own backend here");
    
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
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
              <Shield className="w-4 h-4 text-primary" />
            </div>
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
              <span>{user?.email || "No user"}</span>
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

        {/* Staff Management Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Staff Management</h2>
              <p className="text-muted-foreground mt-1 text-sm">Manage teacher profiles and contact information</p>
            </div>
            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" /> Add Staff
            </Button>
          </div>

          {staff.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No staff members yet. Click "Add Staff" to get started.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-muted relative">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{member.subject}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(member)} className="flex-1 gap-1.5">
                        <Edit3 className="w-3 h-3" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)} className="gap-1.5">
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Photo URL</label>
                <Input
                  required
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Subject/Department</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@kakamegaschool.ac.ke"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Phone</label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 gap-2">
                  <Save className="w-4 h-4" /> {editingStaff ? "Update" : "Add"} Staff
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
