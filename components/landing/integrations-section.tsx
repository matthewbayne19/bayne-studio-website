"use client";

import { useEffect, useState, useRef } from "react";

const techStack = [
  "React Native",
  "Expo",
  "Next.js",
  "React",
  "Node.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "Azure",
  "Vercel",
  "GitHub",
  "Figma",
  "Stripe",
  "Tailwind CSS",
  "GraphQL",
  ".NET",
];

export function IntegrationsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="tech" ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4 md:mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Tech Stack
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-display tracking-tight mb-4 md:mb-6">
            Built With
            <br />
            Modern Tools.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            We use industry-leading technologies to deliver fast, reliable, and scalable software.
          </p>
        </div>

      </div>
      
      {/* Full-width marquees outside container */}
      <div className="w-full mb-4 md:mb-6">
        <div className="flex gap-3 md:gap-6 marquee">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-2 md:gap-4 shrink-0">
              {techStack.map((tech) => (
                <div
                  key={`${tech}-${setIndex}`}
                  className="shrink-0 px-4 md:px-6 py-2 md:py-3 border border-foreground/10 hover:border-[#0EA5E9]/50 hover:bg-[#0EA5E9]/5 transition-all duration-300 group"
                >
                  <span className="text-xs md:text-sm font-medium group-hover:text-[#0EA5E9] transition-colors">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Reverse marquee */}
      <div className="w-full">
        <div className="flex gap-3 md:gap-6 marquee-reverse">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-2 md:gap-4 shrink-0">
              {[...techStack].reverse().map((tech) => (
                <div
                  key={`${tech}-reverse-${setIndex}`}
                  className="shrink-0 px-4 md:px-6 py-2 md:py-3 border border-foreground/10 hover:border-[#0EA5E9]/50 hover:bg-[#0EA5E9]/5 transition-all duration-300 group"
                >
                  <span className="text-xs md:text-sm font-medium group-hover:text-[#0EA5E9] transition-colors">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
