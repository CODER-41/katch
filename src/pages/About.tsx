import { motion } from "framer-motion";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";
import Layout from "@/components/layout/Layout";

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "We pursue the highest standards of learning and intellectual development." },
  { icon: Heart, title: "Integrity", desc: "We uphold honesty, fairness, and ethical conduct in all endeavors." },
  { icon: Users, title: "Community", desc: "We foster a sense of belonging, teamwork, and mutual respect." },
  { icon: Award, title: "Leadership", desc: "We develop confident leaders who serve with purpose and responsibility." },
];

const leadership = [
  { name: "Dr. James Ochieng", role: "Principal", desc: "Leading Kakamega School with a vision for academic excellence and holistic development." },
  { name: "Mrs. Grace Wanjiku", role: "Deputy Principal, Academics", desc: "Overseeing curriculum implementation and academic affairs." },
  { name: "Mr. Peter Otieno", role: "Deputy Principal, Administration", desc: "Managing school operations, discipline, and student welfare." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const About = () => {
  return (
    <Layout>
      {/* Full-width hero with split content */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-end overflow-hidden">
        <img src="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530046/Hall_c9plwo.jpg" alt="Kakamega School Hall" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 40%' }} loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />

        <div className="relative z-10 w-full container mx-auto px-4 pb-16 pt-32">
          <div className="max-w-5xl">
            {/* About Us heading — left side, on the dark gradient */}
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

      {/* Values */}
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

      {/* Leadership */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">School Leadership</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {leadership.map((person, i) => (
              <motion.div key={person.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground">{person.name}</h4>
                <p className="text-sm text-primary font-medium mb-2">{person.role}</p>
                <p className="text-sm text-muted-foreground">{person.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
