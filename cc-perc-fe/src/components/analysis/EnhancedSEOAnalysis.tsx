import { Card, CardBody, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { motion } from "framer-motion";
import { 
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  BrainIcon
} from "@/components/icons";

interface EnhancedSEOData {
  seo_score: number;
  technical_seo: any;
  content_seo: any;
  meta_tags: any;
  schema_markup: any;
  performance_hints: any;
  mobile_friendliness: any;
  issues: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  warnings: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  opportunities: Array<{
    type: string;
    message: string;
  }>;
  recommendations: Array<{
    priority: string;
    category: string;
    issue: string;
    action: string;
    impact: string;
  }>;
  ai_search_readiness: {
    score: number;
    rating: string;
    factors: string[];
  };
}

interface EnhancedSEOAnalysisProps {
  seoData?: EnhancedSEOData;
}

export function EnhancedSEOAnalysis({ seoData }: EnhancedSEOAnalysisProps) {
  if (!seoData) {
    return (
      <Card className="bg-orange-50 dark:bg-orange-900/20">
        <CardBody>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Enhanced SEO analysis not available for this analysis.
          </p>
        </CardBody>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardBody className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">Overall SEO Score</h3>
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
                  strokeDasharray={`${seoData.seo_score * 3.51} 351.86`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                  className="text-orange-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{seoData.seo_score}</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Search engine optimization effectiveness
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardBody className="text-center py-8">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <BrainIcon size={24} />
              AI Search Readiness
            </h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {seoData.ai_search_readiness?.score || 0}%
            </div>
            <Chip 
              size="lg" 
              color={
                seoData.ai_search_readiness?.rating === 'Excellent' ? 'success' :
                seoData.ai_search_readiness?.rating === 'Good' ? 'primary' :
                seoData.ai_search_readiness?.rating === 'Fair' ? 'warning' : 'danger'
              }
              variant="flat"
            >
              {seoData.ai_search_readiness?.rating || 'N/A'}
            </Chip>
            <div className="mt-4 text-left">
              <p className="text-sm font-semibold mb-2">Key Factors:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                {(seoData.ai_search_readiness?.factors || []).slice(0, 3).map((factor, index) => (
                  <li key={index} className="flex items-start gap-1">
                    {factor.includes('Missing') ? 
                      <XCircleIcon size={12} className="text-red-500 mt-0.5" /> : 
                      <CheckCircleIcon size={12} className="text-green-500 mt-0.5" />
                    }
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Issues, Warnings, and Opportunities */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Critical Issues */}
        <Card className="border-2 border-red-200 dark:border-red-700">
          <CardHeader className="bg-red-50 dark:bg-red-900/20 pb-3">
            <div className="flex items-center gap-2">
              <XCircleIcon size={20} className="text-red-500" />
              <h4 className="font-semibold">Critical Issues ({seoData.issues.length})</h4>
            </div>
          </CardHeader>
          <CardBody className="space-y-2 max-h-64 overflow-y-auto">
            {seoData.issues.length === 0 ? (
              <p className="text-sm text-gray-500">No critical issues found!</p>
            ) : (
              seoData.issues.map((issue, index) => (
                <div key={index} className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm">
                  <p className="font-medium text-red-700 dark:text-red-300">{issue.message}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Type: {issue.type}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Warnings */}
        <Card className="border-2 border-yellow-200 dark:border-yellow-700">
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircleIcon size={20} className="text-yellow-600" />
              <h4 className="font-semibold">Warnings ({seoData.warnings.length})</h4>
            </div>
          </CardHeader>
          <CardBody className="space-y-2 max-h-64 overflow-y-auto">
            {seoData.warnings.length === 0 ? (
              <p className="text-sm text-gray-500">No warnings found!</p>
            ) : (
              seoData.warnings.map((warning, index) => (
                <div key={index} className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm">
                  <p className="font-medium text-yellow-700 dark:text-yellow-300">{warning.message}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Type: {warning.type}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Opportunities */}
        <Card className="border-2 border-green-200 dark:border-green-700">
          <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUpIcon size={20} className="text-green-600" />
              <h4 className="font-semibold">Opportunities ({seoData.opportunities.length})</h4>
            </div>
          </CardHeader>
          <CardBody className="space-y-2 max-h-64 overflow-y-auto">
            {seoData.opportunities.length === 0 ? (
              <p className="text-sm text-gray-500">No additional opportunities found!</p>
            ) : (
              seoData.opportunities.map((opportunity, index) => (
                <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
                  <p className="font-medium text-green-700 dark:text-green-300">{opportunity.message}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Type: {opportunity.type}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <SearchIcon size={20} />
            Top SEO Recommendations
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {seoData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold capitalize">{rec.category.replace(/_/g, ' ')}</h4>
                  <Chip size="sm" color={getPriorityColor(rec.priority) as any} variant="flat">
                    {rec.priority} priority
                  </Chip>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{rec.issue}</p>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-3">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                    Recommended Action:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{rec.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Impact: {rec.impact}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Card>
        <CardBody>
          <Tabs aria-label="SEO Details" color="warning">
            <Tab key="technical" title="Technical SEO">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>HTTPS</span>
                    <Chip 
                      size="sm" 
                      color={seoData.technical_seo.https ? "success" : "danger"}
                      variant="flat"
                    >
                      {seoData.technical_seo.https ? "Secure" : "Not Secure"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Canonical Tag</span>
                    <Chip 
                      size="sm" 
                      color={seoData.technical_seo.canonical_tag ? "success" : "warning"}
                      variant="flat"
                    >
                      {seoData.technical_seo.canonical_tag ? "Present" : "Missing"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>Robots Meta</span>
                    <Chip 
                      size="sm" 
                      color={seoData.technical_seo.robots_meta ? "success" : "default"}
                      variant="flat"
                    >
                      {seoData.technical_seo.robots_meta || "Not Set"}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>International SEO</span>
                    <span className="text-sm">
                      {seoData.technical_seo.hreflang_tags.length} hreflang tags
                    </span>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="content" title="Content SEO">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-2xl font-bold text-orange-500">
                      {seoData.content_seo.word_count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Word Count</div>
                    <Progress 
                      value={seoData.content_seo.content_length_score} 
                      color={seoData.content_seo.content_length_score > 80 ? "success" : "warning"}
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <div className="text-2xl font-bold text-orange-500">
                      {seoData.content_seo.images.total}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Images</div>
                    <Progress 
                      value={seoData.content_seo.images.alt_text_coverage} 
                      color={seoData.content_seo.images.alt_text_coverage > 80 ? "success" : "warning"}
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Heading Structure</h4>
                  <div className="space-y-2">
                    {Object.entries(seoData.content_seo.headings).slice(0, 3).map(([level, data]: [string, any]) => (
                      <div key={level} className="flex items-center justify-between text-sm">
                        <span className="uppercase font-medium">{level}</span>
                        <span>{data.count} {data.count === 1 ? 'tag' : 'tags'}</span>
                      </div>
                    ))}
                  </div>
                  {seoData.content_seo.heading_issues.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Issues: {seoData.content_seo.heading_issues.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab>

            <Tab key="meta" title="Meta Tags">
              <div className="space-y-4 mt-4">
                {seoData.meta_tags.title && (
                  <div>
                    <h4 className="font-semibold mb-2">Title Tag</h4>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {seoData.meta_tags.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Length: {seoData.meta_tags.title_length} characters</span>
                      <Chip 
                        size="sm" 
                        color={seoData.meta_tags.title_length >= 30 && seoData.meta_tags.title_length <= 60 ? "success" : "warning"}
                        variant="flat"
                      >
                        {seoData.meta_tags.title_length >= 30 && seoData.meta_tags.title_length <= 60 ? "Optimal" : "Not Optimal"}
                      </Chip>
                    </div>
                  </div>
                )}
                
                {seoData.meta_tags.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Meta Description</h4>
                    <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      {seoData.meta_tags.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Length: {seoData.meta_tags.description_length} characters</span>
                      <Chip 
                        size="sm" 
                        color={seoData.meta_tags.description_length >= 120 && seoData.meta_tags.description_length <= 160 ? "success" : "warning"}
                        variant="flat"
                      >
                        {seoData.meta_tags.description_length >= 120 && seoData.meta_tags.description_length <= 160 ? "Optimal" : "Not Optimal"}
                      </Chip>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold mb-2">Social Media Tags</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <span>Open Graph</span>
                      <Chip 
                        size="sm" 
                        color={Object.keys(seoData.meta_tags.og_tags || {}).length > 0 ? "success" : "warning"}
                        variant="flat"
                      >
                        {Object.keys(seoData.meta_tags.og_tags || {}).length} tags
                      </Chip>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <span>Twitter Card</span>
                      <Chip 
                        size="sm" 
                        color={Object.keys(seoData.meta_tags.twitter_tags || {}).length > 0 ? "success" : "warning"}
                        variant="flat"
                      >
                        {Object.keys(seoData.meta_tags.twitter_tags || {}).length} tags
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab key="schema" title="Structured Data">
              <div className="space-y-4 mt-4">
                <div className="text-center p-8">
                  {seoData.schema_markup.has_schema ? (
                    <>
                      <CheckCircleIcon size={48} className="text-green-500 mx-auto mb-4" />
                      <h4 className="font-semibold text-green-600 mb-2">Structured Data Found!</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          JSON-LD Scripts: {seoData.schema_markup.json_ld.length}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Microdata Items: {seoData.schema_markup.microdata.length}
                        </p>
                        {seoData.schema_markup.types_found.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Schema Types:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {seoData.schema_markup.types_found.map((type: string, index: number) => (
                                <Chip key={index} size="sm" variant="flat" color="primary">
                                  {type}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
                      <h4 className="font-semibold text-red-600 mb-2">No Structured Data Found</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Adding Schema.org markup helps search engines understand your content better.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}