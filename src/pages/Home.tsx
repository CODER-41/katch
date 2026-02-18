import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  Trophy,
  BookOpen,
  Calendar,
  ArrowRight,
  Star,
  MapPin,
  Clock
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { fadeUp } from "@/lib/animations";
import heroImage from "@/assets/hero-school.jpg";
import academicsImage from "@/assets/academics.jpg";
import studentLifeImage from "@/assets/student-life.jpg";

const stats = [
  { icon: Calendar, value: "1932", label: "Established" },
  { icon: Users, value: "2,500+", label: "Students" },
  { icon: Trophy, value: "100+", label: "Awards Won" },
  { icon: GraduationCap, value: "50K+", label: "Alumni" },
];

const newsItems = [
  {
    title: "KCSE 2025 Results: Record Performance",
    excerpt: "Kakamega School records the best KCSE results in its history with a mean grade of A-.",
    date: "Jan 15, 2026",
    category: "Academics",
  },
  {
    title: "Green Commandos Win Rugby Championship",
    excerpt: "Our rugby team clinches the national secondary school championship for the 5th consecutive year.",
    date: "Dec 8, 2025",
    category: "Sports",
  },
  {
    title: "New Science Laboratory Complex Opened",
    excerpt: "A state-of-the-art science facility with modern equipment has been inaugurated.",
    date: "Nov 22, 2025",
    category: "Facilities",
  },
];

const quickLinks = [
  { title: "Academics", desc: "Explore our CBC curriculum and programs", icon: BookOpen, to: "/academics", image: academicsImage },
  { title: "Student Life", desc: "Sports, clubs, and beyond the classroom", icon: Star, to: "/student-life", image: studentLifeImage },
];

const Home = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Kakamega School campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4"
          >
            Government African School Kakamega
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            Kakamega School
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            A premier national school nurturing academic excellence, character, and leadership since 1932.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-base"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 font-semibold px-8 py-3.5 rounded-lg hover:bg-primary-foreground/20 transition-colors text-base"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-3xl md:text-4xl font-display font-bold">{stat.value}</p>
                <p className="text-sm opacity-70 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Cards */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Explore Our School
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover what makes Kakamega School a leading institution in Kenya.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <Link
                  to={link.to}
                  className="group block rounded-xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-shadow border border-border"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={link.image}
                      alt={link.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <link.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-display text-xl font-semibold text-foreground">{link.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{link.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Latest News</h2>
            <Link to="/news" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <motion.article
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {item.date}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Green Commandos?
          </h2>
          <p className="opacity-80 mb-8 text-lg">
            Admissions are now open for the next academic year. Begin your journey at Kakamega School today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Apply for Admission <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/30 font-semibold px-8 py-3.5 rounded-lg hover:bg-primary-foreground/20 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
