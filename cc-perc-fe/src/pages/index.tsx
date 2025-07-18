import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import {
  TargetIcon,
  ZapIcon,
  ShieldIcon,
  BrainIcon,
  ChartIcon,
  BarChartIcon,
  TrendingUpIcon,
  EyeIcon,
} from "@/components/icons";
import RotatingWords from "@/components/rotating-words";

const AnimatedOrb = ({
  delay = 0,
  className = "",
}: {
  delay?: number;
  className?: string;
}) => (
  <motion.div
    animate={{
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
      x: [0, 20, -20, 0],
      y: [0, -30, 30, 0],
    }}
    className={`absolute rounded-full bg-gradient-to-r from-orange-400 to-orange-600 blur-xl ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      repeatType: "loop",
    }}
  />
);

const InsightCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="h-full"
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group hover:border-orange-400 dark:hover:border-orange-500 h-full">
      <CardBody className="p-6 flex flex-col h-full">
        <motion.div
          className="w-12 h-12 mb-4 text-orange-500 group-hover:text-orange-600 transition-colors duration-300 flex-shrink-0"
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 flex-shrink-0">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
          {description}
        </p>
      </CardBody>
    </Card>
  </motion.div>
);

const TypingEffect = ({
  texts,
  speed = 100,
  delay = 1000,
}: {
  texts: string[];
  speed?: number;
  delay?: number;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && currentText !== text) {
          setCurrentText(text.slice(0, currentText.length + 1));
        } else if (isDeleting && currentText !== "") {
          setCurrentText(text.slice(0, currentText.length - 1));
        } else if (!isDeleting && currentText === text) {
          setTimeout(() => setIsDeleting(true), delay);
        } else if (isDeleting && currentText === "") {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      },
      isDeleting ? speed / 2 : speed,
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, speed, delay]);

  return (
    <span className="text-orange-500 font-semibold">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        className="ml-1"
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  );
};

const InteractiveDemo = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    setProgress(0);
    setShowResults(false);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResults(true);

          return 100;
        }

        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const analysisSteps = [
    "Scanning homepage structure...",
    "Analyzing content relevance...",
    "Evaluating user experience...",
    "Checking SEO optimization...",
    "Assessing brand messaging...",
    "Generating AI insights...",
  ];

  const currentStep = Math.floor((progress / 100) * analysisSteps.length);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-white dark:from-gray-800 dark:via-orange-900/10 dark:to-gray-800 rounded-3xl p-8 border-2 border-orange-200 dark:border-orange-700 shadow-2xl">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-10" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-8">
          <motion.div
            className="w-12 h-12 text-orange-500 mr-4 p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl"
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BrainIcon size={32} />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
              AI Homepage Analyzer
            </h3>
            <p className="text-orange-600 dark:text-orange-400 font-medium">
              Real-time evaluation powered by AI
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Input
              className="text-lg"
              classNames={{
                input: "text-lg",
                inputWrapper:
                  "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 shadow-lg hover:border-orange-300 focus-within:border-orange-500",
              }}
              disabled={isAnalyzing}
              placeholder="Enter your homepage URL (e.g., https://apple.com)"
              size="lg"
              startContent={
                <div className="text-orange-500 text-xl mr-2">🌐</div>
              }
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Enter homepage URL for analysis"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full py-4 text-lg font-semibold shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              color="primary"
              disabled={!url || isAnalyzing}
              isLoading={isAnalyzing}
              size="lg"
              onPress={handleAnalyze}
            >
              {isAnalyzing ? (
                <span className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    aria-label="Analyzing homepage"
                  />
                  Analyzing Your Homepage...
                </span>
              ) : (
                <span className="flex items-center">
                  <BrainIcon className="mr-2" size={20} />
                  Start AI Analysis
                </span>
              )}
            </Button>
          </motion.div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
              >
                <Progress color="primary" size="lg" value={progress} aria-label="Analysis progress" />
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  {analysisSteps[currentStep] || "Processing..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResults && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      UX Score
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">72</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      SEO Score
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">91</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Brand Clarity
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-2">AI Insights:</h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                    <li>• Strong value proposition in hero section</li>
                    <li>• Consider improving page load speed</li>
                    <li>• Add more trust signals and testimonials</li>
                  </ul>
                </div>
                <Button className="w-full" variant="bordered">
                  Get Full Analysis Report
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LiveEvaluationPreview = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const evaluationSteps = [
    {
      label: "Query Match",
      score: 92,
      description: "Homepage clearly matches 'web design services'",
    },
    {
      label: "Content Quality",
      score: 88,
      description: "Professional, well-structured content",
    },
    {
      label: "Trust Signals",
      score: 76,
      description: "Good testimonials, could add more certifications",
    },
    {
      label: "User Experience",
      score: 84,
      description: "Clean design, fast loading, mobile-friendly",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % evaluationSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Live AI Evaluation: Apple.com
      </h3>

      <div className="space-y-4">
        {evaluationSteps.map((step, index) => (
          <motion.div
            key={step.label}
            animate={{
              scale: index === currentStep ? 1.02 : 1,
              opacity: index === currentStep ? 1 : 0.7,
            }}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              index === currentStep
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800 dark:text-white">
                {step.label}
              </span>
              <span
                className={`font-bold ${
                  step.score >= 85
                    ? "text-green-600"
                    : step.score >= 70
                      ? "text-orange-600"
                      : "text-red-600"
                }`}
              >
                {step.score}
              </span>
            </div>
            <Progress
              color={
                step.score >= 85
                  ? "success"
                  : step.score >= 70
                    ? "warning"
                    : "danger"
              }
              value={step.score}
              aria-label={`${step.label} score: ${step.score}%`}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function IndexPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const typingTexts = [
    "web design services",
    "e-commerce solutions",
    "digital marketing agency",
    "software development",
    "consulting services",
  ];

  const rotatingWords = [
    { text: "Homepage" },
    { text: "Brand", isComingSoon: true },
    { text: "Competitors", isComingSoon: true },
    { text: "Social Media", isComingSoon: true },
  ];

  return (
    <DefaultLayout>
      <div className="relative overflow-hidden">
        {/* Animated Background Orbs */}
        <AnimatedOrb className="top-20 left-10 w-32 h-32" delay={0} />
        <AnimatedOrb className="top-40 right-20 w-24 h-24" delay={2} />
        <AnimatedOrb className="bottom-32 left-1/4 w-40 h-40" delay={4} />
        <AnimatedOrb className="bottom-20 right-10 w-28 h-28" delay={1} />

        {/* Mouse Follow Effect */}
        <motion.div
          className="fixed top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-orange-400/10 to-orange-600/10 blur-3xl pointer-events-none z-0"
          style={{
            x: mousePosition.x * window.innerWidth - 192,
            y: mousePosition.y * window.innerHeight - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Hero Section */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            {/* <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Chip
                className="mb-6 px-4 py-2 text-sm font-medium"
                color="primary"
                variant="flat"
              >
                AI-Powered Content Analysis
              </Chip>
            </motion.div> */}

            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              When AI Agents Evaluate Your{" "}
              <RotatingWords
                className="text-orange-500"
                words={rotatingWords}
              />
              <br />
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
                What Do They See?
              </span>
            </motion.h1>

            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              When someone searches for{" "}
              <TypingEffect delay={1500} speed={80} texts={typingTexts} />
              <br />
              AI agents decide if your content is the right match. See what they
              really think.
            </motion.p>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                className="px-8 py-3 text-lg font-medium"
                color="primary"
                size="lg"
                variant="shadow"
                onPress={() => (window.location.href = "/auth")}
              >
                Analyze My Content
              </Button>
              <Button
                className="px-8 py-3 text-lg font-medium border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                size="lg"
                variant="bordered"
                onPress={() => (window.location.href = "/auth")}
              >
                See Example Analysis
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Interactive Demo Section */}
        <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-orange-50/50 to-white dark:from-orange-900/10 dark:to-gray-900">
          <motion.div
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Experience AI Analysis in Action
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                See how AI agents evaluate homepages in real-time. Try our demo
                or watch a live analysis.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <InteractiveDemo />
              </div>
              <div>
                <LiveEvaluationPreview />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Before/After Comparison */}
        <section className="relative z-10 py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Before vs After AI Optimization
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See how AI-optimized homepages perform better in agent
                evaluations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-600">
                    ❌ Before Optimization
                  </h3>
                  <div className="text-2xl font-bold text-red-600">42/100</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Query Relevance</span>
                    <span className="text-red-600">35%</span>
                  </div>
                  <Progress color="danger" size="sm" value={35} aria-label="Query relevance score: 35%" />
                  <div className="flex justify-between">
                    <span>Content Quality</span>
                    <span className="text-red-600">48%</span>
                  </div>
                  <Progress color="danger" size="sm" value={48} aria-label="Content quality score: 48%" />
                  <div className="flex justify-between">
                    <span>User Experience</span>
                    <span className="text-red-600">43%</span>
                  </div>
                  <Progress color="danger" size="sm" value={43} aria-label="User experience score: 43%" />
                </div>
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    AI struggles to understand value proposition. Unclear
                    messaging confuses evaluation algorithms.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6"
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-green-600">
                    ✅ After Optimization
                  </h3>
                  <div className="text-2xl font-bold text-green-600">
                    89/100
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Query Relevance</span>
                    <span className="text-green-600">92%</span>
                  </div>
                  <Progress color="success" size="sm" value={92} aria-label="Query relevance score: 92%" />
                  <div className="flex justify-between">
                    <span>Content Quality</span>
                    <span className="text-green-600">88%</span>
                  </div>
                  <Progress color="success" size="sm" value={88} aria-label="Content quality score: 88%" />
                  <div className="flex justify-between">
                    <span>User Experience</span>
                    <span className="text-green-600">87%</span>
                  </div>
                  <Progress color="success" size="sm" value={87} aria-label="User experience score: 87%" />
                </div>
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Clear value proposition, strong keywords, and optimized
                    structure make AI evaluation easy and positive.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* What AI Sees Section */}
        <section className="relative z-10 py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                The AI Agent Evaluation Process
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                When AI agents scan your homepage, they're making critical
                decisions about relevance, quality, and user value. Here's what
                they're analyzing in real-time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              <InsightCard
                delay={0.1}
                description="AI agents evaluate if your homepage content matches user search queries and intent. See how well your messaging aligns with what people are actually looking for."
                icon={<TargetIcon size={48} />}
                title="Query Relevance"
              />
              <InsightCard
                delay={0.2}
                description="Agents analyze your page structure, loading speed, mobile experience, and navigation flow to determine user experience quality and SEO ranking potential."
                icon={<ZapIcon size={48} />}
                title="UX & SEO Score"
              />
              <InsightCard
                delay={0.3}
                description="AI evaluates your brand messaging, trustworthiness indicators, and content quality to assess whether users will find genuine value on your site."
                icon={<ShieldIcon size={48} />}
                title="Value Assessment"
              />
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 py-20 px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                What Our Users Discovered
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Real insights from homepage owners who used AI analysis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "I had no idea AI was reading my homepage so differently than humans. The insights helped me rewrite our value prop and increase conversions by 34%.",
                  author: "Sarah Chen",
                  role: "Founder, TechFlow",
                  score: "AI Score: 23 → 87",
                },
                {
                  quote:
                    "The brand perception analysis revealed we sounded too technical. We simplified our messaging and now rank higher for our target keywords.",
                  author: "Marcus Rodriguez",
                  role: "Marketing Director, CloudSync",
                  score: "Brand Clarity: 45 → 91",
                },
                {
                  quote:
                    "Understanding how AI agents evaluate trust signals completely changed our homepage design. We added the right elements and saw immediate improvements.",
                  author: "Emily Watson",
                  role: "CEO, DesignCore",
                  score: "Trust Score: 52 → 89",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 border border-orange-200 dark:border-orange-700"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 bg-orange-400 rounded-full"
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-orange-500 font-medium">
                        5.0
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="font-semibold text-gray-800 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-orange-500 font-medium mt-2">
                      {testimonial.score}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Coming Soon Section */}
        <section className="relative z-10 py-20 px-6 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
              Coming Soon: Advanced AI Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              We're expanding beyond homepage analysis to give you complete AI
              insights about your brand's digital presence.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-8 h-8 text-orange-500 mb-4">
                  <EyeIcon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Brand Perception
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  How AI interprets your brand personality, values, and
                  positioning
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-8 h-8 text-orange-500 mb-4">
                  <BarChartIcon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Competitor Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  See how AI compares your homepage to industry leaders
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-8 h-8 text-orange-500 mb-4">
                  <TrendingUpIcon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Industry Trends
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI insights on what's working in your industry right now
                </p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-8 h-8 text-orange-500 mb-4">
                  <ChartIcon size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Design Sentiment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI evaluation of your visual design and emotional impact
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Why This Matters Section */}
        <section className="relative z-10 py-20 px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Why AI Agent Evaluation Matters Now
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The future of web discovery is AI-powered. Be prepared for the
                next generation of search and recommendation algorithms.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-orange-500 mr-3">
                    <BrainIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-500">
                    AI Search Revolution
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  ChatGPT, Perplexity, and other AI assistants are becoming
                  primary discovery tools. They evaluate websites differently
                  than traditional search engines.
                </p>
              </motion.div>
              <motion.div
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-orange-500 mr-3">
                    <TrendingUpIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-500">
                    SEO Evolution
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Google's AI updates prioritize user intent and content quality
                  over keyword optimization. Understand what algorithms really
                  value.
                </p>
              </motion.div>
              <motion.div
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                transition={{ duration: 0.2 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 text-orange-500 mr-3">
                    <TargetIcon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-500">
                    User Expectations
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Modern users expect AI-quality experiences: relevant content,
                  clear value propositions, and instant understanding of what
                  you offer.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Unlock the power of AI insights for your homepage •{" "}
              <span className="text-orange-500 font-semibold">CC-PERC</span>
            </p>
          </div>
        </footer>
      </div>
    </DefaultLayout>
  );
}
