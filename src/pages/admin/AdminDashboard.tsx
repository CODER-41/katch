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
import {
  getStaff, createStaff, updateStaff, deleteStaff
} from "@/services/api";
import schoolBadge from "@/assets/school-badge.jpeg";

// SchoolStat interface matching our backend model
interface SchoolStat {
  id: string;
  stat_key: string;
  stat_value: string;
  stat_label: string;
  stat_category: string;
  updated_at: string;
}

// StaffMember interface matching our backend model
interface StaffMember {
  id: string;
  name: string;
  photo_url: string;
  subject: string;
  email: string;
  phone: string;
  role: string;
  is_leadership: boolean;
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
  const [staffLoading, setStaffLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get admin email from localStorage
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  // Fetch school stats from backend
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/stats/");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff from real backend
  const fetchStaff = async () => {
    setStaffLoading(true);
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      toast({ title: "Error", description: "Could not load staff", variant: "destructive" });
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchStaff();
  }, []);

  // Save updated stat value to backend
  const handleSave = async (id: string, value: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`http://127.0.0.1:5000/api/stats/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stat_value: value })
      });
      // Update local state immediately for smooth UX
      setStats((prev) =>
        prev.map((s) => s.id === id ? { ...s, stat_value: value, updated_at: new Date().toISOString() } : s)
      );
      toast({ title: "Stat updated successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Could not update stat", variant: "destructive" });
    }
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false });
    setShowModal(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData({
      name: member.name,
      photo_url: member.photo_url,
      subject: member.subject,
      email: member.email,
      phone: member.phone,
      role: member.role,
      is_leadership: member.is_leadership
    });
    setShowModal(true);
  };

  // Add or update staff using real backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        // Update existing staff member
        await updateStaff(Number(editingStaff.id), formData);
        toast({ title: "Staff updated successfully" });
      } else {
        // Create new staff member
        await createStaff(formData);
        toast({ title: "Staff added successfully" });
      }
      // Refresh staff list from backend
      await fetchStaff();
      setShowModal(false);
    } catch (err) {
      toast({ title: "Error", description: "Could not save staff", variant: "destructive" });
    }
  };

  // Delete staff member from backend
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(Number(id));
        toast({ title: "Staff deleted successfully" });
        // Refresh staff list
        await fetchStaff();
      } catch (err) {
        toast({ title: "Error", description: "Could not delete staff", variant: "destructive" });
      }
    }
  };

  // Logout - clear localStorage and redirect
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin");
    toast({ title: "Logged out successfully" });
    navigate("/admin/login");
  };

  const categories = ["all", ...Object.keys(categoryConfig)];
  const filteredStats = activeCategory === "all" ? stats : stats.filter((s) => s.stat_category === activeCategory);
  const grouped = filteredStats.reduce<Record<string, SchoolStat[]>>((acc, stat) => {
    const cat = stat.stat_category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(stat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-primary border-b border-primary sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={schoolBadge} alt="Kakamega School Badge" className="w-10 h-10 rounded-full object-cover border-2 border-gold/30" />
            <div>
              <h1 className="font-display font-bold text-primary-foreground leading-tight text-sm md:text-base">
                Admin Dashboard
              </h1>
              <p className="text-[10px] text-gold font-semibold">Kakamega School • Administration Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-xs text-gold font-semibold bg-primary-foreground/10 px-3 py-1.5 rounded-full">
              <Shield className="w-3 h-3 text-gold" />
              <span>{admin?.email || "admin@kakamega.ac.ke"}</span>
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

        {/* Stats grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : stats.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center mb-16">
            <FlaskConical className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No stats yet. Add them via the API or seed the database.</p>
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

          {staffLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : staff.length === 0 ? (
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
                  {/* Photo or initials fallback */}
                  <div className="aspect-square bg-muted relative flex items-center justify-center">
                    {member.photo_url ? (
                      // Show photo if URL exists
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      // Show first letter of name if no photo
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <span className="text-4xl font-bold text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
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

      {/* Add/Edit Staff Modal */}
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
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Subject/Department</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Role</label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Head of Department"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@kakamegaschool.ac.ke"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_leadership"
                  checked={formData.is_leadership}
                  onChange={(e) => setFormData({ ...formData, is_leadership: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_leadership" className="text-sm font-semibold text-foreground">
                  Leadership/Management member
                </label>
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