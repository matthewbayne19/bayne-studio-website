"use client";

import { useEffect, useState, useRef } from "react";

const highlights = [
  { label: "Status", value: "Acquired", detail: "October 2025" },
  { label: "Users", value: "500+", detail: "Active Users" },
  { label: "Stack", value: "Full-Stack", detail: "iOS + Backend" },
];

export function InfrastructureSection() {
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
    <section id="work" ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4 md:mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Previously
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-display tracking-tight mb-6 md:mb-8">
              The Backroom.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-8">
              Bayne Studio&apos;s first product, The Backroom, was a nightlife discovery platform for social experiences. It was acquired in October 2025.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 md:mb-12">
              We&apos;re now back, building the next chapter.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {highlights.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-display mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10 bg-foreground/[0.02]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Case Study</span>
                <span className="flex items-center gap-2 text-xs font-mono text-[#0EA5E9]">
                  <span className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
                  Acquired
                </span>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-display mb-2">The Backroom</h3>
                  <p className="text-muted-foreground">Nightlife Discovery Platform</p>
                </div>

                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-foreground/5">
                    <span className="text-sm text-muted-foreground">Platform</span>
                    <span className="text-sm font-medium">iOS (React Native)</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-foreground/5">
                    <span className="text-sm text-muted-foreground">Backend</span>
                    <span className="text-sm font-medium">Node.js + Supabase</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-foreground/5">
                    <span className="text-sm text-muted-foreground">Timeline</span>
                    <span className="text-sm font-medium">2024 - 2025</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">Outcome</span>
                    <span className="text-sm font-medium text-[#0EA5E9]">Acquired</span>
                  </div>
                </div>

                <div className="p-4 bg-foreground/5 border border-foreground/10">
                  <p className="text-sm text-muted-foreground italic">
                    &quot;From idea to acquisition in under 18 months. Built with the same rigor we bring to every client project.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
