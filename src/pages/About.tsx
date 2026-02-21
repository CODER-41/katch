import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Award, Users, BookOpen, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getStaff } from "@/services/api"; // Import real API function

// Interface matching the Staff model from Flask backend
interface StaffMember {
  id: number;
  name: string;
  photo_url: string;
  subject: string;
  email: string;
  phone: string;
  role: string;
  is_leadership: boolean;
}

// Core values data - static content, no need to fetch from backend
const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "We pursue the highest standards of learning and intellectual development." },
  { icon: Heart, title: "Integrity", desc: "We uphold honesty, fairness, and ethical conduct in all endeavors." },
  { icon: Users, title: "Community", desc: "We foster a sense of belonging, teamwork, and mutual respect." },
  { icon: Award, title: "Leadership", desc: "We develop confident leaders who serve with purpose and responsibility." },
];

// Animation variants for fade up effect
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const About = () => {
  // State for leadership staff fetched from backend
  const [leadership, setLeadership] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch staff and filter only leadership members
  const fetchLeadership = async () => {
    setLoading(true);
    try {
      const data = await getStaff();
      // Filter only staff marked as leadership/management
      const leaders = data.filter((s: StaffMember) => s.is_leadership);
      setLeadership(leaders);
    } catch (err) {
      console.error("Could not load leadership:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leadership when page loads
  useEffect(() => {
    fetchLeadership();
  }, []);

  return (
    <Layout>
      {/* Full-width hero with split content */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-end overflow-hidden">
        <img
          src="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530046/Hall_c9plwo.jpg"
          alt="Kakamega School Hall"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />
        <div className="relative z-10 w-full container mx-auto px-4 pb-16 pt-32">
          <div className="max-w-5xl">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-gold font-bold tracking-[0.2em] uppercase text-xs mb-3">Est. 1932</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                About <span className="text-gold">Katch</span>
              </h1>
              <p className="text-white/80 text-base md:text-lg font-body leading-relaxed max-w-md">
                Nurturing excellence since 1932 — The home of Katch, a premier national school in the heart of Western Kenya.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History, Mission & Vision */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <BookOpen className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our History</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Established in 1932 as one of Kenya's oldest and most prestigious national secondary schools. Affectionately known as "Katch," the school has produced thousands of graduates who have become leaders in government, business, academia, and the arts.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                To provide quality education that nurtures intellectual, moral, and physical development, empowering students to become responsible, innovative, and globally competitive citizens.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} className="bg-card rounded-xl p-8 shadow-sm border border-border">
              <Eye className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-3">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                To be a centre of academic excellence, innovation, and character formation that produces all-round individuals ready to transform society and contribute to national and global development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="flex gap-4 p-6 rounded-xl bg-card border border-border">
                <v.icon className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-lg font-semibold text-foreground mb-1">{v.title}</h4>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* School Leadership - fetched from backend */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            School Leadership
          </h2>

          {/* Loading spinner while fetching leadership */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : leadership.length === 0 ? (
            // Empty state when no leadership staff in database
            <div className="text-center py-10">
              <p className="text-muted-foreground">No leadership profiles available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {leadership.map((person, i) => (
                <motion.div
                  key={person.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card rounded-xl p-6 text-center shadow-sm border border-border"
                >
                  {/* Show photo if available, otherwise show initials */}
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                    {person.photo_url ? (
                      <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-lg font-semibold text-foreground">{person.name}</h4>
                  <p className="text-sm text-primary font-medium mb-2">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.subject}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default About;