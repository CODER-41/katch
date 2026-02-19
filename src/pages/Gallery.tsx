import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/common/PageHero";

const categories = ["All", "Academics", "Sports", "Events", "Facilities"];

const photos = [
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771530049/learners_opufyp.jpg",
    title: "Learners",
    category: "Academics",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771530054/students_jlv803.jpg",
    title: "Students",
    category: "Academics",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527328/Vikings_eu7zfb.jpg",
    title: "Vikings",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527320/The_green_commandos_qr4pw7.jpg",
    title: "The Green Commandos",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527310/Katch_striker_sklkf3.jpg",
    title: "Katch Striker",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527302/kakamega_school_rugby_anrtrm.jpg",
    title: "Kakamega School Rugby",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527275/kakamega_school_basketball_yeupkb.jpg",
    title: "Kakamega School Basketball",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527268/Green_Commandos_vtihot.jpg",
    title: "Green Commandos",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527242/GC_h8ie0g.jpg",
    title: "GC",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527207/coach_wamanga_wgjpnz.jpg",
    title: "Coach Wamanga",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527200/chrisan_ojwang_geu1fq.jpg",
    title: "Chrisan Ojwang",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771509854/Barbarians_rugby_l8h0en.jpg",
    title: "Barbarians Rugby",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771529191/The_Green_Commandos_reign_wfmlsr.jpg",
    title: "The Green Commandos Reign",
    category: "Sports",
  },
  {
    src: "https://res.cloudinary.com/da0mkvthw/image/upload/v1771527218/download_srjlpm.jpg",
    title: "Kakamega School Sports",
    category: "Sports",
  },
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
        backgroundImage="https://res.cloudinary.com/da0mkvthw/image/upload/v1771527193/kakamega_school_mfkgjc.webp"
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
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
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
            <button
              className="absolute top-6 right-6 text-primary-foreground"
              onClick={() => setLightbox(null)}
            >
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