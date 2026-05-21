"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    number: "01",
    title: "iOS App Development",
    description: "Native iOS apps built with React Native and Expo. From concept through App Store launch — designed for real users, built to scale.",
    visual: "ios",
  },
  {
    number: "02",
    title: "Custom Websites",
    description: "Clean, modern websites tailored to your brand. Whether it's a landing page, portfolio, or full marketing site — we build it right.",
    visual: "web",
  },
  {
    number: "03",
    title: "Full-Stack Web Applications",
    description: "End-to-end web app development using React, Next.js, and Node. We handle frontend, backend, auth, databases, and deployment.",
    visual: "fullstack",
  },
  {
    number: "04",
    title: "MVP & Startup Consulting",
    description: "Have an idea? We help early-stage founders scope, build, and launch MVPs quickly — with the same engineering rigor as larger teams.",
    visual: "mvp",
  },
];

function IOSVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Phone outline */}
      <rect x="60" y="10" width="80" height="140" rx="12" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Screen */}
      <rect x="66" y="24" width="68" height="112" rx="2" fill="currentColor" opacity="0.05" />
      
      {/* Notch */}
      <rect x="85" y="14" width="30" height="6" rx="3" fill="currentColor" opacity="0.3" />
      
      {/* App icons */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <rect
            key={i}
            x={72 + col * 20}
            y={35 + row * 28}
            width="14"
            height="14"
            rx="3"
            fill="currentColor"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.15;0.5;0.15"
              dur="2s"
              begin={`${i * 0.2}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
      
      {/* Home indicator */}
      <rect x="85" y="142" width="30" height="4" rx="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function WebVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Browser window */}
      <rect x="20" y="20" width="160" height="120" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Browser header */}
      <rect x="20" y="20" width="160" height="20" fill="currentColor" opacity="0.1" />
      <circle cx="32" cy="30" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="44" cy="30" r="4" fill="currentColor" opacity="0.3" />
      <circle cx="56" cy="30" r="4" fill="currentColor" opacity="0.3" />
      
      {/* Content blocks */}
      <rect x="30" y="50" width="60" height="8" rx="2" fill="currentColor" opacity="0.3">
        <animate attributeName="width" values="30;60;30" dur="2s" repeatCount="indefinite" />
      </rect>
      <rect x="30" y="65" width="140" height="6" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="30" y="78" width="140" height="6" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="30" y="91" width="100" height="6" rx="2" fill="currentColor" opacity="0.1" />
      
      {/* CTA button */}
      <rect x="30" y="110" width="50" height="20" rx="4" fill="currentColor" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function FullstackVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Frontend */}
      <rect x="20" y="30" width="70" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="55" y="60" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.5">UI</text>
      
      {/* Backend */}
      <rect x="110" y="30" width="70" height="50" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="145" y="60" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.5">API</text>
      
      {/* Database */}
      <ellipse cx="100" cy="120" rx="35" ry="15" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 65 120 L 65 130 Q 100 145 135 130 L 135 120" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="currentColor" opacity="0.5">DB</text>
      
      {/* Connection lines */}
      <line x1="90" y1="55" x2="110" y2="55" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite" />
      </line>
      <line x1="100" y1="80" x2="100" y2="105" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;-8" dur="0.5s" repeatCount="indefinite" />
      </line>
    </svg>
  );
}

function MVPVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Lightbulb / Idea */}
      <circle cx="100" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2">
        <animate attributeName="r" values="25;28;25" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M 90 75 L 90 90 L 110 90 L 110 75" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="93" y1="95" x2="107" y2="95" stroke="currentColor" strokeWidth="2" />
      <line x1="95" y1="100" x2="105" y2="100" stroke="currentColor" strokeWidth="2" />
      
      {/* Inner glow */}
      <circle cx="100" cy="50" r="12" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + Math.cos(rad) * 35;
        const y1 = 50 + Math.sin(rad) * 35;
        const x2 = 100 + Math.cos(rad) * 45;
        const y2 = 50 + Math.sin(rad) * 45;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="2s"
              begin={`${i * 0.1}s`}
              repeatCount="indefinite"
            />
          </line>
        );
      })}
      
      {/* Arrow pointing forward */}
      <path d="M 60 130 L 140 130 L 130 120 M 140 130 L 130 140" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "ios":
      return <IOSVisual />;
    case "web":
      return <WebVisual />;
    case "fullstack":
      return <FullstackVisual />;
    case "mvp":
      return <MVPVisual />;
    default:
      return <IOSVisual />;
  }
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-foreground/10">
        {/* Number */}
        <div className="shrink-0">
          <span className="font-mono text-sm text-muted-foreground">{service.number}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {service.title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </div>
          
          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-40 text-foreground">
              <AnimatedVisual type={service.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Services
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            What We Build.
          </h2>
        </div>

        {/* Services List */}
        <div>
          {services.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
