import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";

const allNews = [
  { title: "KCSE 2025 Results: Record Performance", excerpt: "Kakamega School records the best KCSE results in its history with a mean grade of A-.", date: "Jan 15, 2026", category: "Academics" },
  { title: "Barbarians Win Rugby Championship", excerpt: "Our rugby team, the Barbarians, clinches the national secondary school championship for the 5th consecutive year.", date: "Dec 8, 2025", category: "Sports" },
  { title: "New Science Laboratory Complex Opened", excerpt: "A state-of-the-art science facility with modern equipment has been inaugurated.", date: "Nov 22, 2025", category: "Facilities" },
  { title: "Annual Cultural Week Celebrations", excerpt: "Students showcase diverse Kenyan cultures through music, dance, and traditional cuisine.", date: "Oct 15, 2025", category: "Events" },
  { title: "Kakamega Students Excel at National Science Congress", excerpt: "Three students qualify for the East African Science Congress with innovative projects.", date: "Sep 30, 2025", category: "Academics" },
  { title: "Tree Planting Day: 1,000 Trees Planted", excerpt: "Students and staff join the national tree planting initiative, planting 1,000 indigenous trees on campus.", date: "Sep 10, 2025", category: "Environment" },
];

const events = [
  { title: "Open Day", date: "March 15, 2026", desc: "Parents and prospective students are invited to tour the campus and meet faculty." },
  { title: "Inter-House Sports", date: "April 5, 2026", desc: "Annual inter-house athletics competition featuring all four school houses." },
  { title: "Speech & Prize Giving Day", date: "November 20, 2026", desc: "Celebrating academic and co-curricular achievements of the year." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const News = () => {
  return (
    <Layout>
      <PageHero
        title="News & Events"
        subtitle="Stay updated with the latest happenings at Kakamega School."
        backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530042/tuition_square_t7zcrl.jpg"
      />

      {/* News */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">Latest News</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allNews.map((item, i) => (
              <motion.article key={item.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{item.category}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-4 mb-2">{item.title}</h3>
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

      {/* Events */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, i) => (
              <motion.div key={event.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-card rounded-xl p-6 border border-border flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="bg-primary/10 text-primary font-bold text-center rounded-lg px-4 py-3 shrink-0">
                  <p className="text-sm">{event.date}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default News;
