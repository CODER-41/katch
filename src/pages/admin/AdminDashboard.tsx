import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, Building2, BookOpen, Trophy, FlaskConical,
  LogOut, Save, Edit3, X, Check, LayoutDashboard, RefreshCw, Shield,
  Plus, Mail, Phone, Trash2, Newspaper, Calendar, Image, MessageSquare,
  Inbox, CheckCheck, Clock, Flag, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  getStaff, createStaff, updateStaff, deleteStaff,
  getNews, createNews, deleteNews,
  getEvents, createEvent, deleteEvent,
  getGallery, createGalleryImage, deleteGalleryImage,
  getTestimonials, createTestimonial, deleteTestimonial,
  getContactSubmissions, markSubmissionRead, deleteSubmission,
  getAdmissions, getAdmissionStats, updateAdmissionStatus, deleteAdmission
} from "@/services/api";
import schoolBadge from "@/assets/school-badge.jpeg";

// ─── Interfaces ───────────────────────────────────────────────────────────────

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
  photo_url: string;
  subject: string;
  email: string;
  phone: string;
  role: string;
  is_leadership: boolean;
}

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
}

interface EventItem {
  id: number;
  title: string;
  date: string;
  description: string;
  created_at: string;
}

interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  category: string;
  created_at: string;
}

interface Testimonial {
  id: number;
  student_name: string;
  year: string;
  quote: string;
  created_at: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface AdmissionApplication {
  id: number;
  application_number: string;
  applicant_name: string;
  gender: string;
  date_of_birth: string;
  nationality: string;
  previous_school: string;
  parent_name: string;
  parent_relationship: string;
  parent_phone: string;
  parent_email: string;
  kjsea_score: number;
  grade_band: string;
  kjsea_result_url: string;
  birth_cert_url: string;
  passport_photo_url: string;
  school_leaving_cert_url: string;
  medical_report_url: string;
  status: string;
  is_flagged: boolean;
  admin_notes: string;
  created_at: string;
}

interface AdmissionStats {
  total: number; flagged: number; accepted: number; rejected: number; pending: number;
}

// ─── Category config for stats ────────────────────────────────────────────────

const categoryConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  students: { label: "Students", icon: GraduationCap, color: "text-blue-600" },
  staff: { label: "Staff", icon: Users, color: "text-green-600" },
  facilities: { label: "Facilities", icon: Building2, color: "text-purple-600" },
  academics: { label: "Academics", icon: BookOpen, color: "text-gold" },
  "co-curricular": { label: "Co-Curricular", icon: Trophy, color: "text-orange-500" },
  general: { label: "General", icon: FlaskConical, color: "text-primary" },
};

// ─── StatCard component ───────────────────────────────────────────────────────

const StatCard = ({ stat, onSave }: { stat: SchoolStat; onSave: (id: string, value: string) => Promise<void> }) => {
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-muted">
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{config.label}</span>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-3">
          <Input value={value} onChange={(e) => setValue(e.target.value)} className="text-lg font-bold h-10" autoFocus />
          <p className="text-xs text-muted-foreground">{stat.stat_label}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1 gap-1.5">
              {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setValue(stat.stat_value); setEditing(false); }} className="gap-1.5">
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

// ─── Section Header component ─────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, desc, onAdd, addLabel, badge }: {
  icon: React.ElementType; title: string; desc: string; onAdd?: () => void; addLabel?: string; badge?: number;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-primary/10 relative">
        <Icon className="w-5 h-5 text-primary" />
        {badge && badge > 0 ? (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </div>
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-0.5 text-sm">{desc}</p>
      </div>
    </div>
    {onAdd && addLabel && (
      <Button onClick={onAdd} className="gap-2">
        <Plus className="w-4 h-4" /> {addLabel}
      </Button>
    )}
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  // ── Stats state ──
  const [stats, setStats] = useState<SchoolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // ── Shared submitting state (only one modal open at a time) ──
  const [submitting, setSubmitting] = useState(false);

  // ── Staff state ──
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false });

  // ── News state ──
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", category: "" });

  // ── Events state ──
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "", description: "" });

  // ── Gallery state ──
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ image_url: "", title: "", category: "" });

  // ── Testimonials state ──
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ student_name: "", year: "", quote: "" });

  // ── Contact Submissions state ──
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);

  // ── Admissions state ──
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(true);
  const [admissionStats, setAdmissionStats] = useState<AdmissionStats>({ total: 0, flagged: 0, accepted: 0, rejected: 0, pending: 0 });
  const [admissionFilter, setAdmissionFilter] = useState("all");
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);
  const [admissionNotes, setAdmissionNotes] = useState("");
  const [admissionActionLoading, setAdmissionActionLoading] = useState(false);

  // ── Fetch all data on mount ──
  useEffect(() => {
    fetchStats();
    fetchStaff();
    fetchNews();
    fetchEvents();
    fetchGallery();
    fetchTestimonials();
    fetchSubmissions();
    fetchAdmissions();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://kakamega-school-backend.onrender.com/api/stats/");
      setStats(await res.json());
    } catch { setStats([]); } finally { setLoading(false); }
  };

  const fetchStaff = async () => {
    setStaffLoading(true);
    try { setStaff(await getStaff()); }
    catch { toast({ title: "Error", description: "Could not load staff", variant: "destructive" }); }
    finally { setStaffLoading(false); }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    try { setNews(await getNews()); }
    catch { toast({ title: "Error", description: "Could not load news", variant: "destructive" }); }
    finally { setNewsLoading(false); }
  };

  const fetchEvents = async () => {
    setEventsLoading(true);
    try { setEvents(await getEvents()); }
    catch { toast({ title: "Error", description: "Could not load events", variant: "destructive" }); }
    finally { setEventsLoading(false); }
  };

  const fetchGallery = async () => {
    setGalleryLoading(true);
    try { setGallery(await getGallery()); }
    catch { toast({ title: "Error", description: "Could not load gallery", variant: "destructive" }); }
    finally { setGalleryLoading(false); }
  };

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try { setTestimonials(await getTestimonials()); }
    catch { toast({ title: "Error", description: "Could not load testimonials", variant: "destructive" }); }
    finally { setTestimonialsLoading(false); }
  };

  const fetchSubmissions = async () => {
    setSubmissionsLoading(true);
    try { setSubmissions(await getContactSubmissions()); }
    catch { toast({ title: "Error", description: "Could not load messages", variant: "destructive" }); }
    finally { setSubmissionsLoading(false); }
  };

  // ── Stats save ──
  const handleStatSave = async (id: string, value: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`https://kakamega-school-backend.onrender.com/api/stats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stat_value: value })
      });
      setStats(prev => prev.map(s => s.id === id ? { ...s, stat_value: value, updated_at: new Date().toISOString() } : s));
      toast({ title: "Stat updated successfully" });
    } catch { toast({ title: "Error", description: "Could not update stat", variant: "destructive" }); }
  };

  // ── Staff handlers ──
  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (editingStaff) { await updateStaff(Number(editingStaff.id), staffForm); toast({ title: "Staff updated" }); }
      else { await createStaff(staffForm); toast({ title: "Staff added" }); }
      await fetchStaff(); setShowStaffModal(false);
    } catch { toast({ title: "Error", description: "Could not save staff", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    try { await deleteStaff(Number(id)); toast({ title: "Staff deleted" }); await fetchStaff(); }
    catch { toast({ title: "Error", description: "Could not delete staff", variant: "destructive" }); }
  };

  // ── News handlers ──
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try { await createNews(newsForm); toast({ title: "News article added" }); await fetchNews(); setShowNewsModal(false); setNewsForm({ title: "", excerpt: "", category: "" }); }
    catch { toast({ title: "Error", description: "Could not add news", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Delete this news article?")) return;
    try { await deleteNews(id); toast({ title: "News deleted" }); await fetchNews(); }
    catch { toast({ title: "Error", description: "Could not delete news", variant: "destructive" }); }
  };

  // ── Events handlers ──
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try { await createEvent(eventForm); toast({ title: "Event added" }); await fetchEvents(); setShowEventModal(false); setEventForm({ title: "", date: "", description: "" }); }
    catch { toast({ title: "Error", description: "Could not add event", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try { await deleteEvent(id); toast({ title: "Event deleted" }); await fetchEvents(); }
    catch { toast({ title: "Error", description: "Could not delete event", variant: "destructive" }); }
  };

  // ── Gallery handlers ──
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try { await createGalleryImage(galleryForm); toast({ title: "Image added" }); await fetchGallery(); setShowGalleryModal(false); setGalleryForm({ image_url: "", title: "", category: "" }); }
    catch { toast({ title: "Error", description: "Could not add image", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try { await deleteGalleryImage(id); toast({ title: "Image deleted" }); await fetchGallery(); }
    catch { toast({ title: "Error", description: "Could not delete image", variant: "destructive" }); }
  };

  // ── Testimonials handlers ──
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try { await createTestimonial(testimonialForm); toast({ title: "Testimonial added" }); await fetchTestimonials(); setShowTestimonialModal(false); setTestimonialForm({ student_name: "", year: "", quote: "" }); }
    catch { toast({ title: "Error", description: "Could not add testimonial", variant: "destructive" }); }
    finally { setSubmitting(false); }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try { await deleteTestimonial(id); toast({ title: "Testimonial deleted" }); await fetchTestimonials(); }
    catch { toast({ title: "Error", description: "Could not delete testimonial", variant: "destructive" }); }
  };

  // ── Admissions fetch & handlers ──
  const fetchAdmissions = async () => {
    setAdmissionsLoading(true);
    try {
      const [list, stats] = await Promise.all([getAdmissions(), getAdmissionStats()]);
      setAdmissions(Array.isArray(list) ? list : []);
      if (stats && !stats.error) setAdmissionStats(stats);
    } catch { toast({ title: "Error", description: "Could not load applications", variant: "destructive" }); }
    finally { setAdmissionsLoading(false); }
  };

  const handleAdmissionStatus = async (id: number, status: "accepted" | "rejected") => {
    setAdmissionActionLoading(true);
    try {
      const updated = await updateAdmissionStatus(id, { status, admin_notes: admissionNotes });
      setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
      setAdmissionStats(prev => {
        const old = selectedAdmission?.status as keyof AdmissionStats;
        return { ...prev, [old]: Math.max(0, prev[old] - 1), [status]: prev[status] + 1 };
      });
      setSelectedAdmission(null);
      setAdmissionNotes("");
      toast({ title: `Application ${status}`, description: `${selectedAdmission?.applicant_name}'s application has been ${status}.` });
    } catch { toast({ title: "Error", description: "Could not update status", variant: "destructive" }); }
    finally { setAdmissionActionLoading(false); }
  };

  const handleDeleteAdmission = async (id: number) => {
    try {
      await deleteAdmission(id);
      setAdmissions(prev => prev.filter(a => a.id !== id));
      if (selectedAdmission?.id === id) setSelectedAdmission(null);
      toast({ title: "Application deleted" });
    } catch { toast({ title: "Error", description: "Could not delete application", variant: "destructive" }); }
  };

  const filteredAdmissions = admissionFilter === "all" ? admissions : admissions.filter(a => a.status === admissionFilter);

  // ── Contact Submissions handlers ──
  const handleMarkRead = async (id: number) => {
    try {
      await markSubmissionRead(id);
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, is_read: true } : s));
      toast({ title: "Message marked as read" });
    } catch { toast({ title: "Error", description: "Could not mark as read", variant: "destructive" }); }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast({ title: "Message deleted" });
    } catch { toast({ title: "Error", description: "Could not delete message", variant: "destructive" }); }
  };

  // Count unread messages for badge
  const unreadCount = submissions.filter(s => !s.is_read).length;

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("admin");
    toast({ title: "Logged out successfully" });
    navigate("/admin/login");
  };

  const categories = ["all", ...Object.keys(categoryConfig)];
  const filteredStats = activeCategory === "all" ? stats : stats.filter((s) => s.stat_category === activeCategory);
  const grouped = filteredStats.reduce<Record<string, SchoolStat[]>>((acc, stat) => {
    if (!acc[stat.stat_category]) acc[stat.stat_category] = [];
    acc[stat.stat_category].push(stat);
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
              <h1 className="font-display font-bold text-primary-foreground leading-tight text-sm md:text-base">Admin Dashboard</h1>
              <p className="text-[10px] text-gold font-semibold">Kakamega School • Administration Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Unread messages badge in header */}
            {unreadCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-red-500 text-white px-3 py-1.5 rounded-full">
                <Inbox className="w-3 h-3" />
                {unreadCount} unread
              </div>
            )}
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

      <main className="container mx-auto px-4 py-8 space-y-20">

        {/* ── Contact Submissions Inbox ── */}
        <section>
          <SectionHeader
            icon={Inbox}
            title="Messages Inbox"
            desc="Contact form submissions from parents and visitors"
            badge={unreadCount}
          />
          {submissionsLoading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          ) : submissions.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet. When parents contact the school, messages will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border rounded-xl overflow-hidden transition-all ${
                    submission.is_read ? "border-border" : "border-primary/40 shadow-md shadow-primary/10"
                  }`}
                >
                  {/* Message header - always visible */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setExpandedSubmission(expandedSubmission === submission.id ? null : submission.id);
                      if (!submission.is_read) handleMarkRead(submission.id);
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Unread indicator dot */}
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${submission.is_read ? "bg-muted" : "bg-primary"}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold text-foreground ${!submission.is_read ? "font-bold" : ""}`}>
                            {submission.name}
                          </p>
                          {submission.subject && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {submission.subject}
                            </span>
                          )}
                          {!submission.is_read && (
                            <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{submission.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(submission.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  {/* Expanded message body */}
                  {expandedSubmission === submission.id && (
                    <div className="px-4 pb-4 border-t border-border">
                      <div className="pt-4 space-y-3">
                        {/* Contact details */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 text-primary" />
                            <a href={`mailto:${submission.email}`} className="hover:text-primary transition-colors">
                              {submission.email}
                            </a>
                          </div>
                          {submission.phone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4 text-primary" />
                              <span>{submission.phone}</span>
                            </div>
                          )}
                        </div>
                        {/* Message body */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{submission.message}</p>
                        </div>
                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          <a
                           href={`https://mail.google.com/mail/?view=cm&to=${submission.email}&su=Re: ${submission.subject || "Your enquiry to Kakamega School"}`} 
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Mail className="w-4 h-4" /> Reply via Email
                          </a>
                          {!submission.is_read && (
                            <Button size="sm" variant="outline" onClick={() => handleMarkRead(submission.id)} className="gap-1.5">
                              <CheckCheck className="w-3.5 h-3.5" /> Mark Read
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSubmission(submission.id)} className="gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── Admissions Applications ── */}
        <section>
          <SectionHeader icon={GraduationCap} title="Admission Applications" desc="KJSEA-based applications sorted by score — review, accept, or reject" badge={admissionStats.flagged} />

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {([
              { label: "Total", value: admissionStats.total, color: "text-foreground", bg: "bg-muted" },
              { label: "Flagged", value: admissionStats.flagged, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pending", value: admissionStats.pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Accepted", value: admissionStats.accepted, color: "text-green-600", bg: "bg-green-50" },
              { label: "Rejected", value: admissionStats.rejected, color: "text-red-500", bg: "bg-red-50" },
            ] as const).map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 text-center`}>
                <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {["all", "flagged", "pending", "accepted", "rejected"].map(f => (
              <button key={f} onClick={() => setAdmissionFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${admissionFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                {f === "all" ? `All (${admissionStats.total})` : f === "flagged" ? `Flagged (${admissionStats.flagged})` : f === "pending" ? `Pending (${admissionStats.pending})` : f === "accepted" ? `Accepted (${admissionStats.accepted})` : `Rejected (${admissionStats.rejected})`}
              </button>
            ))}
          </div>

          {admissionsLoading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="px-4 py-3">Ref #</th>
                    <th className="px-4 py-3">Applicant</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Band</th>
                    <th className="px-4 py-3 hidden md:table-cell">Previous School</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAdmissions.map(app => {
                    const statusColor = app.status === "accepted" ? "bg-green-100 text-green-700" : app.status === "rejected" ? "bg-red-100 text-red-600" : app.status === "flagged" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";
                    return (
                      <tr key={app.id} className="bg-card hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{app.application_number}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-foreground">{app.applicant_name}</p>
                          <p className="text-xs text-muted-foreground">{app.gender}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold font-mono ${app.kjsea_score >= 60 ? "text-green-600" : app.kjsea_score >= 50 ? "text-blue-600" : app.kjsea_score >= 40 ? "text-amber-600" : "text-red-500"}`}>{app.kjsea_score}/72</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.grade_band === "EE" ? "bg-green-100 text-green-700" : app.grade_band === "ME" ? "bg-blue-100 text-blue-700" : app.grade_band === "AE" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{app.grade_band}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{app.previous_school}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor}`}>
                            {app.status === "flagged" && <Flag className="inline w-3 h-3 mr-1" />}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setSelectedAdmission(app); setAdmissionNotes(app.admin_notes || ""); }} className="text-xs font-medium text-primary hover:underline">View</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── School Statistics ── */}
        <section>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">School Statistics</h2>
            <p className="text-muted-foreground mt-1 text-sm">Click the <Edit3 className="inline w-3.5 h-3.5 mx-0.5" /> icon on any card to update a value.</p>
          </motion.div>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => {
              const config = cat === "all" ? null : categoryConfig[cat];
              const Icon = config?.icon;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                  {Icon && <Icon className="w-3 h-3" />}
                  {cat === "all" ? "All Categories" : (config?.label ?? cat)}
                </button>
              );
            })}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          ) : (
            <div className="space-y-10">
              {Object.entries(grouped).map(([category, items]) => {
                const config = categoryConfig[category] || categoryConfig.general;
                const Icon = config.icon;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                      <h3 className="font-display text-lg font-bold text-foreground">{config.label}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">{items.length} stats</span>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map((stat) => <StatCard key={stat.id} stat={stat} onSave={handleStatSave} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Staff Management ── */}
        <section>
          <SectionHeader icon={Users} title="Staff Management" desc="Manage teacher profiles and contact information" onAdd={() => { setEditingStaff(null); setStaffForm({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false }); setShowStaffModal(true); }} addLabel="Add Staff" />
          {staffLoading ? <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          : staff.length === 0 ? <div className="bg-card border border-border rounded-xl p-12 text-center"><Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No staff yet. Click "Add Staff" to get started.</p></div>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((member) => (
                <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {member.photo_url ? <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-primary/10"><div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30"><span className="text-xl font-bold text-primary">{member.name.split(' ').map(n => n.charAt(0).toUpperCase()).slice(0, 2).join('')}</span></div></div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-3">{member.subject}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="w-3.5 h-3.5" /><span className="truncate">{member.email}</span></div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3.5 h-3.5" /><span>{member.phone}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditingStaff(member); setStaffForm({ name: member.name, photo_url: member.photo_url, subject: member.subject, email: member.email, phone: member.phone, role: member.role, is_leadership: member.is_leadership }); setShowStaffModal(true); }} className="flex-1 gap-1.5"><Edit3 className="w-3 h-3" /> Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteStaff(member.id)} className="gap-1.5"><Trash2 className="w-3 h-3" /> Delete</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* ── News Management ── */}
        <section>
          <SectionHeader icon={Newspaper} title="News Management" desc="Add and remove news articles shown on the site" onAdd={() => { setNewsForm({ title: "", excerpt: "", category: "" }); setShowNewsModal(true); }} addLabel="Add News" />
          {newsLoading ? <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          : news.length === 0 ? <div className="bg-card border border-border rounded-xl p-12 text-center"><Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No news articles yet.</p></div>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-5">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="font-display text-base font-bold text-foreground mt-3 mb-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteNews(item.id)} className="gap-1.5 w-full"><Trash2 className="w-3 h-3" /> Delete</Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Events Management ── */}
        <section>
          <SectionHeader icon={Calendar} title="Events Management" desc="Add and remove upcoming events shown on the site" onAdd={() => { setEventForm({ title: "", date: "", description: "" }); setShowEventModal(true); }} addLabel="Add Event" />
          {eventsLoading ? <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          : events.length === 0 ? <div className="bg-card border border-border rounded-xl p-12 text-center"><Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No events yet.</p></div>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="bg-primary/10 text-primary font-bold text-xs px-3 py-1.5 rounded-lg inline-block mb-3">{event.date}</div>
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)} className="gap-1.5 w-full"><Trash2 className="w-3 h-3" /> Delete</Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Gallery Management ── */}
        <section>
          <SectionHeader icon={Image} title="Gallery Management" desc="Add and remove images shown in the gallery and student life pages" onAdd={() => { setGalleryForm({ image_url: "", title: "", category: "" }); setShowGalleryModal(true); }} addLabel="Add Image" />
          {galleryLoading ? <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          : gallery.length === 0 ? <div className="bg-card border border-border rounded-xl p-12 text-center"><Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No gallery images yet.</p></div>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {gallery.map((image) => (
                <div key={image.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  <img src={image.image_url} alt={image.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-sm text-foreground truncate">{image.title}</p>
                    <p className="text-xs text-muted-foreground mb-3">{image.category}</p>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteGallery(image.id)} className="gap-1.5 w-full"><Trash2 className="w-3 h-3" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Testimonials Management ── */}
        <section>
          <SectionHeader icon={MessageSquare} title="Testimonials Management" desc="Add and remove student testimonials shown on the student life page" onAdd={() => { setTestimonialForm({ student_name: "", year: "", quote: "" }); setShowTestimonialModal(true); }} addLabel="Add Testimonial" />
          {testimonialsLoading ? <div className="flex items-center justify-center py-10"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>
          : testimonials.length === 0 ? <div className="bg-card border border-border rounded-xl p-12 text-center"><MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No testimonials yet.</p></div>
          : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm text-foreground italic mb-4 line-clamp-3">"{t.quote}"</p>
                  <p className="font-bold text-sm text-foreground">{t.student_name}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t.year}</p>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteTestimonial(t.id)} className="gap-1.5 w-full"><Trash2 className="w-3 h-3" /> Delete</Button>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ── Staff Modal ── */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowStaffModal(false); setEditingStaff(null); setStaffForm({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false }); }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</h3>
              <button onClick={() => { setShowStaffModal(false); setEditingStaff(null); setStaffForm({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false }); }} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleStaffSubmit} className="p-6 space-y-4">
              {[{ label: "Name", key: "name", placeholder: "John Doe", required: true },
                { label: "Photo URL", key: "photo_url", placeholder: "https://res.cloudinary.com/..." },
                { label: "Subject/Department", key: "subject", placeholder: "Mathematics" },
                { label: "Role", key: "role", placeholder: "Head of Department" },
                { label: "Email", key: "email", placeholder: "john@kakamega.ac.ke", type: "email" },
                { label: "Phone", key: "phone", placeholder: "+254 700 000 000" }
              ].map(({ label, key, placeholder, required, type }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                  <Input required={required} type={type || "text"} value={staffForm[key as keyof typeof staffForm] as string} onChange={(e) => setStaffForm({ ...staffForm, [key]: e.target.value })} placeholder={placeholder} />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_leadership" checked={staffForm.is_leadership} onChange={(e) => setStaffForm({ ...staffForm, is_leadership: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="is_leadership" className="text-sm font-semibold text-foreground">Leadership/Management member</label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : editingStaff ? "Update Staff" : "Add Staff"}
                </Button>
                <Button type="button" variant="outline" disabled={submitting} onClick={() => { setShowStaffModal(false); setEditingStaff(null); setStaffForm({ name: "", photo_url: "", subject: "", email: "", phone: "", role: "", is_leadership: false }); }}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── News Modal ── */}
      {showNewsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewsModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">Add News Article</h3>
              <button onClick={() => setShowNewsModal(false)} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleNewsSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
                <Input required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} placeholder="KCSE 2025 Results..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Excerpt</label>
                <textarea required value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} placeholder="Brief summary of the article..." rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select required value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select category</option>
                  {["Academics", "Sports", "Events", "Facilities", "General"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : "Add Article"}
                </Button>
                <Button type="button" variant="outline" disabled={submitting} onClick={() => setShowNewsModal(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Event Modal ── */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEventModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">Add Event</h3>
              <button onClick={() => setShowEventModal(false)} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEventSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
                <Input required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Open Day" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Date</label>
                <Input required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="March 15, 2026" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
                <textarea required value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Brief description of the event..." rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : "Add Event"}
                </Button>
                <Button type="button" variant="outline" disabled={submitting} onClick={() => setShowEventModal(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Gallery Modal ── */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGalleryModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">Add Gallery Image</h3>
              <button onClick={() => setShowGalleryModal(false)} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleGallerySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Image URL (Cloudinary)</label>
                <Input required value={galleryForm.image_url} onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })} placeholder="https://res.cloudinary.com/..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
                <Input required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} placeholder="Science Laboratory" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select required value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select category</option>
                  {["Academics", "Sports", "Events", "Facilities", "General"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : "Add Image"}
                </Button>
                <Button type="button" variant="outline" disabled={submitting} onClick={() => setShowGalleryModal(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Admission Detail Modal ── */}
      {selectedAdmission && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAdmission(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()} className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{selectedAdmission.applicant_name}</h3>
                <p className="text-xs font-mono text-muted-foreground">{selectedAdmission.application_number}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${selectedAdmission.status === "accepted" ? "bg-green-100 text-green-700" : selectedAdmission.status === "rejected" ? "bg-red-100 text-red-600" : selectedAdmission.status === "flagged" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{selectedAdmission.status}</span>
                <button onClick={() => setSelectedAdmission(null)} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Score highlight */}
              <div className={`rounded-xl border p-4 flex items-center justify-between ${selectedAdmission.kjsea_score >= 60 ? "bg-green-50 border-green-200" : selectedAdmission.kjsea_score >= 50 ? "bg-blue-50 border-blue-200" : selectedAdmission.kjsea_score >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">KJSEA Score</p>
                  <p className={`text-3xl font-bold font-mono ${selectedAdmission.kjsea_score >= 60 ? "text-green-600" : selectedAdmission.kjsea_score >= 50 ? "text-blue-600" : selectedAdmission.kjsea_score >= 40 ? "text-amber-600" : "text-red-500"}`}>{selectedAdmission.kjsea_score}/72</p>
                </div>
                <span className={`text-2xl font-bold px-4 py-2 rounded-xl bg-white/70 ${selectedAdmission.kjsea_score >= 60 ? "text-green-600" : selectedAdmission.kjsea_score >= 50 ? "text-blue-600" : selectedAdmission.kjsea_score >= 40 ? "text-amber-600" : "text-red-500"}`}>{selectedAdmission.grade_band}</span>
              </div>

              {/* Personal */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal Information</p>
                <div className="bg-muted/40 rounded-xl divide-y divide-border text-sm">
                  {[["Gender", selectedAdmission.gender], ["Date of Birth", selectedAdmission.date_of_birth], ["Nationality", selectedAdmission.nationality], ["Previous School", selectedAdmission.previous_school]].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-4 py-2.5"><span className="text-muted-foreground">{l}</span><span className="font-medium text-foreground">{v}</span></div>
                  ))}
                </div>
              </div>

              {/* Guardian */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Parent / Guardian</p>
                <div className="bg-muted/40 rounded-xl divide-y divide-border text-sm">
                  {[["Name", selectedAdmission.parent_name], ["Relationship", selectedAdmission.parent_relationship], ["Phone", selectedAdmission.parent_phone], ["Email", selectedAdmission.parent_email]].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-4 py-2.5"><span className="text-muted-foreground">{l}</span><span className="font-medium text-foreground">{v}</span></div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Supporting Documents</p>
                <div className="space-y-2">
                  {([["KJSEA Result Slip", selectedAdmission.kjsea_result_url], ["Birth Certificate", selectedAdmission.birth_cert_url], ["Passport Photo", selectedAdmission.passport_photo_url], ["School Leaving Certificate", selectedAdmission.school_leaving_cert_url], ["Medical Report", selectedAdmission.medical_report_url]] as [string, string][]).map(([label, url]) => (
                    <div key={label} className="flex items-center justify-between bg-muted/40 rounded-lg px-4 py-2.5 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary font-medium hover:underline text-xs">
                          <ExternalLink className="w-3.5 h-3.5" /> View
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin notes */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Admin Notes</p>
                <textarea
                  value={admissionNotes}
                  onChange={e => setAdmissionNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this application (optional)..."
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Action buttons */}
              {selectedAdmission.status !== "accepted" && selectedAdmission.status !== "rejected" && (
                <div className="flex gap-3">
                  <button onClick={() => handleAdmissionStatus(selectedAdmission.id, "accepted")} disabled={admissionActionLoading} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {admissionActionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Accept
                  </button>
                  <button onClick={() => handleAdmissionStatus(selectedAdmission.id, "rejected")} disabled={admissionActionLoading} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
                    {admissionActionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              )}
              {(selectedAdmission.status === "accepted" || selectedAdmission.status === "rejected") && (
                <div className="flex gap-3">
                  <button onClick={() => handleAdmissionStatus(selectedAdmission.id, selectedAdmission.status === "accepted" ? "rejected" : "accepted")} disabled={admissionActionLoading} className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground font-semibold py-2.5 rounded-xl text-sm hover:bg-muted transition-colors disabled:opacity-50">
                    <RefreshCw className="w-4 h-4" /> Reverse Decision
                  </button>
                  <button onClick={() => handleDeleteAdmission(selectedAdmission.id)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 border border-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Testimonial Modal ── */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTestimonialModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">Add Testimonial</h3>
              <button onClick={() => setShowTestimonialModal(false)} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Student Name</label>
                <Input required value={testimonialForm.student_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, student_name: e.target.value })} placeholder="Kevin Mwangi" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Year/Class</label>
                <Input required value={testimonialForm.year} onChange={(e) => setTestimonialForm({ ...testimonialForm, year: e.target.value })} placeholder="Form 4R" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Quote</label>
                <textarea required value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} placeholder="The brotherhood at Kakamega..." rows={4} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {submitting ? "Saving..." : "Add Testimonial"}
                </Button>
                <Button type="button" variant="outline" disabled={submitting} onClick={() => setShowTestimonialModal(false)}>Cancel</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;