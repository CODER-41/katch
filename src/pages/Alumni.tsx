import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Heart, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";

const notableAlumni = [
  { name: "Hon. Moody Awori", achievement: "Former Vice President of Kenya", desc: "Served as Kenya's 9th Vice President (2003-2008) and held multiple ministerial positions. A distinguished lawyer and statesman, his leadership exemplified the discipline and excellence instilled at Kakamega School." },
  { name: "Hon. Najib Balala", achievement: "Former Cabinet Secretary for Tourism & Wildlife", desc: "Former Cabinet Secretary for Tourism and Wildlife, instrumental in transforming Kenya's tourism sector. His vision and dedication reflect the all-round education that shaped him at Katch." },
  { name: "Hon. Kenneth Marende", achievement: "9th Speaker of National Assembly", desc: "Served as Speaker of Kenya's National Assembly (2008-2013), presiding over critical constitutional reforms. His impartiality and legal acumen trace back to the values learned at Katch." },
  { name: "Dr. Boni Khalwale", achievement: "Senator & Medical Doctor", desc: "A respected politician and medical practitioner, serving as Senator for Kakamega County. His commitment to public service embodies the leadership culture nurtured at Kakamega School." },
  { name: "Hon. Amos Wako", achievement: "Former Attorney General of Kenya", desc: "Served as Kenya's Attorney General for 20 years (1991-2011), one of the longest-serving in the Commonwealth. His legal expertise and integrity reflect the academic rigor of his alma mater." },
];

const waysToGiveBack = [
  { icon: GraduationCap, title: "Scholarships", desc: "Sponsor a student's education and help shape the future of a young Green Commando." },
  { icon: Heart, title: "Infrastructure", desc: "Contribute to school facilities — libraries, labs, dormitories, and sports complexes." },
  { icon: Users, title: "Mentorship", desc: "Share your professional experience and guide current students in career choices." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Alumni = () => {
  return (
    <Layout>
      {/* Custom Hero for Alumni */}
      <section className="relative min-h-[340px] md:min-h-[420px] flex items-end justify-center overflow-hidden">
        <img
          src="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530979/katch_teke0a.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 20%' }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent" />
        <div className="relative z-10 text-center px-4 py-8 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            Alumni
          </h1>
          <p className="text-lg md:text-xl text-black/80 max-w-2xl mx-auto">
            Once a Katcherian always a Katcherian.
          </p>
        </div>
      </section>

      {/* Notable Alumni */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-center mb-8">
            <img 
              src="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530999/kakamega_school_alumni_association_lbuqas.png" 
              alt="Kakamega School Alumni Association" 
              className="h-32 w-auto object-contain"
            />
          </div>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">The School We Know: A Legacy of Grit and Glory</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              In the "School We Know," leadership isn't just taught in a hall; it's forged on the pitch and in the scrum. Kakamega School has a unique identity where the line between a school Academics and a professional sports entity blurs, creating a culture of excellence that stays with its alumni for life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notableAlumni.map((person, i) => (
              <motion.div key={person.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{person.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{person.achievement}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{person.desc}</p>
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
          <p className="opacity-80 mb-6">Join the Kakamega School Alumni Association and stay connected with your fellow Katch alumni.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Alumni;
