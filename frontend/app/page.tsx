"use client";

/**
 * Home Page (Landing Screen) - CalmindAI Therapist
 * Purpose:
 * This is the first screen users see. It sets emotional tone and invites them
 * to begin using the AI therapy experience.
 *
 * Key Features:
 * 1) Emotion slider to express current mood
 * 2) Animated hero section with brand messaging
 * 3) Feature cards describing benefits
 * 4) Intro dialog explaining experience flow
 */

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// UI Components (shadcn + custom)
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Ripple } from "@/components/ui/ripple";

// Icons
import {
  Brain,
  Shield,
  Waves,
  Lightbulb,
  Lock,
  MessageSquareHeart,
  ArrowRight,
  HeartPulse
} from "lucide-react";

// Component Start
export default function Home() {

  //  Emotion scale used on UI slider
  const emotions = [
    { value: 0, label: "Down", icon: "😔", color: "from-blue-500/50" },
    { value: 25, label: "Content", icon: "😊", color: "from-green-500/50" },
    { value: 50, label: "Peaceful", icon: "😌", color: "from-purple-500/50" },
    { value: 75, label: "Happy", icon: "🤗", color: "from-yellow-500/50" },
    { value: 100, label: "Excited", icon: "✨", color: "from-pink-500/50" },
  ];

  // UI State
  const [emotion, setEmotion] = useState(50);
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Welcome onboarding steps shown in dialog
  const welcomeSteps = [
    {
      title: "Hi, I'm Aura",
      description:
        "Your AI companion for emotional well-being. I provide a safe, judgment-free space for you.",
      icon: Waves,
    },
    {
      title: "Personalized Support",
      description:
        "I adapt to your emotional state and help using evidence-based therapeutic techniques.",
      icon: Brain,
    },
    {
      title: "Your Privacy Matters",
      description:
        "All conversations are secure and private. Your mental space is respected.",
      icon: Shield,
    },
  ];

  // Initial mount animation flag
  useEffect(() => {
    setMounted(true);
  }, []);

  // Find nearest emotion category for color background
  const currentEmotion =
    emotions.find((em) => Math.abs(emotion - em.value) < 15) || emotions[2];

  // Product features displayed below hero
  const features = [
    {
      icon: HeartPulse,
      title: "24/7 Support",
      description: "Always here to listen and support you.",
      color: "from-rose-500/20",
      delay: 0.2,
    },
    {
      icon: Lightbulb,
      title: "Smart Insights",
      description: "Guidance powered by emotional intelligence.",
      color: "from-amber-500/20",
      delay: 0.4,
    },
    {
      icon: Lock,
      title: "Private & Secure",
      description: "Conversations are confidential and encrypted.",
      color: "from-emerald-500/20",
      delay: 0.6,
    },
    {
      icon: MessageSquareHeart,
      title: "Evidence-Based",
      description: "Uses clinically researched techniques.",
      color: "from-blue-500/20",
      delay: 0.8,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* ===========================
          HERO SECTION
      ============================ */}
      <section className="relative min-h-[90vh] mt-20 flex flex-col items-center justify-center py-12 px-4">

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20
            bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60 transition-all`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl bottom-0 right-0" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
        </div>

        <Ripple className="opacity-60" />

        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1 }}
          className="space-y-8 text-center"
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-primary/30 bg-primary/5">
            <Waves className="w-4 h-4 text-primary" />
            <span>Your AI Mental Health Companion</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Peace
            <br />
            <span className="text-foreground/90">of Mind</span>
          </h1>

          {/* Sub text */}
          <p className="max-w-[600px] mx-auto text-muted-foreground">
            Experience emotional support with an AI trained in empathy and therapy methodologies.
          </p>

          {/* Emotion Slider */}
          <div className="w-full max-w-[600px] mx-auto space-y-6 py-8">
            {/* Emoji selects */}
            <div className="flex justify-between px-2">
              {emotions.map((em) => (
                <div
                  key={em.value}
                  onClick={() => setEmotion(em.value)}
                  className={`cursor-pointer transition-all ${
                    Math.abs(emotion - em.value) < 15 ? "scale-110" : "opacity-50"
                  }`}
                >
                  <div className="text-2xl">{em.icon}</div>
                  <div className="text-xs text-muted-foreground">{em.label}</div>
                </div>
              ))}
            </div>

            {/* Slider */}
            <Slider
              value={[emotion]}
              onValueChange={(v) => setEmotion(v[0])}
              min={0}
              max={100}
            />
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={() => setShowDialog(true)}
            className="rounded-full px-8"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </section>

      {/* ===========================
          FEATURES SECTION
      ============================ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How Calmind Helps You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern support system powered by empathetic artificial intelligence.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: feature.delay }}
              >
                <Card className="h-[200px] border border-primary/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===========================
          WELCOME DIALOG / ONBOARDING
      ============================ */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {welcomeSteps[currentStep]?.title}
            </DialogTitle>
            <DialogDescription className="text-center">
              {welcomeSteps[currentStep]?.description}
            </DialogDescription>
          </DialogHeader>

          {/* Step Controls */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-2">
              {welcomeSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? "bg-primary w-4" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (currentStep < welcomeSteps.length - 1) {
                  setCurrentStep((s) => s + 1);
                } else {
                  setShowDialog(false);
                  setCurrentStep(0);
                }
              }}
            >
              {currentStep === welcomeSteps.length - 1
                ? "Let's Begin"
                : "Next"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
