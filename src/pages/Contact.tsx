import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { z } from "zod";
import { toast } from "sonner";
import { submitContact } from "@/services/api"; // Import real API function

// Zod schema for form validation
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type FormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state while submitting

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using zod schema
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Send form data to Flask backend
      const data = await submitContact(form);

      if (data.message) {
        // Show success state
        setSubmitted(true);
        toast.success("Message sent successfully! We'll get back to you soon.");
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to Kakamega School."
        backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530037/Tuition_Block_qc0z0n.jpg"
      />
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-2xl font-bold text-foreground">Get in Touch</h2>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Address", value: "P.O. Box 90-50100, Kakamega" },
                  { icon: Phone, label: "Phone", value: "+254 759 340 116" },
                  { icon: Mail, label: "Email", value: "kakamegasch@gmail.com" },
                  { icon: Clock, label: "Office Hours", value: "Mon - Fri: 8:00 AM - 5:00 PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Map Placeholder */}
              <div className="rounded-xl overflow-hidden border border-border h-48 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">📍 Kakamega, Kenya</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                // Success state after form submission
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card rounded-xl p-10 border border-border text-center"
                >
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for contacting us. We'll respond within 1-2 business days.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="mt-6 text-primary font-medium hover:underline text-sm"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border space-y-5">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">Send a Message</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="you@example.com"
                      />
                      {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Subject *</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select subject</option>
                        <option value="Admissions">Admissions</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Fees">Fees & Payments</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="How can we help you?"
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;