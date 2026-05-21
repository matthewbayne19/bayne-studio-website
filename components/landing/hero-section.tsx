"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedSphere } from "./animated-sphere";

const words = ["ships", "builds", "delivers", "creates"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-0">
      {/* Animated sphere background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
        <AnimatedSphere />
      </div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32 lg:py-40">
        {/* Eyebrow */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            Independent Software Studio
          </span>
        </div>
        
        {/* Main headline */}
        <div className="mb-12">
          <h1 
            className={`text-[clamp(2.5rem,10vw,10rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">The studio</span>
            <span className="block">
              that{" "}
              <span className="relative inline-block">
                <span 
                  key={wordIndex}
                  className="inline-flex"
                >
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#0EA5E9]/20" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-24 items-end">
          <p 
            className={`text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Bayne Studio builds consumer-facing iOS apps and custom websites for clients who want software done right — fast, clean, and built to last.
          </p>
          
          {/* CTAs */}
          <div 
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button 
              size="lg" 
              onClick={() => scrollToSection("contact")}
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
            >
              Start a Project
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection("work")}
              className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5"
            >
              See Our Work
            </Button>
          </div>
        </div>
        
      </div>
      
      {/* Stats - mobile: stacked grid, desktop: marquee */}
      <div 
        className={`absolute bottom-12 md:bottom-24 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Mobile: 2x2 Grid */}
        <div className="md:hidden px-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "1", label: "Successful Acquisition" },
              { value: "3+", label: "Years Building" },
              { value: "500+", label: "Users Served" },
              { value: "2024", label: "Studio Founded" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-3xl font-display">{stat.value}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop: Marquee */}
        <div className="hidden md:block">
          <div className="flex gap-16 marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16">
                {[
                  { value: "1", label: "Successful Acquisition" },
                  { value: "3+", label: "Years Building" },
                  { value: "500+", label: "Users Served" },
                  { value: "2024", label: "Studio Founded" },
                ].map((stat) => (
                  <div key={`${stat.label}-${i}`} className="flex items-baseline gap-4">
                    <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      
    </section>
  );
}
