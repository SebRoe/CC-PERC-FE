import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { motion } from "framer-motion";
import { 
  EyeIcon, 
  BrainIcon, 
  AlertCircleIcon,
  ImageIcon,
  CodeIcon,
  SearchIcon
} from "@/components/icons";

interface AIVisibilityData {
  ai_visibility_score: number;
  human_vs_ai_comparison: {
    human_perception: {
      total_images: number;
      visual_elements: number;
      rich_media_count: number;
      interactive_features: number;
    };
    ai_perception: {
      accessible_images: number;
      readable_text: number;
      seo_completeness: number;
      structured_data_present: boolean;
    };
  };
  blindspots: Array<{
    type: string;
    severity: string;
    count?: number;
    impact: string;
    examples?: any[];
  }>;
  detailed_analysis: {
    images: {
      total_images: number;
      images_with_alt: number;
      images_without_alt: number;
      alt_text_coverage: number;
      ai_invisible_images: number;
    };
    text_visibility: {
      visible_text_ratio: number;
      total_visible_words: number;
      ai_readable_words: number;
      text_in_images_estimate: number;
    };
    seo: {
      seo_score: number;
      has_title: boolean;
      has_meta_description: boolean;
      has_open_graph: boolean;
      seo_issues: string[];
    };
  };
}

interface HumanVsAIPerceptionProps {
  aiVisibility?: AIVisibilityData;
  enhancedSeo?: any;
}

export function HumanVsAIPerception({ aiVisibility, enhancedSeo }: HumanVsAIPerceptionProps) {
  if (!aiVisibility || !aiVisibility.human_vs_ai_comparison) {
    return (
      <Card className="bg-orange-50 dark:bg-orange-900/20">
        <CardBody>
          <p className="text-center text-gray-600 dark:text-gray-300">
            AI visibility analysis not available for this analysis.
          </p>
        </CardBody>
      </Card>
    );
  }

  const { human_vs_ai_comparison, blindspots, detailed_analysis } = aiVisibility;
  const human = human_vs_ai_comparison.human_perception;
  const ai = human_vs_ai_comparison.ai_perception;

  const renderBlindspot = (blindspot: any, index: number) => {
    const severityColor = {
      high: "danger",
      medium: "warning",
      low: "default"
    }[blindspot.severity] || "default";

    const blindspotIcons = {
      missing_alt_text: <ImageIcon size={20} />,
      javascript_dependency: <CodeIcon size={20} />,
      hidden_interactive_content: <EyeIcon size={20} />,
      text_in_images: <ImageIcon size={20} />
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all">
          <CardBody className="flex flex-row items-start gap-4">
            <div className="text-orange-500">
              {blindspotIcons[blindspot.type] || <AlertCircleIcon size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold capitalize">
                  {blindspot.type.replace(/_/g, ' ')}
                </h4>
                <Chip size="sm" color={severityColor as any} variant="flat">
                  {blindspot.severity}
                </Chip>
                {blindspot.count && (
                  <Chip size="sm" variant="flat">
                    {blindspot.count} items
                  </Chip>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {blindspot.impact}
              </p>
              {blindspot.examples && blindspot.examples.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Examples:</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    {blindspot.examples.slice(0, 3).map((example, i) => (
                      <li key={i} className="truncate">
                        • {example.src || example.context || JSON.stringify(example)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Visibility Score */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <CardBody className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">AI Visibility Score</h3>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-300 dark:text-gray-600"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${aiVisibility.ai_visibility_score * 3.51} 351.86`}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
                className="text-orange-500 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{aiVisibility.ai_visibility_score}%</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            How well AI agents can understand and interpret your content
          </p>
        </CardBody>
      </Card>

      {/* Human vs AI Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Human Perception */}
        <Card className="border-2 border-blue-200 dark:border-blue-700">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-3">
              <EyeIcon size={24} className="text-blue-500" />
              <h3 className="text-lg font-bold">What Humans See</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Visual Elements</span>
                <span className="font-semibold">{human.visual_elements}</span>
              </div>
              <Progress value={100} color="primary" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Images & Media</span>
                <span className="font-semibold">{human.total_images}</span>
              </div>
              <Progress value={100} color="primary" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Interactive Features</span>
                <span className="font-semibold">{human.interactive_features}</span>
              </div>
              <Progress value={100} color="primary" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Rich Media</span>
                <span className="font-semibold">{human.rich_media_count}</span>
              </div>
              <Progress value={100} color="primary" />
            </div>
          </CardBody>
        </Card>

        {/* AI Perception */}
        <Card className="border-2 border-orange-200 dark:border-orange-700">
          <CardHeader className="bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-center gap-3">
              <BrainIcon size={24} className="text-orange-500" />
              <h3 className="text-lg font-bold">What AI Sees</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Accessible Images</span>
                <span className="font-semibold">
                  {ai.accessible_images}/{human.total_images}
                </span>
              </div>
              <Progress 
                value={(ai.accessible_images / human.total_images) * 100} 
                color={ai.accessible_images / human.total_images > 0.8 ? "success" : "warning"} 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Readable Text</span>
                <span className="font-semibold">{Math.round(ai.readable_text)}%</span>
              </div>
              <Progress 
                value={ai.readable_text} 
                color={ai.readable_text > 80 ? "success" : ai.readable_text > 60 ? "warning" : "danger"} 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>SEO Completeness</span>
                <span className="font-semibold">{Math.round(ai.seo_completeness)}%</span>
              </div>
              <Progress 
                value={ai.seo_completeness} 
                color={ai.seo_completeness > 80 ? "success" : ai.seo_completeness > 60 ? "warning" : "danger"} 
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>Structured Data</span>
                <Chip 
                  size="sm" 
                  color={ai.structured_data_present ? "success" : "danger"}
                  variant="flat"
                >
                  {ai.structured_data_present ? "Present" : "Missing"}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* AI Blindspots */}
      {blindspots && blindspots.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircleIcon size={24} className="text-orange-500" />
            AI Blindspots Detected
          </h3>
          <div className="space-y-4">
            {blindspots.map((blindspot, index) => renderBlindspot(blindspot, index))}
          </div>
        </div>
      )}

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardBody>
          <Tabs aria-label="AI Visibility Details" color="warning">
            <Tab key="images" title="Image Visibility">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {detailed_analysis.images.total_images}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Images</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {detailed_analysis.images.images_with_alt}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">With Alt Text</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {detailed_analysis.images.images_without_alt}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Missing Alt Text</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {Math.round(detailed_analysis.images.alt_text_coverage)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Coverage</div>
                  </div>
                </div>
                <Progress 
                  label="Alt Text Coverage"
                  value={detailed_analysis.images.alt_text_coverage}
                  color={detailed_analysis.images.alt_text_coverage > 80 ? "success" : "warning"}
                  showValueLabel
                />
              </div>
            </Tab>
            
            <Tab key="text" title="Text Visibility">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {detailed_analysis.text_visibility.total_visible_words}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {detailed_analysis.text_visibility.ai_readable_words}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">AI Readable</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {detailed_analysis.text_visibility.text_in_images_estimate}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Text in Images</div>
                  </div>
                </div>
                <Progress 
                  label="Text Visibility to AI"
                  value={detailed_analysis.text_visibility.visible_text_ratio}
                  color={detailed_analysis.text_visibility.visible_text_ratio > 80 ? "success" : "warning"}
                  showValueLabel
                />
              </div>
            </Tab>
            
            <Tab key="seo" title="SEO Elements">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Title Tag</span>
                    <Chip 
                      size="sm" 
                      color={detailed_analysis.seo.has_title ? "success" : "danger"}
                      variant="flat"
                    >
                      {detailed_analysis.seo.has_title ? "Present" : "Missing"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Meta Description</span>
                    <Chip 
                      size="sm" 
                      color={detailed_analysis.seo.has_meta_description ? "success" : "danger"}
                      variant="flat"
                    >
                      {detailed_analysis.seo.has_meta_description ? "Present" : "Missing"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Open Graph</span>
                    <Chip 
                      size="sm" 
                      color={detailed_analysis.seo.has_open_graph ? "success" : "danger"}
                      variant="flat"
                    >
                      {detailed_analysis.seo.has_open_graph ? "Present" : "Missing"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>SEO Score</span>
                    <span className="font-bold text-orange-500">
                      {detailed_analysis.seo.seo_score}%
                    </span>
                  </div>
                </div>
                {detailed_analysis.seo.seo_issues && detailed_analysis.seo.seo_issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">SEO Issues:</h4>
                    <ul className="space-y-1">
                      {detailed_analysis.seo.seo_issues.map((issue, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}