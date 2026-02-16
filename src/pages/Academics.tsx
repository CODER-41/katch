import { motion } from "framer-motion";
import { BookOpen, FlaskConical, Globe, Calculator, Palette, Dumbbell, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import academicsImage from "@/assets/academics.jpg";

const subjects = [
  { icon: Calculator, name: "Mathematics", desc: "Pure and applied mathematics with practical problem solving." },
  { icon: FlaskConical, name: "Sciences", desc: "Biology, Chemistry, Physics with modern laboratory work." },
  { icon: Globe, name: "Languages", desc: "English, Kiswahili, French — fostering communication skills." },
  { icon: BookOpen, name: "Humanities", desc: "History, Geography, CRE, and Social Studies." },
  { icon: Palette, name: "Creative Arts", desc: "Music, Art & Design, and creative writing programs." },
  { icon: Dumbbell, name: "Physical Education", desc: "Comprehensive sports and physical wellness curriculum." },
];

const results = [
  { year: "2025", meanGrade: "A-", universityEntry: "92%" },
  { year: "2024", meanGrade: "B+", universityEntry: "89%" },
  { year: "2023", meanGrade: "B+", universityEntry: "87%" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Academics = () => {
  return (
    <Layout>
      <PageHero
        title="Academics"
        subtitle="A rigorous curriculum designed to develop well-rounded scholars."
        backgroundImage={academicsImage}
      />

      {/* CBC Info */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Competency-Based Curriculum (CBC)
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Kakamega School has fully embraced Kenya's Competency-Based Curriculum, focusing on developing each learner's potential through practical, skills-based education. Our teaching approach emphasizes critical thinking, creativity, and real-world problem solving.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With well-equipped laboratories, a modern library, and dedicated teaching staff, we ensure every student receives the support needed to excel academically and develop holistic competencies for the 21st century.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Subjects Offered</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s, i) => (
              <motion.div key={s.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 shadow-sm border border-border text-center hover:shadow-md transition-shadow">
                <s.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">KCSE Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 font-semibold text-foreground">Year</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Mean Grade</th>
                  <th className="py-3 px-4 font-semibold text-foreground">University Entry</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.year} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-foreground font-medium">{r.year}</td>
                    <td className="py-3 px-4">
                      <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">{r.meanGrade}</span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{r.universityEntry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Academics;
