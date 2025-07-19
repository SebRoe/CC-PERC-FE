import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import DashboardLayout from "@/layouts/dashboard";
import { api } from "@/lib/api-with-interceptor";
import type { Analysis, DetailedReport } from "@/types/analysis";
import {
  ArrowLeftIcon,
  BrainIcon,
  GlobeIcon,
  EditIcon,
  BarChartIcon,
  ZapIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@/components/icons";
import { ExecutiveSummary } from "@/components/analysis/ExecutiveSummary";
import { PerformanceMetrics } from "@/components/analysis/PerformanceMetrics";

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [report, setReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (id) {
          const data = await api.getAnalysis(id);
          setAnalysis(data);
          
          // If report is included in the analysis, use it
          if (data.report) {
            setReport(data.report);
          } else {
            // Otherwise fetch the report separately
            try {
              const reportData = await api.getAnalysisReport(id, 'json') as DetailedReport;
              setReport(reportData);
            } catch (err) {
              console.error("Failed to fetch report", err);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load analysis");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner color="warning" size="lg" variant="dots" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        {error || "Analysis not found"}
        <Button className="mt-4" onPress={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  // Extract data from enhanced structure
  const aiAnalysis = analysis.ai_analysis || {};
  const performanceAnalysis = analysis.performance_analysis;
  const { summary, content, seo, ux, visual_analysis, scores, technical_seo, html_analysis, competitive_insights } = aiAnalysis;
  
  // Get score from the new structure
  const score = report?.executive_summary?.overall_score || scores?.overall_score || summary?.overall_score || 0;
  const grade = report?.executive_summary?.grade || (score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <Button
          className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
          variant="bordered"
          onPress={() => navigate(-1)}
          startContent={<ArrowLeftIcon size={16} />}
        >
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Analysis Report – {new URL(analysis.url).hostname}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Created at: {new Date(analysis.created_at).toLocaleString()}
        </p>

        {/* Executive Summary */}
        <ExecutiveSummary report={report} analysis={analysis} />

        {/* Detailed Tabs */}
        <Tabs
          aria-label="Analysis Details"
          color="primary"
          variant="bordered"
          defaultSelectedKey="content"
        >
          <Tab
            key="content"
            title={
              <div className="flex items-center gap-2">
                <EditIcon size={16} className="text-orange-500" /> <span>Content</span>
              </div>
            }
          >
            {content ? (
              <div className="space-y-3 mt-4">
                <p>
                  <span className="font-medium">Main Value Proposition: </span>
                  {content.main_value_proposition}
                </p>
                <p>
                  <span className="font-medium">Messaging Clarity: </span>
                  {content.messaging_clarity}
                </p>
                <div>
                  <p className="font-medium">Strengths:</p>
                  <ul className="list-disc pl-5">
                    {content.strengths.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Weaknesses:</p>
                  <ul className="list-disc pl-5">
                    {content.weaknesses.map((w: string, i: number) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No content analysis available.</p>
            )}
          </Tab>

          <Tab
            key="seo"
            title={
              <div className="flex items-center gap-2">
                <GlobeIcon size={16} className="text-orange-500" /> <span>SEO</span>
              </div>
            }
          >
            {seo ? (
              <div className="space-y-3 mt-4">
                <p>
                  <span className="font-medium">Title: </span>
                  {seo.title}
                </p>
                <p>
                  <span className="font-medium">Meta Description: </span>
                  {seo.meta_description}
                </p>
                <p>
                  <span className="font-medium">Keyword Density: </span>
                  {seo.keyword_density}%
                </p>
                <div>
                  <p className="font-medium">Recommendations:</p>
                  <ul className="list-disc pl-5">
                    {seo.recommendations.map((rec: string, idx: number) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No SEO analysis available.</p>
            )}
          </Tab>

          <Tab
            key="ux"
            title={
              <div className="flex items-center gap-2">
                <BarChartIcon size={16} className="text-orange-500" /> <span>UX</span>
              </div>
            }
          >
            {ux ? (
              <div className="space-y-3 mt-4">
                <p>
                  <span className="font-medium">Navigation Clarity: </span>
                  {ux.navigation_clarity}
                </p>
                <p>
                  <span className="font-medium">Page Speed: </span>
                  {ux.page_speed}
                </p>
                <div>
                  <p className="font-medium">Accessibility Issues:</p>
                  <ul className="list-disc pl-5">
                    {ux.accessibility_issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No UX analysis available.</p>
            )}
          </Tab>

          <Tab key="visual" title="Visual">
            <div className="mt-4 space-y-4">
              {aiAnalysis.visual_analysis ? (
                <Card>
                  <CardBody className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Layout Score</span>
                      <span className="text-lg font-semibold">{aiAnalysis.visual_analysis.layout_score}/10</span>
                    </div>
                    
                    {aiAnalysis.visual_analysis.visual_hierarchy && (
                      <div>
                        <p className="font-medium mb-2">Visual Hierarchy</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {aiAnalysis.visual_analysis.visual_hierarchy.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {aiAnalysis.visual_analysis.improvement_suggestions && (
                      <div>
                        <p className="font-medium mb-2">Improvement Suggestions</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {aiAnalysis.visual_analysis.improvement_suggestions.map((item: string, idx: number) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <p>
                      <span className="font-medium">Mobile Responsiveness: </span>
                      {aiAnalysis.visual_analysis.mobile_responsiveness}
                    </p>
                  </CardBody>
                </Card>
              ) : visual_analysis ? (
                <pre className="whitespace-pre-wrap text-sm">{visual_analysis}</pre>
              ) : (
                <p className="text-gray-500">No visual analysis available.</p>
              )}
            </div>
          </Tab>

          <Tab
            key="performance"
            title={
              <div className="flex items-center gap-2">
                <ZapIcon size={16} className="text-orange-500" /> <span>Performance</span>
              </div>
            }
          >
            <div className="mt-4">
              <PerformanceMetrics performance={performanceAnalysis} />
            </div>
          </Tab>

          <Tab key="technical" title="Technical">
            <div className="mt-4 space-y-4">
              {/* HTML Structure */}
              {html_analysis && (
                <Card>
                  <CardBody className="p-4 space-y-3">
                    <h3 className="font-semibold">HTML Analysis</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Headings:</span> {html_analysis.heading_structure?.total_headings || 0}
                      </div>
                      <div>
                        <span className="font-medium">Semantic HTML Score:</span> {html_analysis.semantic_html?.semantic_score?.toFixed(0) || 0}%
                      </div>
                      <div>
                        <span className="font-medium">Images with Alt Text:</span> {html_analysis.images?.alt_text_percentage?.toFixed(0) || 0}%
                      </div>
                      <div>
                        <span className="font-medium">Total Links:</span> {html_analysis.links?.total_links || 0}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Technical SEO */}
              {technical_seo && (
                <Card>
                  <CardBody className="p-4 space-y-3">
                    <h3 className="font-semibold">Technical SEO</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Structured Data:</span>
                        {technical_seo.structured_data ? (
                          <><CheckCircleIcon size={16} className="text-green-500" /> <span className="text-green-600">Implemented</span></>
                        ) : (
                          <><XCircleIcon size={16} className="text-red-500" /> <span className="text-red-600">Missing</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Open Graph:</span>
                        {technical_seo.open_graph && Object.keys(technical_seo.open_graph).length > 0 ? (
                          <><CheckCircleIcon size={16} className="text-green-500" /> <span className="text-green-600">Implemented</span></>
                        ) : (
                          <><XCircleIcon size={16} className="text-red-500" /> <span className="text-red-600">Missing</span></>
                        )}
                      </div>
                      <p>
                        <span className="font-medium">Canonical URL:</span>{' '}
                        {technical_seo.canonical_url || 'Not specified'}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Sitemap Reference:</span>
                        {technical_seo.sitemap_reference ? (
                          <><CheckCircleIcon size={16} className="text-green-500" /> <span className="text-green-600">Yes</span></>
                        ) : (
                          <><XCircleIcon size={16} className="text-red-500" /> <span className="text-red-600">No</span></>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Competitive Insights */}
              {competitive_insights && (
                <Card>
                  <CardBody className="p-4 space-y-3">
                    <h3 className="font-semibold">Competitive Insights</h3>
                    {competitive_insights.missing_elements && competitive_insights.missing_elements.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Missing Industry Standard Elements:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {competitive_insights.missing_elements.map((item: string, idx: number) => (
                            <li key={idx} className="text-red-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {competitive_insights.unique_elements && competitive_insights.unique_elements.length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-2">Unique Strengths:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {competitive_insights.unique_elements.map((item: string, idx: number) => (
                            <li key={idx} className="text-green-600">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 