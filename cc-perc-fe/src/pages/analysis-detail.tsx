import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Progress } from "@heroui/progress";
import DashboardLayout from "@/layouts/dashboard";
import { apiClient } from "@/lib/api";
import {
  ArrowLeftIcon,
  BrainIcon,
  GlobeIcon,
  EditIcon,
  BarChartIcon,
} from "@/components/icons";

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (id) {
          const data = await apiClient.getAnalysis(id);
          setAnalysis(data);
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

  const { summary, content, seo, ux, visual_analysis } = analysis.ai_analysis || {};
  const score = summary?.overall_score ?? 0;

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

        {/* Summary Card */}
        <Card>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <BrainIcon className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Overall Score</h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-4xl font-bold ${
                      score >= 80
                        ? "text-green-600"
                        : score >= 60
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {score}
                  </span>
                  <Progress
                    className="flex-1"
                    color={score >= 80 ? "success" : score >= 60 ? "warning" : "danger"}
                    size="sm"
                    value={score}
                  />
                </div>
              </div>
            </div>

            {summary?.key_findings && (
              <div>
                <h3 className="font-medium text-lg mb-2">Key Findings</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {summary.key_findings.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {summary?.action_items && (
              <div>
                <h3 className="font-medium text-lg mb-2">Action Items</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {summary.action_items.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardBody>
        </Card>

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
                <EditIcon size={16} /> <span>Content</span>
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
                <GlobeIcon size={16} /> <span>SEO</span>
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
                <BarChartIcon size={16} /> <span>UX</span>
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
            {visual_analysis ? (
              <pre className="mt-4 whitespace-pre-wrap text-sm">{visual_analysis}</pre>
            ) : (
              <p className="text-gray-500 mt-4">No visual analysis available.</p>
            )}
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 