import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import { getNews, getEvents } from "@/services/api"; // Import real API functions

// Interface matching the News model from Flask backend
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  created_at: string;
}

// Interface matching the Event model from Flask backend
interface EventItem {
  id: number;
  title: string;
  date: string;
  description: string;
  created_at: string;
}

// Animation variants for fade up effect
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
  }),
};

const News = () => {
  // State for news articles from backend
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  // State for events from backend
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Fetch news articles from Flask backend
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const data = await getNews();
      setNews(data);
    } catch (err) {
      console.error("Could not load news:", err);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch upcoming events from Flask backend
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Could not load events:", err);
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch both news and events when page loads
  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  // Format date from ISO string to readable format e.g "21 Feb 2026"
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Layout>
      <PageHero
        title="News & Events"
        subtitle="Stay updated with the latest happenings at Kakamega School."
        backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771530042/tuition_square_t7zcrl.jpg"
      />

      {/* News Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            Latest News
          </h2>

          {/* Loading spinner while fetching news */}
          {newsLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : news.length === 0 ? (
            // Empty state when no news in database
            <div className="text-center py-20">
              <p className="text-muted-foreground">No news articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {item.excerpt}
                  </p>
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

      {/* Events Section */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            Upcoming Events
          </h2>

          {/* Loading spinner while fetching events */}
          {eventsLoading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : events.length === 0 ? (
            // Empty state when no events in database
            <div className="text-center py-20">
              <p className="text-muted-foreground">No upcoming events yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card rounded-xl p-6 border border-border flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Event date badge */}
                  <div className="bg-primary/10 text-primary font-bold text-center rounded-lg px-4 py-3 shrink-0">
                    <p className="text-sm">{event.date}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default News;