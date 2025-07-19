import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import type { DetailedReport, Analysis } from "@/types/analysis";
import { BrainIcon, ZapIcon, AlertCircleIcon, CheckCircleIcon, EditIcon, EyeIcon, GlobeIcon, BarChartIcon } from "@/components/icons";

interface ExecutiveSummaryProps {
  report?: DetailedReport;
  analysis?: Analysis;
}

export function ExecutiveSummary({ report, analysis }: ExecutiveSummaryProps) {
  const executiveSummary = report?.executive_summary;
  const scores = analysis?.ai_analysis?.scores;
  
  const overallScore = executiveSummary?.overall_score || scores?.overall_score || 0;
  const grade = executiveSummary?.grade || 'N/A';
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-orange-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardBody className="p-6 space-y-6">
        {/* Header with Score */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <BrainIcon className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Executive Summary</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-4xl font-bold ${getGradeColor(grade)}`}>
                {grade}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">{Math.round(overallScore)}/100</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
                </div>
                <Progress
                  color={getScoreColor(overallScore)}
                  size="sm"
                  value={overallScore}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        {scores && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Content', score: scores.content_score, IconComponent: EditIcon },
              { label: 'Visual', score: scores.visual_score, IconComponent: EyeIcon },
              { label: 'SEO', score: scores.seo_score, IconComponent: GlobeIcon },
              { label: 'UX', score: scores.ux_score, IconComponent: BarChartIcon },
              { label: 'Performance', score: scores.performance_score, IconComponent: ZapIcon },
            ].map((category) => (
              <div key={category.label} className="text-center">
                <div className="flex justify-center mb-1">
                  <category.IconComponent size={24} className="text-orange-500" />
                </div>
                <div className="text-lg font-semibold">{Math.round(category.score || 0)}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{category.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Key Findings */}
        {executiveSummary?.key_findings && executiveSummary.key_findings.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <CheckCircleIcon size={20} className="text-green-600" />
              Key Findings
            </h3>
            <ul className="space-y-2">
              {executiveSummary.key_findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Critical Issues */}
        {executiveSummary?.critical_issues && executiveSummary.critical_issues.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <AlertCircleIcon size={20} className="text-red-600" />
              Critical Issues
            </h3>
            <ul className="space-y-2">
              {executiveSummary.critical_issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Wins */}
        {executiveSummary?.quick_wins && executiveSummary.quick_wins.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
              <ZapIcon size={20} className="text-orange-600" />
              Quick Wins
            </h3>
            <div className="space-y-2">
              {executiveSummary.quick_wins.map((win, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Chip size="sm" color="warning" variant="flat">Quick</Chip>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{win}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Recommendations */}
        {executiveSummary?.strategic_recommendations && executiveSummary.strategic_recommendations.length > 0 && (
          <div>
            <h3 className="font-medium text-lg mb-3">Strategic Recommendations</h3>
            <div className="space-y-2">
              {executiveSummary.strategic_recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Chip size="sm" color="primary" variant="flat">Strategic</Chip>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Time */}
        {analysis?.processing_time && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Analysis completed in {analysis.processing_time.toFixed(1)} seconds
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}