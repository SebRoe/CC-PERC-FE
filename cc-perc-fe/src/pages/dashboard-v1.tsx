/**
 * Enhanced Dashboard V1 - Integrates with CC-PERC v1 backend
 * 
 * Features:
 * - Real-time analysis progress tracking
 * - System health monitoring
 * - Enhanced error handling
 * - Background job status
 */

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { Tabs, Tab } from "@heroui/tabs";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
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
  RefreshIcon,
  CheckIcon,
  ExclamationIcon,
  ClockIcon
} from "@/components/icons";
import { 
  v1ApiClient, 
  enhancedApiClient, 
  AnalysisProgressPoller,
  type V1AnalysisResponse,
  type V1SystemHealth,
  type V1PerformanceMetrics
} from "@/lib/api-v1";

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
  isLoading = false,
}: {
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
  isLoading?: boolean;
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
            {isLoading ? <RefreshIcon className="animate-spin" size={24} /> : icon}
          </div>
          {trend && (
            <Chip
              className={`text-xs text-${color}-600 bg-${color}-100 dark:bg-${color}-900/30`}
              variant="flat"
            >
              {trend}
            </Chip>
          )}
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          {isLoading ? "..." : value}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{title}</div>
      </CardBody>
    </Card>
  </motion.div>
);

interface V1AnalysisCardProps {
  analysis: V1AnalysisResponse;
  delay?: number;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}

const V1AnalysisCard = ({ analysis, delay = 0, onDelete, onRetry }: V1AnalysisCardProps) => {
  const navigate = useNavigate();
  const url = new URL(analysis.url).hostname;
  const status = analysis.status;
  
  // Calculate progress percentage
  const progressPercentage = analysis.progress?.progress_percentage || 0;
  const currentAnalyzer = analysis.progress?.current_analyzer;
  
  // Get status color and icon
  const getStatusDisplay = () => {
    switch (status) {
      case 'completed':
        return { color: 'success', icon: <CheckIcon size={16} />, text: 'Completed' };
      case 'failed':
        return { color: 'danger', icon: <ExclamationIcon size={16} />, text: 'Failed' };
      case 'running':
        return { color: 'warning', icon: <RefreshIcon className="animate-spin" size={16} />, text: 'Running' };
      default:
        return { color: 'default', icon: <ClockIcon size={16} />, text: 'Pending' };
    }
  };

  const statusDisplay = getStatusDisplay();
  const timestamp = new Date(analysis.created_at).toLocaleString();

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
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
            <div className="flex items-center gap-2">
              {statusDisplay.icon}
              <Chip
                color={statusDisplay.color as any}
                size="sm"
                variant="flat"
              >
                {statusDisplay.text}
              </Chip>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-2">
          {/* Progress bar for running analyses */}
          {status === 'running' && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Progress: {progressPercentage}%
                </span>
                {currentAnalyzer && (
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    Running: {currentAnalyzer}
                  </span>
                )}
              </div>
              <Progress
                color="warning"
                size="sm"
                value={progressPercentage}
              />
            </div>
          )}

          {/* Analyzer status for running analyses */}
          {status === 'running' && analysis.progress?.analyzer_status && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analyzers:
              </h4>
              <div className="space-y-1">
                {analysis.progress.analyzer_status.slice(0, 3).map((analyzer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      analyzer.status === 'completed' ? 'bg-green-500' :
                      analyzer.status === 'running' ? 'bg-orange-500 animate-pulse' :
                      analyzer.status === 'failed' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {analyzer.name}: {analyzer.status}
                      {analyzer.execution_time && ` (${analyzer.execution_time.toFixed(1)}s)`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results summary for completed analyses */}
          {status === 'completed' && analysis.results && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {analysis.results.summary.successful_analyzers}
                  </div>
                  <div className="text-xs text-gray-500">Successful</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {analysis.results.summary.critical_issues}
                  </div>
                  <div className="text-xs text-gray-500">Critical Issues</div>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            <Button
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              size="sm"
              variant="bordered"
              onPress={() => navigate(`/analysis/${analysis.id}`)}
            >
              {status === 'completed' ? 'View Results' : 'View Details'}
            </Button>
            <div className="flex gap-2">
              {status === 'failed' && (
                <Button
                  className="flex-1 border-green-300 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  size="sm"
                  variant="bordered"
                  onPress={() => onRetry(analysis.id)}
                >
                  Retry
                </Button>
              )}
              <Button
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                size="sm"
                variant="bordered"
                onPress={() => onDelete(analysis.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default function DashboardV1Page() {
  const [newAnalysisUrl, setNewAnalysisUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyses, setAnalyses] = useState<V1AnalysisResponse[]>([]);
  const [systemHealth, setSystemHealth] = useState<V1SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<V1PerformanceMetrics | null>(null);
  const [activePollers, setActivePollers] = useState<Map<string, AnalysisProgressPoller>>(new Map());
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen: isHealthModalOpen, onOpen: onHealthModalOpen, onClose: onHealthModalClose } = useDisclosure();

  // Fetch analyses with v1 API
  const fetchAnalyses = useCallback(async () => {
    try {
      const response = await v1ApiClient.getAnalyses(1, 20);
      setAnalyses(response.analyses);

      // Start polling for running analyses
      response.analyses
        .filter(analysis => analysis.status === 'running')
        .forEach(analysis => {
          if (!activePollers.has(analysis.id)) {
            startProgressPolling(analysis);
          }
        });

      // Stop polling for completed/failed analyses
      activePollers.forEach((poller, id) => {
        if (!response.analyses.some(a => a.id === id && a.status === 'running')) {
          poller.stop();
          activePollers.delete(id);
        }
      });

    } catch (err) {
      console.error("Failed to fetch analyses", err);
    }
  }, [activePollers]);

  // Start progress polling for a specific analysis
  const startProgressPolling = (analysis: V1AnalysisResponse) => {
    const poller = new AnalysisProgressPoller(v1ApiClient, analysis.id, 2000);
    
    poller.start({
      onUpdate: (updatedAnalysis) => {
        setAnalyses(prev => prev.map(a => 
          a.id === updatedAnalysis.id ? updatedAnalysis : a
        ));
      },
      onComplete: (completedAnalysis) => {
        setAnalyses(prev => prev.map(a => 
          a.id === completedAnalysis.id ? completedAnalysis : a
        ));
        activePollers.delete(analysis.id);
      },
      onError: (error) => {
        console.error(`Polling error for analysis ${analysis.id}:`, error);
        activePollers.delete(analysis.id);
      }
    });

    activePollers.set(analysis.id, poller);
  };

  // Fetch system health
  const fetchSystemHealth = async () => {
    try {
      const health = await v1ApiClient.getSystemHealth();
      setSystemHealth(health);
    } catch (err) {
      console.error("Failed to fetch system health", err);
    }
  };

  // Fetch performance metrics
  const fetchPerformanceMetrics = async () => {
    try {
      const metrics = await v1ApiClient.getPerformanceMetrics(24);
      setPerformanceMetrics(metrics);
    } catch (err) {
      console.error("Failed to fetch performance metrics", err);
    }
  };

  useEffect(() => {
    fetchAnalyses();
    fetchSystemHealth();
    fetchPerformanceMetrics();

    // Set up polling intervals
    const analysesInterval = setInterval(fetchAnalyses, 30000); // Every 30s
    const healthInterval = setInterval(fetchSystemHealth, 60000); // Every 60s
    const metricsInterval = setInterval(fetchPerformanceMetrics, 300000); // Every 5m

    return () => {
      clearInterval(analysesInterval);
      clearInterval(healthInterval);
      clearInterval(metricsInterval);
      
      // Stop all active pollers
      activePollers.forEach(poller => poller.stop());
    };
  }, [fetchAnalyses]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDelete = async (id: string) => {
    try {
      await v1ApiClient.deleteAnalysis(id);
      await fetchAnalyses();
    } catch (err) {
      console.error("Failed to delete analysis", err);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await v1ApiClient.retryAnalysis(id);
      await fetchAnalyses();
    } catch (err) {
      console.error("Failed to retry analysis", err);
    }
  };

  const handleNewAnalysis = async () => {
    if (!newAnalysisUrl) return;

    let urlToAnalyze = newAnalysisUrl.trim();
    if (!/^https?:\/\//i.test(urlToAnalyze)) {
      urlToAnalyze = `https://${urlToAnalyze}`;
    }
    
    try {
      new URL(urlToAnalyze);
    } catch {
      setUrlError("Please enter a valid URL");
      return;
    }
    setUrlError(null);

    try {
      setIsSubmitting(true);
      
      // Use enhanced API client for real-time updates
      const { analysis } = await enhancedApiClient.createAnalysisWithProgress(
        urlToAnalyze,
        undefined, // Use default profile
        {
          onUpdate: (updatedAnalysis) => {
            setAnalyses(prev => prev.map(a => 
              a.id === updatedAnalysis.id ? updatedAnalysis : a
            ));
          },
          onComplete: (completedAnalysis) => {
            setAnalyses(prev => prev.map(a => 
              a.id === completedAnalysis.id ? completedAnalysis : a
            ));
          },
          onError: (error) => {
            console.error("Analysis progress error:", error);
          }
        }
      );

      setNewAnalysisUrl("");
      await fetchAnalyses();
    } catch (err) {
      console.error("Analysis request failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSystemHealthColor = () => {
    if (!systemHealth) return 'default';
    switch (systemHealth.status) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'danger';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* Header with System Status */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-orange-200 dark:border-orange-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    AI Analysis Dashboard v1
                  </h1>
                  <Chip
                    color={getSystemHealthColor() as any}
                    size="sm"
                    variant="flat"
                    className="cursor-pointer"
                    onClick={onHealthModalOpen}
                  >
                    System {systemHealth?.status || 'Unknown'}
                  </Chip>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back, {user?.first_name || user?.email}! Enhanced v1 dashboard with real-time updates
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  variant="bordered"
                  onPress={() => navigate("/analysis")}
                >
                  All Analyses
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  color="primary"
                  onPress={() => document.getElementById('new-analysis-input')?.focus()}
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
          {/* Enhanced Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              delay={0.1}
              icon={<BrainIcon size={24} />}
              title="Total Analyses"
              trend={performanceMetrics ? `${performanceMetrics.summary.total_analyses} total` : undefined}
              value={performanceMetrics?.summary.total_analyses || "..."}
              isLoading={!performanceMetrics}
            />
            <StatCard
              delay={0.2}
              icon={<CheckIcon size={24} />}
              title="Success Rate"
              trend={performanceMetrics ? `${performanceMetrics.summary.success_rate}% success` : undefined}
              value={performanceMetrics ? `${performanceMetrics.summary.success_rate}%` : "..."}
              isLoading={!performanceMetrics}
            />
            <StatCard
              delay={0.3}
              icon={<ClockIcon size={24} />}
              title="Avg. Time"
              trend={performanceMetrics ? "Real-time tracking" : undefined}
              value={performanceMetrics ? `${Math.round(performanceMetrics.summary.avg_completion_time_seconds)}s` : "..."}
              isLoading={!performanceMetrics}
            />
            <StatCard
              delay={0.4}
              icon={<ZapIcon size={24} />}
              title="Active Jobs"
              trend={performanceMetrics ? `${performanceMetrics.summary.running} running` : undefined}
              value={performanceMetrics?.summary.running || "..."}
              isLoading={!performanceMetrics}
              color="blue"
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
                    Start New AI Analysis (v1)
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Enhanced v1 system with real-time progress tracking and modular analyzers
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Input
                  id="new-analysis-input"
                  className="flex-1"
                  classNames={{
                    inputWrapper:
                      "bg-white dark:bg-gray-700 border-2 border-orange-200 dark:border-orange-700 hover:border-orange-300 focus-within:border-orange-500",
                  }}
                  placeholder="Enter URL (e.g., https://yoursite.com)"
                  value={newAnalysisUrl}
                  onChange={(e) => setNewAnalysisUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNewAnalysis()}
                />
                <Button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-8"
                  color="primary"
                  disabled={!newAnalysisUrl || isSubmitting}
                  isLoading={isSubmitting}
                  onPress={handleNewAnalysis}
                >
                  {isSubmitting ? "Starting..." : "Analyze"}
                </Button>
              </div>
              {urlError && (
                <p className="text-sm text-red-600 mt-2">{urlError}</p>
              )}
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
                  Recent Analyses (v1)
                </h2>
                <div className="space-y-4">
                  {analyses.length > 0 ? (
                    analyses.map((analysis, index) => (
                      <V1AnalysisCard
                        key={analysis.id}
                        analysis={analysis}
                        onDelete={handleDelete}
                        onRetry={handleRetry}
                        delay={0.7 + index * 0.1}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No analyses yet. Create your first analysis above!
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
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
                    key="system"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <ZapIcon size={16} />
                        <span>System</span>
                      </div>
                    }
                  >
                    <div className="space-y-3 mt-4">
                      <div className={`p-3 rounded-lg ${
                        systemHealth?.status === 'healthy' 
                          ? 'bg-green-50 dark:bg-green-900/20' 
                          : systemHealth?.status === 'degraded'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20'
                          : 'bg-red-50 dark:bg-red-900/20'
                      }`}>
                        <div className={`font-medium text-sm ${
                          systemHealth?.status === 'healthy' 
                            ? 'text-green-800 dark:text-green-300'
                            : systemHealth?.status === 'degraded'
                            ? 'text-yellow-800 dark:text-yellow-300'
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                          System Health: {systemHealth?.status || 'Unknown'}
                        </div>
                        <div className={`text-xs ${
                          systemHealth?.status === 'healthy' 
                            ? 'text-green-600 dark:text-green-400'
                            : systemHealth?.status === 'degraded'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          Database: {systemHealth?.components.database.status || 'Unknown'}
                        </div>
                        <div className={`text-xs ${
                          systemHealth?.status === 'healthy' 
                            ? 'text-green-600 dark:text-green-400'
                            : systemHealth?.status === 'degraded'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          Workers: {systemHealth?.components.celery.active_workers || 0} active
                        </div>
                      </div>

                      {performanceMetrics && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                            Last 24 Hours
                          </div>
                          <div className="text-blue-600 dark:text-blue-400 text-xs">
                            {performanceMetrics.summary.completed} completed, {performanceMetrics.summary.failed} failed
                          </div>
                        </div>
                      )}
                    </div>
                  </Tab>

                  <Tab
                    key="analyzers"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <BarChartIcon size={16} />
                        <span>Analyzers</span>
                      </div>
                    }
                  >
                    <div className="space-y-4 mt-4">
                      {performanceMetrics?.analyzer_performance.slice(0, 3).map((analyzer, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {analyzer.name}
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                              {analyzer.success_rate}%
                            </span>
                          </div>
                          <Progress 
                            color={analyzer.success_rate >= 90 ? "success" : analyzer.success_rate >= 70 ? "warning" : "danger"}
                            size="sm" 
                            value={analyzer.success_rate} 
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {analyzer.total_runs} runs, avg {analyzer.avg_execution_time.toFixed(1)}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab>

                  <Tab
                    key="activity"
                    title={
                      <div className="flex items-center gap-2 w-full">
                        <EyeIcon size={16} />
                        <span>Activity</span>
                      </div>
                    }
                  >
                    <div className="space-y-3 mt-4">
                      {analyses.slice(0, 5).map((analysis, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            analysis.status === 'completed' ? 'bg-green-500' :
                            analysis.status === 'running' ? 'bg-orange-500 animate-pulse' :
                            analysis.status === 'failed' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-800 dark:text-white truncate">
                              {new URL(analysis.url).hostname}
                            </div>
                            <div className="text-xs text-gray-500">
                              {analysis.status} • {new Date(analysis.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tab>
                </Tabs>
              </DashboardCard>
            </div>
          </div>
        </div>

        {/* System Health Modal */}
        <Modal isOpen={isHealthModalOpen} onClose={onHealthModalClose} size="2xl">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">System Health Details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleString() : 'Unknown'}
              </p>
            </ModalHeader>
            <ModalBody>
              {systemHealth && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardBody className="p-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">Database</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.components.database.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm capitalize">{systemHealth.components.database.status}</span>
                        </div>
                        {systemHealth.components.database.response_time && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Response: {systemHealth.components.database.response_time}
                          </p>
                        )}
                        {systemHealth.components.database.error && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {systemHealth.components.database.error}
                          </p>
                        )}
                      </CardBody>
                    </Card>

                    <Card>
                      <CardBody className="p-4">
                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">Celery Workers</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            systemHealth.components.celery.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-sm capitalize">{systemHealth.components.celery.status}</span>
                        </div>
                        {systemHealth.components.celery.active_workers !== undefined && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Active: {systemHealth.components.celery.active_workers} workers
                          </p>
                        )}
                        {systemHealth.components.celery.worker_names && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Workers: {systemHealth.components.celery.worker_names.join(', ')}
                          </p>
                        )}
                        {systemHealth.components.celery.error && (
                          <p className="text-xs text-red-600 mt-1">
                            Error: {systemHealth.components.celery.error}
                          </p>
                        )}
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onHealthModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </DashboardLayout>
  );
}