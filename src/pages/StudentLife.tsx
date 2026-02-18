import { motion } from "framer-motion";
import { Trophy, Music, Microscope, Globe2, Volleyball, Drama } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import studentLifeImage from "@/assets/student-life.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

const activities = [
  { icon: Volleyball, title: "Sports", items: ["Rugby", "Football", "Athletics", "Swimming", "Basketball", "Volleyball"] },
  { icon: Music, title: "Performing Arts", items: ["Choir", "Drama Club", "Dance Troupe", "School Band"] },
  { icon: Microscope, title: "Academic Clubs", items: ["Science Club", "Debate Society", "Mathematics Club", "ICT Club"] },
  { icon: Globe2, title: "Service & Leadership", items: ["Scouts", "Red Cross", "Environmental Club", "Peer Counseling"] },
  { icon: Drama, title: "Cultural Activities", items: ["Cultural Week", "Language Clubs", "Creative Writing", "Poetry Recitation"] },
  { icon: Trophy, title: "Competitions", items: ["National Science Congress", "KCSE Mock Exams", "Inter-School Sports", "Music Festivals"] },
];

const testimonials = [
  { name: "Kevin Mwangi", year: "Form 4", quote: "The brotherhood at Kakamega is unlike any other. The Green Commando spirit stays with you forever." },
  { name: "Brian Odhiambo", year: "Form 3", quote: "The teachers here don't just teach — they mentor and inspire us to reach our full potential." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const StudentLife = () => {
  return (
    <Layout>
      <PageHero
        title="Student Life"
        subtitle="Beyond the classroom — where character is built and memories are made."
        backgroundImage={studentLifeImage}
      />

      {/* Activities */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Co-Curricular Activities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a, i) => (
              <motion.div key={a.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <a.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{a.title}</h3>
                <ul className="space-y-1.5">
                  {a.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life Photos */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Life on Campus
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-md">
              <img src={gallery1} alt="Science laboratory" className="w-full h-64 object-cover" loading="lazy" />
              <div className="p-4 bg-card">
                <p className="font-semibold text-foreground">Science Laboratory</p>
                <p className="text-sm text-muted-foreground">Hands-on experiments in our modern labs</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-xl overflow-hidden shadow-md">
              <img src={gallery2} alt="School assembly" className="w-full h-64 object-cover" loading="lazy" />
              <div className="p-4 bg-card">
                <p className="font-semibold text-foreground">Morning Assembly</p>
                <p className="text-sm text-muted-foreground">Building unity and school spirit</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Student Voices
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.blockquote key={t.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border">
                <p className="text-foreground italic mb-4 leading-relaxed">"{t.quote}"</p>
                <footer className="text-sm">
                  <strong className="text-foreground">{t.name}</strong>
                  <span className="text-muted-foreground ml-2">— {t.year}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StudentLife;
