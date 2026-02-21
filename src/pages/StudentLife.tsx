import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Music, Microscope, Globe2, Volleyball, Drama, RefreshCw } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { getTestimonials, getGallery } from "@/services/api"; // Import real API functions

// Interface matching Testimonial model from Flask backend
interface Testimonial {
  id: number;
  student_name: string;
  year: string;
  quote: string;
  created_at: string;
}

// Interface matching Gallery model from Flask backend
interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  category: string;
  created_at: string;
}

// Co-curricular activities - static content, no need for backend
const activities = [
  { icon: Volleyball, title: "Sports", items: ["Rugby", "Football", "Athletics", "Basketball", "Volleyball", "Hockey"] },
  { icon: Music, title: "Performing Arts", items: ["Choir", "Drama Club", "School Band", "Poetry Recitation"] },
  { icon: Microscope, title: "Academic Clubs", items: ["Science Club", "Debate Society", "Mathematics Club", "ICT Club"] },
  { icon: Globe2, title: "Service & Leadership", items: ["Scouts", "Red Cross", "Environmental Club", "Peer Counseling"] },
  { icon: Drama, title: "Cultural Activities", items: ["Cultural Week", "Language Clubs", "Creative Writing", "Poetry Recitation"] },
  { icon: Trophy, title: "Competitions", items: ["National Science Congress", "KCSE Mock Exams", "Inter-Classes Sports", "Music Festivals"] },
];

// Animation variants for fade up effect
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const StudentLife = () => {
  // State for testimonials fetched from backend
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // State for gallery images fetched from backend
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  // Fetch testimonials from Flask backend
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Could not load testimonials:", err);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Fetch gallery images and show only first 2 on this page
  const fetchGallery = async () => {
    setGalleryLoading(true);
    try {
      const data = await getGallery();
      setGalleryImages(data.slice(0, 2));
    } catch (err) {
      console.error("Could not load gallery:", err);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Fetch both when page loads
  useEffect(() => {
    fetchTestimonials();
    fetchGallery();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[340px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://res.cloudinary.com/da0mkvthw/image/upload/v1771707270/studentlife_jpcxuq.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 35%' }}
          loading="eager"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 py-16 max-w-3xl mx-auto">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
            Student Life
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto">
            Beyond the classroom — where character is built and memories are made.
          </p>
        </div>
      </section>

      {/* Co-Curricular Activities - static hardcoded content */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Co-Curricular Activities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a, i) => (
              <motion.div
                key={a.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
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

      {/* Campus Life Photos - fetched from gallery backend */}
      <section className="section-padding bg-section-alt">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Life on Campus
          </h2>
          {galleryLoading ? (
            // Loading spinner while fetching gallery
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : galleryImages.length === 0 ? (
            // Empty state when no gallery images in database
            <div className="text-center py-10">
              <p className="text-muted-foreground">No campus photos yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 bg-card">
                    <p className="font-semibold text-foreground">{image.title}</p>
                    <p className="text-sm text-muted-foreground">{image.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Student Testimonials - fetched from backend */}
      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Student Voices
          </h2>
          {testimonialsLoading ? (
            // Loading spinner while fetching testimonials
            <div className="flex items-center justify-center py-10">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            // Empty state when no testimonials in database
            <div className="text-center py-10">
              <p className="text-muted-foreground">No testimonials yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.blockquote
                  key={t.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <p className="text-foreground italic mb-4 leading-relaxed">"{t.quote}"</p>
                  <footer className="text-sm">
                    <strong className="text-foreground">{t.student_name}</strong>
                    <span className="text-muted-foreground ml-2">— {t.year}</span>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default StudentLife;
