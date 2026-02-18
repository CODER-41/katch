import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, CalendarDays, HelpCircle, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { fadeUp } from "@/lib/animations";
import heroImage from "@/assets/hero-school.jpg";

const steps = [
  { step: "1", title: "Obtain KCPE Results", desc: "Ensure you have your Kenya Certificate of Primary Education results slip." },
  { step: "2", title: "Check Selection", desc: "Confirm you have been selected to Kakamega School through the Ministry of Education placement." },
  { step: "3", title: "Prepare Documents", desc: "Gather all required documents including birth certificate, KCPE result slip, and passport photos." },
  { step: "4", title: "Report to School", desc: "Report on the designated opening day with all documents and required fees." },
];

const requirements = [
  "KCPE result slip (original and copy)",
  "Birth certificate (original and copy)",
  "4 passport-sized photographs",
  "Primary school leaving certificate",
  "Medical/health report",
  "Fee payment receipt",
];

const faqs = [
  { q: "What is the admission criterion?", a: "Students are admitted through the national placement system based on KCPE performance. Kakamega School is a national school and admits top-performing students from across Kenya." },
  { q: "When does the academic year begin?", a: "The academic year typically begins in January with three terms: January–April, May–August, and September–November." },
  { q: "Is Kakamega School a boarding school?", a: "Yes, Kakamega School is a fully residential boarding school. All students live on campus during the school term." },
  { q: "What are the school fees?", a: "As a national school, fees are regulated by the government. Please contact the admissions office for the current fee structure." },
];

const Admissions = () => {
  return (
    <Layout>
      <PageHero
        title="Admissions"
        subtitle="Join the Green Commandos — Begin your journey at Kakamega School."
        backgroundImage={heroImage}
      />

      {/* Process */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Admission Process
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="flex gap-4 p-6 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">Required Documents</h2>
          </div>
          <div className="bg-card rounded-xl p-8 border border-border">
            <ul className="space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="font-display text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-card rounded-xl border border-border p-6 group"
              >
                <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="opacity-80 mb-6">Our admissions office is ready to help you with any inquiries about joining Kakamega School.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity">
            Contact Admissions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Admissions;
