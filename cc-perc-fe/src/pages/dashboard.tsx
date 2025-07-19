import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { Tabs, Tab } from "@heroui/tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/layouts/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import {
  BrainIcon,
  ChartIcon,
  TargetIcon,
  TrendingUpIcon,
  ZapIcon,
  EyeIcon,
  BarChartIcon,
} from "@/components/icons";
import { api } from "@/lib/api-with-interceptor";
import type { Analysis } from "@/types/analysis";

const DashboardCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className={`h-full ${className}`}
    initial={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group hover:border-orange-400 dark:hover:border-orange-500 h-full">
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  </motion.div>
);

const StatCard = ({
  title,
  value,
  trend,
  icon,
  color = "orange",
  delay = 0,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}) => (
  <motion.div
    animate={{ opacity: 1, scale: 1 }}
    initial={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl flex items-center justify-center text-${color}-500`}
          >
            {icon}
          </div>
          <Chip
            className={`text-xs text-${color}-600 bg-${color}-100 dark:bg-${color}-900/30`}
            variant="flat"
          >
            {trend}
          </Chip>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{title}</div>
      </CardBody>
    </Card>
  </motion.div>
);

interface AnalysisCardProps {
  analysis: Analysis;
  delay?: number;
}

const AnalysisCard = ({ analysis, delay = 0, onDelete }: AnalysisCardProps & { onDelete: (id:string)=>void }) => {
  const navigate = useNavigate();
  const url = new URL(analysis.url).hostname;
  const status = analysis.status;
  
  // Get score from the enhanced structure
  const score = analysis.report?.executive_summary?.overall_score || 
                analysis.ai_analysis?.scores?.overall_score || 
                analysis.ai_analysis?.summary?.overall_score || 0;
  
  const grade = analysis.report?.executive_summary?.grade || 
                (score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D");
  
  // Get insights from the enhanced structure
  const insights: string[] = analysis.report?.executive_summary?.key_findings || 
                            analysis.ai_analysis?.summary?.key_findings || [];
  
  // Get performance score if available
  const performanceScore = analysis.ai_analysis?.scores?.performance_score;
  const processingTime = analysis.processing_time;
  
  const timestamp = new Date(analysis.created_at).toLocaleString();

  return (
  <motion.div
    animate={{ opacity: 1, x: 0 }}
    initial={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.01 }}
  >
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <BrainIcon className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white truncate max-w-[200px]">
                {url}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {timestamp}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-2">
              <div
                className={`text-2xl font-bold ${
                score >= 80
                  ? "text-green-600"
                  : score >= 60
                    ? "text-orange-600"
                    : "text-red-600"
              }`}
            >
              {Math.round(score)}
              </div>
              <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                {grade}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Overall Score
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "completed"
                  ? "bg-green-500"
                  : status === "analyzing"
                    ? "bg-orange-500"
                    : "bg-gray-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {status}
            </span>
          </div>
          <Progress
            color={score >= 80 ? "success" : score >= 60 ? "warning" : "danger"}
            size="sm"
            value={score}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Key Insights:
          </h4>
          <div className="space-y-1">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {insight}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            size="sm"
            variant="bordered"
            onPress={() => navigate(`/analysis/${analysis.id}`)}
          >
            View Full Report
          </Button>
          <Button
            className="w-full mt-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            size="sm"
            variant="bordered"
            onPress={() => onDelete(analysis.id)}
          >
            Delete
          </Button>
        </div>
      </CardBody>
    </Card>
  </motion.div>
  );
};

export default function DashboardPage() {
  const [newAnalysisUrl, setNewAnalysisUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchAnalyses = async () => {
    try {
      const list = await api.getAnalyses();
      setAnalyses(list.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
    } catch (err) {
      console.error("Failed to fetch analyses", err);
    }
  };

  useEffect(() => {
    fetchAnalyses();
    const id = setInterval(fetchAnalyses, 10000); // poll every 10s
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDelete = async (id: string) => {
    await api.deleteAnalysis(id);
    await fetchAnalyses();
  };

  const handleNewAnalysis = async () => {
    if (!newAnalysisUrl) return;

    // ensure URL has protocol
    let urlToAnalyze = newAnalysisUrl.trim();
    if (!/^https?:\/\//i.test(urlToAnalyze)) {
      urlToAnalyze = `https://${urlToAnalyze}`;
    }
    try {
      // Validate URL constructability
      new URL(urlToAnalyze);
    } catch {
      setUrlError("Please enter a valid URL");
      return;
    }
    setUrlError(null);

    try {
      setIsSubmitting(true);
      await api.requestAnalysis(urlToAnalyze, "homepage");
      setNewAnalysisUrl("");
      await fetchAnalyses();
    } catch (err) {
      console.error("Analysis request failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-orange-200 dark:border-orange-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  AI Analysis Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back, {user?.first_name || user?.email}! Monitor your
                  content performance through AI agent evaluation
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  variant="bordered"
                >
                  View All Reports
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  color="primary"
                >
                  New Analysis
                </Button>
                <Button
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  variant="bordered"
                  onPress={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              delay={0.1}
              icon={<BrainIcon size={24} />}
              title="Total Analyses"
              trend="+12 this week"
              value="24"
            />
            <StatCard
              delay={0.2}
              icon={<ChartIcon size={24} />}
              title="Average AI Score"
              trend="+5 improvement"
              value="73"
            />
            <StatCard
              delay={0.3}
              icon={<TrendingUpIcon size={24} />}
              title="Top Performing"
              trend="89 AI Score"
              value="apple.com"
            />
            <StatCard
              delay={0.4}
              icon={<EyeIcon size={24} />}
              title="Total Insights"
              trend="+23 new"
              value="156"
            />
          </div>

          {/* New Analysis Section */}
          <div className="mb-8">
            <DashboardCard delay={0.5}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <BrainIcon className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Start New AI Analysis
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter a URL to see how AI agents evaluate your content
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Input
                  className="flex-1"
                  classNames={{
                    inputWrapper:
                      "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                  }}
                  placeholder="Enter URL (e.g., https://yoursite.com)"
                  value={newAnalysisUrl}
                  onChange={(e) => setNewAnalysisUrl(e.target.value)}
                />
                {urlError && (
                  <p className="text-sm text-red-600 mt-2">{urlError}</p>
                )}
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8"
                  color="primary"
                  disabled={!newAnalysisUrl || isSubmitting}
                  isLoading={isSubmitting}
                  onPress={handleNewAnalysis}
                >
                  {isSubmitting ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </DashboardCard>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Analyses */}
            <div className="lg:col-span-2">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                  Recent Analyses
                </h2>
                <div className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <AnalysisCard
                      key={index}
                      analysis={analysis}
                      onDelete={handleDelete}
                      delay={0.7 + index * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div>
              <DashboardCard delay={0.8}>
                <Tabs 
                  aria-label="Dashboard Options" 
                  color="primary" 
                  variant="underlined"
                  classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-orange-500",
                    tab: "px-0 h-12 w-full",
                    tabContent: "group-data-[selected=true]:text-orange-500"
                  }}
                >
                  <Tab
                    key="insights"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <TargetIcon size={16} />
                        <span>Insights</span>
                      </div>
                    }
                  >
                    <div className="space-y-3 mt-4">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="font-medium text-green-800 dark:text-green-300 text-sm">
                          AI Score Improvement
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-xs">
                          +15% average increase after optimization
                        </div>
                      </div>
                      <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="font-medium text-orange-800 dark:text-orange-300 text-sm">
                          Common Issues
                        </div>
                        <div className="text-orange-600 dark:text-orange-400 text-xs">
                          67% of sites need better value proposition
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                          Top Performer
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-xs">
                          apple.com leads with 89 AI Score
                        </div>
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab
                    key="metrics"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <BarChartIcon size={16} />
                        <span>Metrics</span>
                      </div>
                    }
                  >
                    <div className="space-y-4 mt-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Query Relevance
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            78%
                          </span>
                        </div>
                        <Progress color="success" size="sm" value={78} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Content Quality
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            84%
                          </span>
                        </div>
                        <Progress color="success" size="sm" value={84} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            User Experience
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            65%
                          </span>
                        </div>
                        <Progress color="warning" size="sm" value={65} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Trust Signals
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            72%
                          </span>
                        </div>
                        <Progress color="warning" size="sm" value={72} />
                      </div>
                    </div>
                  </Tab>
                  
                  <Tab
                    key="activity"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <ZapIcon size={16} />
                        <span>Activity</span>
                      </div>
                    }
                  >
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 dark:text-white">
                            Analysis completed
                          </div>
                          <div className="text-xs text-gray-500">
                            apple.com • 2h ago
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 dark:text-white">
                            New insight generated
                          </div>
                          <div className="text-xs text-gray-500">
                            tesla.com • 1d ago
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 dark:text-white">
                            Report downloaded
                          </div>
                          <div className="text-xs text-gray-500">
                            startup.com • 2d ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
