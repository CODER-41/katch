import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";
import heroImage from "@/assets/hero-school.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import academicsImg from "@/assets/academics.jpg";
import studentLifeImg from "@/assets/student-life.jpg";
import alumniImg from "@/assets/alumni.jpg";
import heroSchool from "@/assets/hero-school.jpg";

const categories = ["All", "Academics", "Sports", "Events", "Facilities"];

const photos = [
  { src: gallery1, title: "Chemistry Lab Session", category: "Academics" },
  { src: academicsImg, title: "Library Study Group", category: "Academics" },
  { src: studentLifeImg, title: "Rugby Training", category: "Sports" },
  { src: alumniImg, title: "Graduation Ceremony", category: "Events" },
  { src: heroSchool, title: "School Aerial View", category: "Facilities" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? photos : photos.filter((p) => p.category === filter);

  return (
    <Layout>
      <PageHero
        title="Gallery"
        subtitle="A visual journey through life at Kakamega School."
        backgroundImage={heroImage}
      />

      <section className="section-padding bg-background">
        <div className="container mx-auto max-w-5xl">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                onClick={() => setLightbox(i)}
              >
                <img src={photo.src} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-primary-foreground font-semibold">{photo.title}</p>
                    <p className="text-primary-foreground/70 text-sm">{photo.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-primary-foreground" onClick={() => setLightbox(null)}>
              <X className="w-8 h-8" />
            </button>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].title}
              className="max-w-full max-h-[85vh] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
