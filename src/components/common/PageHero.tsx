import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
}

const PageHero = ({ title, subtitle, backgroundImage, children }: PageHeroProps) => {
  return (
    <section className="relative min-h-[340px] md:min-h-[500px] flex items-end justify-center overflow-hidden">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      )}
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative z-10 text-center px-4 py-12 max-w-3xl mx-auto">
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
