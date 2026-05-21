"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";
import emailjs from "@emailjs/browser";

const projectTypes = [
  "iOS App",
  "Custom Website",
  "Web Application",
  "MVP & Startup",
  "Other",
];

const budgetRanges = [
  "Under $2,500",
  "$2,500 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not Sure",
];

type FormStatus = "idle" | "loading" | "success" | "error";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type";
    }
    
    if (!formData.budget) {
      newErrors.budget = "Please select a budget range";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Please tell us about your project";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus("loading");
    
    try {
      // EmailJS configuration - user needs to set these up
      // Service ID, Template ID, and Public Key from EmailJS dashboard
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_id",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_id",
        {
          from_name: formData.name,
          from_email: formData.email,
          project_type: formData.projectType,
          budget: formData.budget,
          message: formData.message,
          to_email: "hello@matthew-bayne.com",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "public_key"
      );
      
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        projectType: "",
        budget: "",
        message: "",
      });
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(14, 165, 233, 0.15), transparent 40%)`
            }}
          />
          
          <div className="relative z-10 px-6 md:px-8 lg:px-16 py-10 md:py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
              {/* Left content */}
              <div className="flex-1 lg:max-w-md">
                <h2 className="text-3xl md:text-4xl lg:text-6xl font-display tracking-tight mb-4 md:mb-6 leading-[0.95]">
                  Start a Project
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  Tell us what you&apos;re building. We&apos;ll get back to you within 24 hours.
                </p>

                {/* Animation for desktop */}
                <div className="hidden lg:flex items-center justify-center w-[300px] h-[300px]">
                  <AnimatedTetrahedron />
                </div>
              </div>

              {/* Right - Contact Form */}
              <div className="flex-1 w-full lg:max-w-lg">
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h3 className="text-2xl font-display mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      We&apos;ll get back to you within 24 hours.
                    </p>
                  </div>
                ) : status === "error" ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-2xl font-display mb-2">Something went wrong</h3>
                    <p className="text-muted-foreground mb-4">
                      Please try again or email us directly at hello@matthew-bayne.com
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStatus("idle")}
                      className="rounded-full"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-transparent border ${
                          errors.name ? "border-red-500" : "border-foreground/20"
                        } focus:border-foreground outline-none transition-colors`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-transparent border ${
                          errors.email ? "border-red-500" : "border-foreground/20"
                        } focus:border-foreground outline-none transition-colors`}
                        placeholder="you@company.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Project Type */}
                    <div>
                      <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-transparent border ${
                          errors.projectType ? "border-red-500" : "border-foreground/20"
                        } focus:border-foreground outline-none transition-colors appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-background">Select a project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type} className="bg-background">
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>
                      )}
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-transparent border ${
                          errors.budget ? "border-red-500" : "border-foreground/20"
                        } focus:border-foreground outline-none transition-colors appearance-none cursor-pointer`}
                      >
                        <option value="" className="bg-background">Select a budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range} className="bg-background">
                            {range}
                          </option>
                        ))}
                      </select>
                      {errors.budget && (
                        <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 bg-transparent border ${
                          errors.message ? "border-red-500" : "border-foreground/20"
                        } focus:border-foreground outline-none transition-colors resize-none`}
                        placeholder="Tell us about your project"
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
