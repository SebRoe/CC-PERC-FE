import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import DefaultLayout from "@/layouts/default";

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
  icon: string;
  title: string;
  description: string;
  delay?: number;
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group">
      <CardBody className="p-6">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </CardBody>
    </Card>
  </motion.div>
);

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
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Chip
                className="mb-6 px-4 py-2 text-sm font-medium"
                color="primary"
                variant="flat"
              >
                🧠 AI-Powered Homepage Analysis
              </Chip>
            </motion.div>

            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              When AI Agents Evaluate Your Homepage
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
              Every day,{" "}
              <span className="text-orange-500 font-semibold">
                AI agents decide
              </span>{" "}
              whether your homepage matches user queries.
              <br />
              Understand their evaluation process and optimize for both humans
              and AI algorithms.
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
                onPress={() => window.open("/analyze", "_blank")}
              >
                Analyze My Homepage
              </Button>
              <Button
                className="px-8 py-3 text-lg font-medium border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                size="lg"
                variant="bordered"
                onPress={() => window.open("/demo", "_blank")}
              >
                See Example Analysis
              </Button>
            </motion.div>
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

            <div className="grid md:grid-cols-3 gap-8">
              <InsightCard
                delay={0.1}
                description="AI agents evaluate if your homepage content matches user search queries and intent. See how well your messaging aligns with what people are actually looking for."
                icon="🎯"
                title="Query Relevance"
              />
              <InsightCard
                delay={0.2}
                description="Agents analyze your page structure, loading speed, mobile experience, and navigation flow to determine user experience quality and SEO ranking potential."
                icon="⚡"
                title="UX & SEO Score"
              />
              <InsightCard
                delay={0.3}
                description="AI evaluates your brand messaging, trustworthiness indicators, and content quality to assess whether users will find genuine value on your site."
                icon="🏆"
                title="Value Assessment"
              />
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
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Brand Perception
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  How AI interprets your brand personality, values, and
                  positioning
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Competitor Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  See how AI compares your homepage to industry leaders
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Industry Trends
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI insights on what's working in your industry right now
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
                  Design Sentiment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI evaluation of your visual design and emotional impact
                </p>
              </div>
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
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-orange-500">
                  🤖 AI Search Revolution
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  ChatGPT, Perplexity, and other AI assistants are becoming
                  primary discovery tools. They evaluate websites differently
                  than traditional search engines.
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-orange-500">
                  📈 SEO Evolution
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Google's AI updates prioritize user intent and content quality
                  over keyword optimization. Understand what algorithms really
                  value.
                </p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 text-orange-500">
                  🎯 User Expectations
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Modern users expect AI-quality experiences: relevant content,
                  clear value propositions, and instant understanding of what
                  you offer.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-6 border-t border-orange-200 dark:border-orange-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
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
