import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Heart, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { fadeUp } from "@/lib/animations";
import alumniImage from "@/assets/alumni.jpg";

const notableAlumni = [
  { name: "Dr. Wycliffe Oparanya", achievement: "Former Governor, Kakamega County", desc: "A distinguished alumnus who served as the Governor of Kakamega County and has been instrumental in development across western Kenya." },
  { name: "Prof. Mary Abukutsa", achievement: "Agricultural Scientist", desc: "A leading researcher in indigenous vegetables, Prof. Abukutsa has been recognized internationally for her contributions to food security." },
  { name: "Eng. Patrick Wainaina", achievement: "CEO, Major Engineering Firm", desc: "A successful engineer and business leader who has overseen major infrastructure projects across East Africa." },
];

const waysToGiveBack = [
  { icon: GraduationCap, title: "Scholarships", desc: "Sponsor a student's education and help shape the future of a young Green Commando." },
  { icon: Heart, title: "Infrastructure", desc: "Contribute to school facilities — libraries, labs, dormitories, and sports complexes." },
  { icon: Users, title: "Mentorship", desc: "Share your professional experience and guide current students in career choices." },
];

const Alumni = () => {
  return (
    <Layout>
      <PageHero
        title="Alumni"
        subtitle="Once a Green Commando, always a Green Commando."
        backgroundImage={alumniImage}
      />

      {/* Notable Alumni */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Notable Alumni</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {notableAlumni.map((person, i) => (
              <motion.div key={person.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{person.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{person.achievement}</p>
                <p className="text-sm text-muted-foreground">{person.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Give Back */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Ways to Give Back</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {waysToGiveBack.map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-md transition-shadow">
                <item.icon className="w-10 h-10 text-gold mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="opacity-80 mb-6">Join the Kakamega School Alumni Association and stay connected with your fellow Green Commandos.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Alumni;
