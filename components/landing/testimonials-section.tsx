"use client";

import { useEffect, useState, useRef } from "react";

export function TestimonialsSection() {
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
    <section id="about" ref={sectionRef} className="relative py-32 lg:py-40 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            About the Studio
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <p
              className={`font-display text-3xl md:text-4xl lg:text-5xl leading-[1.2] tracking-tight text-foreground transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Bayne Studio is a one-person independent software studio founded by Matthew Bayne — a full-stack engineer with a Stevens Institute CS degree, 3+ years of enterprise engineering experience, and a successful startup exit.
            </p>

            <p
              className={`mt-8 text-xl text-muted-foreground leading-relaxed transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              We work with founders, small businesses, and individuals who need software built by someone who actually cares about the outcome.
            </p>
          </div>

          {/* Founder Card */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div
              className={`p-8 border border-foreground/10 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center mb-6">
                <span className="font-display text-3xl text-foreground">MB</span>
              </div>
              
              <h3 className="font-display text-xl text-foreground mb-1">Matthew Bayne</h3>
              <p className="text-muted-foreground mb-4">Founder & Engineer</p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Stevens Institute of Technology</p>
                <p>Computer Science</p>
              </div>

              <div className="mt-6 pt-6 border-t border-foreground/10">
                <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Location
                </span>
                <p className="text-foreground">Jersey City, NJ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mt-24 pt-12 border-t border-foreground/10">
          <p
            className={`font-display text-2xl md:text-3xl text-center text-muted-foreground italic transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            &quot;Great software doesn&apos;t require a big team. Just the right idea, executed well.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
