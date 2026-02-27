import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, ChevronRight, ChevronLeft, Upload, FileText,
  User, Users, BookOpen, ClipboardList, AlertCircle, Loader2,
  GraduationCap, Mail, Flag
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { z } from "zod";
import { toast } from "sonner";
import { submitAdmission } from "@/services/api";

// ── KJSEA grade band helper ───────────────────────────────────────────────────
const CUTOFF = 50;
function getGradeBand(score: number) {
  if (score >= 60) return { band: "EE", label: "Exceeds Expectation", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  if (score >= 50) return { band: "ME", label: "Meets Expectation", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  if (score >= 40) return { band: "AE", label: "Approaching Expectation", color: "text-yellow-600", bg: "bg-amber-50 border-amber-200" };
  return { band: "BE", label: "Below Expectation", color: "text-red-500", bg: "bg-red-50 border-red-200" };
}

// ── Zod schemas per step ─────────────────────────────────────────────────────
const step1Schema = z.object({
  applicant_name: z.string().trim().min(2, "Full name is required"),
  gender: z.enum(["Male", "Female"], { errorMap: () => ({ message: "Please select a gender" }) }),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().trim().min(1, "Nationality is required"),
  previous_school: z.string().trim().min(2, "Previous school is required"),
});
const step2Schema = z.object({
  parent_name: z.string().trim().min(2, "Guardian name is required"),
  parent_relationship: z.string().min(1, "Relationship is required"),
  parent_phone: z.string().trim().min(10, "Valid phone number required"),
  parent_email: z.string().trim().email("Valid email address required"),
});
const step3Schema = z.object({
  kjsea_score: z.number({ invalid_type_error: "Score is required" }).min(0).max(72, "Score cannot exceed 72"),
});

// ── Cloudinary widget type ───────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { cloudinary: any; }
}
const CLOUD_NAME = "da0mkvthw";
const UPLOAD_PRESET = "admissions_docs";

// ── Step indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { icon: User, label: "Personal" },
  { icon: Users, label: "Guardian" },
  { icon: GraduationCap, label: "KJSEA" },
  { icon: Upload, label: "Documents" },
  { icon: ClipboardList, label: "Review" },
];

type Docs = {
  kjsea_result_url: string;
  birth_cert_url: string;
  passport_photo_url: string;
  school_leaving_cert_url: string;
  medical_report_url: string;
};

const REQUIRED_DOCS: { key: keyof Docs; label: string; required: boolean; hint: string }[] = [
  { key: "kjsea_result_url", label: "KJSEA Result Slip", required: true, hint: "PDF or image of your KJSEA certificate" },
  { key: "birth_cert_url", label: "Birth Certificate", required: true, hint: "Official birth certificate (PDF or image)" },
  { key: "passport_photo_url", label: "Passport Photo", required: true, hint: "Recent passport-size photograph" },
  { key: "school_leaving_cert_url", label: "School Leaving Certificate", required: false, hint: "Certificate from your previous school" },
  { key: "medical_report_url", label: "Medical / Health Report", required: false, hint: "Recent medical certificate (optional)" },
];

// ── Small helper components ───────────────────────────────────────────────────
function ReviewSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="bg-muted/50 rounded-xl divide-y divide-border">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${highlight ? "text-destructive" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Admissions() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [appStatus, setAppStatus] = useState("");
  const scriptLoaded = useRef(false);

  const [personal, setPersonal] = useState({
    applicant_name: "", gender: "" as "Male" | "Female" | "",
    date_of_birth: "", nationality: "Kenyan", previous_school: "",
  });
  const [guardian, setGuardian] = useState({
    parent_name: "", parent_relationship: "", parent_phone: "", parent_email: "",
  });
  const [academic, setAcademic] = useState({ kjsea_score: "" });
  const [docs, setDocs] = useState<Docs>({
    kjsea_result_url: "", birth_cert_url: "", passport_photo_url: "",
    school_leaving_cert_url: "", medical_report_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load Cloudinary widget script
  useEffect(() => {
    if (scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  const openUpload = (docKey: keyof Docs, label: string) => {
    if (!window.cloudinary) { toast.error("Upload widget is loading. Please try again in a moment."); return; }
    window.cloudinary.openUploadWidget(
      { cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET, sources: ["local", "camera"], multiple: false, maxFileSize: 5000000, clientAllowedFormats: ["jpg", "jpeg", "png", "pdf", "webp"] },
      (error: unknown, result: { event: string; info: { secure_url: string } }) => {
        if (!error && result.event === "success") {
          setDocs(prev => ({ ...prev, [docKey]: result.info.secure_url }));
          toast.success(`${label} uploaded successfully`);
        }
      }
    );
  };

  const validateStep = () => {
    setErrors({});
    if (step === 1) {
      const r = step1Schema.safeParse(personal);
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach(i => { e[i.path[0] as string] = i.message; });
        setErrors(e); return false;
      }
    }
    if (step === 2) {
      const r = step2Schema.safeParse(guardian);
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach(i => { e[i.path[0] as string] = i.message; });
        setErrors(e); return false;
      }
    }
    if (step === 3) {
      const r = step3Schema.safeParse({ kjsea_score: academic.kjsea_score === "" ? undefined : Number(academic.kjsea_score) });
      if (!r.success) {
        const e: Record<string, string> = {};
        r.error.issues.forEach(i => { e[i.path[0] as string] = i.message; });
        setErrors(e); return false;
      }
    }
    if (step === 4) {
      const missing = REQUIRED_DOCS.filter(d => d.required && !docs[d.key]);
      if (missing.length) { toast.error(`Please upload: ${missing.map(d => d.label).join(", ")}`); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const back = () => { setErrors({}); setStep(s => Math.max(s - 1, 1)); };

  const resetForm = () => {
    setStep(1); setSubmitted(false);
    setPersonal({ applicant_name: "", gender: "", date_of_birth: "", nationality: "Kenyan", previous_school: "" });
    setGuardian({ parent_name: "", parent_relationship: "", parent_phone: "", parent_email: "" });
    setAcademic({ kjsea_score: "" });
    setDocs({ kjsea_result_url: "", birth_cert_url: "", passport_photo_url: "", school_leaving_cert_url: "", medical_report_url: "" });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...personal, ...guardian, kjsea_score: Number(academic.kjsea_score), ...docs };
      const res = await submitAdmission(payload);
      if (res.application_number) {
        setApplicationNumber(res.application_number);
        setAppStatus(res.status);
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.error || "Submission failed. Please try again.");
      }
    } catch {
      toast.error("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const score = academic.kjsea_score !== "" ? Number(academic.kjsea_score) : null;
  const gradeBand = score !== null ? getGradeBand(score) : null;

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "block text-sm font-medium text-foreground mb-1";
  const errCls = "text-destructive text-xs mt-1";

  // ── Success screen ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Layout>
        <PageHero title="Application Submitted" subtitle="Thank you for applying to Kakamega School" backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530037/Tuition_Block_qc0z0n.jpg" />
        <section className="section-padding bg-background">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Application Received!</h2>
            <div className="bg-muted rounded-xl px-6 py-4 my-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Application Number</p>
              <p className="font-mono text-2xl font-bold text-primary">{applicationNumber}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${appStatus === "flagged" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
              <Flag className="w-4 h-4" />
              {appStatus === "flagged" ? "Flagged for priority review — strong candidate" : "Pending admin review"}
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              A confirmation email has been sent to <strong>{guardian.parent_email}</strong>. Please save your application number for future reference.
            </p>
            <button onClick={resetForm} className="text-primary text-sm font-medium hover:underline">
              Submit another application
            </button>
          </motion.div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHero title="Apply for Admission" subtitle="Begin your journey as a Katcherian — Class of 2026" backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530037/Tuition_Block_qc0z0n.jpg" />

      {/* Info strip */}
      <div className="bg-primary/5 border-b border-border">
        <div className="container mx-auto max-w-4xl px-4 py-3 flex flex-wrap gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" /> KJSEA-based (CBC Curriculum)</span>
          <span className="flex items-center gap-1.5"><Flag className="w-3.5 h-3.5 text-blue-500" /> Auto-flagged if score ≥ 50/72</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> Confirmation sent to guardian's email</span>
        </div>
      </div>

      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-3xl">

          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10 px-2">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <div key={s.label} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                    </div>
                    <span className={`text-xs hidden sm:block font-medium ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${done ? "bg-primary" : "bg-border"}`} />}
                </div>
              );
            })}
          </div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }} className="p-8">

                {/* Step 1 — Personal */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Personal Information</h2>
                      <p className="text-sm text-muted-foreground mt-1">Details about the applicant</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Full Name *</label>
                        <input className={inputCls} placeholder="e.g. John Otieno Mwangi" value={personal.applicant_name} onChange={e => setPersonal(p => ({ ...p, applicant_name: e.target.value }))} />
                        {errors.applicant_name && <p className={errCls}>{errors.applicant_name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Gender *</label>
                        <select className={inputCls} value={personal.gender} onChange={e => setPersonal(p => ({ ...p, gender: e.target.value as "Male" | "Female" }))}>
                          <option value="">Select gender</option>
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                        {errors.gender && <p className={errCls}>{errors.gender}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Date of Birth *</label>
                        <input type="date" className={inputCls} value={personal.date_of_birth} onChange={e => setPersonal(p => ({ ...p, date_of_birth: e.target.value }))} />
                        {errors.date_of_birth && <p className={errCls}>{errors.date_of_birth}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Nationality *</label>
                        <input className={inputCls} placeholder="e.g. Kenyan" value={personal.nationality} onChange={e => setPersonal(p => ({ ...p, nationality: e.target.value }))} />
                        {errors.nationality && <p className={errCls}>{errors.nationality}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Previous School *</label>
                        <input className={inputCls} placeholder="e.g. Kakamega Primary School" value={personal.previous_school} onChange={e => setPersonal(p => ({ ...p, previous_school: e.target.value }))} />
                        {errors.previous_school && <p className={errCls}>{errors.previous_school}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — Guardian */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Parent / Guardian</h2>
                      <p className="text-sm text-muted-foreground mt-1">Contact details for the applicant's guardian</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Guardian Full Name *</label>
                        <input className={inputCls} placeholder="e.g. Mary Otieno" value={guardian.parent_name} onChange={e => setGuardian(g => ({ ...g, parent_name: e.target.value }))} />
                        {errors.parent_name && <p className={errCls}>{errors.parent_name}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Relationship *</label>
                        <select className={inputCls} value={guardian.parent_relationship} onChange={e => setGuardian(g => ({ ...g, parent_relationship: e.target.value }))}>
                          <option value="">Select relationship</option>
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Guardian</option>
                        </select>
                        {errors.parent_relationship && <p className={errCls}>{errors.parent_relationship}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number *</label>
                        <input className={inputCls} placeholder="+254 700 000 000" value={guardian.parent_phone} onChange={e => setGuardian(g => ({ ...g, parent_phone: e.target.value }))} />
                        {errors.parent_phone && <p className={errCls}>{errors.parent_phone}</p>}
                      </div>
                      <div>
                        <label className={labelCls}>Email Address *</label>
                        <input type="email" className={inputCls} placeholder="guardian@example.com" value={guardian.parent_email} onChange={e => setGuardian(g => ({ ...g, parent_email: e.target.value }))} />
                        {errors.parent_email && <p className={errCls}>{errors.parent_email}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — KJSEA */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">KJSEA Results</h2>
                      <p className="text-sm text-muted-foreground mt-1">Kenya Junior Secondary Education Assessment (CBC Curriculum) — Total: 72 points</p>
                    </div>
                    <div className="max-w-xs">
                      <label className={labelCls}>Total KJSEA Score * <span className="text-muted-foreground font-normal">(0 – 72)</span></label>
                      <input type="number" min="0" max="72" step="0.5" className={inputCls} placeholder="e.g. 58" value={academic.kjsea_score} onChange={e => setAcademic({ kjsea_score: e.target.value })} />
                      {errors.kjsea_score && <p className={errCls}>{errors.kjsea_score}</p>}
                    </div>

                    {gradeBand && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-5 ${gradeBand.bg}`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-3xl font-bold font-mono ${gradeBand.color}`}>{score}/72</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full bg-white/70 ${gradeBand.color}`}>{gradeBand.band}</span>
                        </div>
                        <p className={`text-sm font-semibold mb-3 ${gradeBand.color}`}>{gradeBand.label}</p>
                        <div className="h-2 rounded-full bg-white/50">
                          <div className={`h-2 rounded-full transition-all ${score! >= 60 ? "bg-green-500" : score! >= 50 ? "bg-blue-500" : score! >= 40 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${(score! / 72) * 100}%` }} />
                        </div>
                      </motion.div>
                    )}

                    {score !== null && (
                      <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm border ${score >= CUTOFF ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        {score >= CUTOFF ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <p>{score >= CUTOFF ? "Your score meets the minimum threshold and will be flagged for priority review by the admissions team." : `The minimum score for priority consideration is ${CUTOFF}/72. Your application will still be received and reviewed.`}</p>
                      </div>
                    )}

                    {/* Grade band reference table */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">KJSEA Grade Bands</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { band: "EE", range: "60–72", color: "text-green-600", bg: "bg-green-50 border-green-200" },
                          { band: "ME", range: "50–59", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                          { band: "AE", range: "40–49", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                          { band: "BE", range: "0–39",  color: "text-red-500",  bg: "bg-red-50 border-red-200"  },
                        ].map(g => (
                          <div key={g.band} className={`${g.bg} border rounded-lg px-3 py-2.5 text-center`}>
                            <p className={`font-bold text-sm ${g.color}`}>{g.band}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{g.range}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4 — Documents */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Supporting Documents</h2>
                      <p className="text-sm text-muted-foreground mt-1">Upload clear scans or photos. Accepted formats: JPG, PNG, PDF (max 5 MB each)</p>
                    </div>
                    <div className="space-y-3">
                      {REQUIRED_DOCS.map(doc => {
                        const uploaded = !!docs[doc.key];
                        return (
                          <div key={doc.key} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${uploaded ? "border-green-300 bg-green-50" : "border-border bg-card"}`}>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${uploaded ? "bg-green-100" : "bg-muted"}`}>
                              {uploaded ? <CheckCircle className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {doc.label} {doc.required && <span className="text-destructive">*</span>}
                              </p>
                              <p className="text-xs text-muted-foreground">{uploaded ? "Uploaded successfully ✓" : doc.hint}</p>
                            </div>
                            <button type="button" onClick={() => openUpload(doc.key, doc.label)} className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${uploaded ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-primary text-primary-foreground hover:opacity-90"}`}>
                              <Upload className="w-3.5 h-3.5" />
                              {uploaded ? "Replace" : "Upload"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">Documents marked <span className="text-destructive font-medium">*</span> are required to proceed.</p>
                  </div>
                )}

                {/* Step 5 — Review */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">Review & Submit</h2>
                      <p className="text-sm text-muted-foreground mt-1">Verify all details before submitting your application.</p>
                    </div>
                    <ReviewSection title="Personal Information" icon={User}>
                      <ReviewRow label="Full Name" value={personal.applicant_name} />
                      <ReviewRow label="Gender" value={personal.gender} />
                      <ReviewRow label="Date of Birth" value={personal.date_of_birth} />
                      <ReviewRow label="Nationality" value={personal.nationality} />
                      <ReviewRow label="Previous School" value={personal.previous_school} />
                    </ReviewSection>
                    <ReviewSection title="Parent / Guardian" icon={Users}>
                      <ReviewRow label="Name" value={guardian.parent_name} />
                      <ReviewRow label="Relationship" value={guardian.parent_relationship} />
                      <ReviewRow label="Phone" value={guardian.parent_phone} />
                      <ReviewRow label="Email" value={guardian.parent_email} />
                    </ReviewSection>
                    <ReviewSection title="KJSEA Results" icon={GraduationCap}>
                      <ReviewRow label="Score" value={`${academic.kjsea_score} / 72`} />
                      {gradeBand && <ReviewRow label="Grade Band" value={`${gradeBand.band} — ${gradeBand.label}`} />}
                    </ReviewSection>
                    <ReviewSection title="Documents" icon={FileText}>
                      {REQUIRED_DOCS.map(d => (
                        <ReviewRow key={d.key} label={d.label} value={docs[d.key] ? "Uploaded ✓" : "Not uploaded"} highlight={!docs[d.key] && d.required} />
                      ))}
                    </ReviewSection>
                    <p className="text-xs text-muted-foreground border-t border-border pt-4">
                      By submitting you confirm that all information provided is accurate. Providing false information will result in disqualification.
                    </p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="px-8 pb-8 flex items-center justify-between">
              <button onClick={back} disabled={step === 1} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              {step < 5 ? (
                <button onClick={next} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><CheckCircle className="w-4 h-4" /> Submit Application</>}
                </button>
              )}
            </div>
          </div>

          {/* Info cards */}
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: BookOpen, title: "CBC Curriculum", desc: "Admission is based on your KJSEA score under the new CBC curriculum" },
              { icon: Flag, title: "Auto Ranking", desc: "Scores ≥ 50/72 are automatically flagged for priority consideration" },
              { icon: Mail, title: "Email Updates", desc: "All updates are sent to your guardian's email address" },
            ].map(item => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
