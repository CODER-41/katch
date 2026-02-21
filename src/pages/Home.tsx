import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, Trophy, BookOpen,
  Calendar, ArrowRight, Star, Clock, RefreshCw
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getNews } from "@/services/api"; // Import real API functions
import heroImage from "@/assets/school-gate.jpeg";
import schoolBadge from "@/assets/school-badge.jpeg";

// Interface matching News model from Flask backend
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
}

// Quick links - static content
const quickLinks = [
  { title: "Academics", desc: "Explore our CBC curriculum and programs", icon: BookOpen, to: "/academics", image: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771530054/students_jlv803.jpg" },
  { title: "Student Life", desc: "Sports, clubs, and beyond the classroom", icon: Star, to: "/student-life", image: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771707270/studentlife_jpcxuq.png" },
];

// Animation variants for fade up effect
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

// Format date from ISO string to readable format
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

const Home = () => {
  // State for latest news from backend
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // State for school stats from backend
  const [stats, setStats] = useState<{ icon: React.ElementType; value: string; label: string }[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch latest 3 news articles from backend
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const data = await getNews();
      // Show only the latest 3 news articles on homepage
      setNews(data.slice(0, 3));
    } catch (err) {
      console.error("Could not load news:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch school stats from backend
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/stats/");
      const data = await res.json();

      // Map icon to each stat based on stat_key
      const iconMap: Record<string, React.ElementType> = {
        total_students: Users,
        teaching_staff: Users,
        mean_grade: GraduationCap,
        clubs: Trophy,
        years_excellence: Calendar,
        classrooms: BookOpen,
      };

      // Convert backend stats to display format
      const mapped = data.map((s: { stat_key: string; stat_value: string; stat_label: string }) => ({
        icon: iconMap[s.stat_key] || Trophy,
        value: s.stat_value,
        label: s.stat_label
      }));

      setStats(mapped);
    } catch (err) {
      console.error("Could not load stats:", err);
      // Fallback to hardcoded stats if backend fails
      setStats([
        { icon: Calendar, value: "1932", label: "Established" },
        { icon: Users, value: "2,500+", label: "Students" },
        { icon: Trophy, value: "100+", label: "Awards Won" },
        { icon: GraduationCap, value: "50K+", label: "Alumni" },
      ]);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch both when page loads
  useEffect(() => {
    fetchNews();
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImage} alt="Kakamega School Gate" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden md:block" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden md:block" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* School Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            className="mb-6"
          >
            <img
              src={schoolBadge}
              alt="Kakamega School Badge"
              className="w-28 h-28 md:w-36 md:h-36 mx-auto drop-shadow-[0_0_20px_rgba(255,200,0,0.3)] rounded-full border-2 border-gold/30"
            />
          </motion.div>
          {/* Slang name */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 0.8 }}
            className="text-gold font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-2"
          >
            "KATCH"
          </motion.p>
          {/* School name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl md:text-8xl font-extrabold text-white mb-4 leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          >
            Kakamega
            <span className="block text-gold">School</span>
          </motion.h1>
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white/80 text-base md:text-xl max-w-2xl mx-auto mb-6 font-body font-light"
          >
            A national school nurturing academic excellence, character, and leadership since <strong className="text-gold font-semibold">1932</strong>.
          </motion.p>
          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center"
          >
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform text-base shadow-lg shadow-gold/20"
            >
              Explore Katch <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section - fetched from backend */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            // Loading spinner while fetching stats
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin opacity-70" />
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Quick Links Cards - static content */}
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
                      style={link.title === "Student Life" ? { objectPosition: '50% 20%' } : {}}
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

      {/* Latest News - fetched from backend */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Latest News</h2>
            <Link to="/news" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading spinner while fetching news */}
          {newsLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : news.length === 0 ? (
            // Empty state when no news in database
            <div className="text-center py-10">
              <p className="text-muted-foreground">No news articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((item, i) => (
                <motion.article
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  {/* Category badge */}
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-4 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.excerpt}</p>
                  {/* Date from database */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(item.created_at)}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Katch?
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