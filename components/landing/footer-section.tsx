"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";

const footerLinks = [
  { name: "Services", href: "#services" },
  { name: "Work", href: "#work" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export function FooterSection() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-12 md:py-16 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-display">Bayne Studio</span>
              </a>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8 max-w-md">
                Great software doesn&apos;t require a big team. Just the right idea, executed well.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                <a
                  href="https://www.linkedin.com/company/bayne-studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                >
                  LinkedIn
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </div>
            </div>

            {/* Links Column */}
            <div>
              <h3 className="text-sm font-medium mb-4 md:mb-6">Navigation</h3>
              <ul className="space-y-3 md:space-y-4">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 md:py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground text-center">
            <span>Bayne Studio — Jersey City, NJ</span>
            <span className="hidden md:inline">|</span>
            <span>2026 Bayne Studio LLC. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
