import { Card, CardBody } from "@heroui/card";
import { Progress } from "@heroui/progress";
import type { PerformanceAnalysis } from "@/types/analysis";

interface PerformanceMetricsProps {
  performance?: PerformanceAnalysis;
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  if (!performance) return null;

  const { core_web_vitals, optimization_score, resource_loading } = performance;
  const { estimates, ratings } = core_web_vitals || {};

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600';
      case 'needs improvement':
        return 'text-orange-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'success';
      case 'needs improvement':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-4">Core Web Vitals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* LCP */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">LCP (Largest Contentful Paint)</span>
                <span className={`text-sm ${getRatingColor(ratings?.LCP || '')}`}>
                  {ratings?.LCP || 'unknown'}
                </span>
              </div>
              <div className="text-2xl font-bold">{estimates?.LCP?.toFixed(1)}s</div>
              <Progress
                value={(2.5 - (estimates?.LCP || 0)) / 2.5 * 100}
                color={getProgressColor(ratings?.LCP || '')}
                size="sm"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Target: &lt; 2.5s
              </p>
            </div>

            {/* FID */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FID (First Input Delay)</span>
                <span className={`text-sm ${getRatingColor(ratings?.FID || '')}`}>
                  {ratings?.FID || 'unknown'}
                </span>
              </div>
              <div className="text-2xl font-bold">{estimates?.FID?.toFixed(0)}ms</div>
              <Progress
                value={(100 - (estimates?.FID || 0)) / 100 * 100}
                color={getProgressColor(ratings?.FID || '')}
                size="sm"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Target: &lt; 100ms
              </p>
            </div>

            {/* CLS */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CLS (Cumulative Layout Shift)</span>
                <span className={`text-sm ${getRatingColor(ratings?.CLS || '')}`}>
                  {ratings?.CLS || 'unknown'}
                </span>
              </div>
              <div className="text-2xl font-bold">{estimates?.CLS?.toFixed(3)}</div>
              <Progress
                value={(0.1 - (estimates?.CLS || 0)) / 0.1 * 100}
                color={getProgressColor(ratings?.CLS || '')}
                size="sm"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Target: &lt; 0.1
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Overall Rating:</strong>{' '}
              <span className={`font-medium ${getRatingColor(core_web_vitals?.overall_rating || '')}`}>
                {core_web_vitals?.overall_rating || 'unknown'}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Note: These are estimates. Use PageSpeed Insights for accurate measurements.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Resource Loading */}
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Loading</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Requests</span>
              <span className="font-semibold">{resource_loading?.total_requests || 0}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Scripts</span>
                <span>{resource_loading?.scripts?.all?.length || 0}</span>
              </div>
              <div className="ml-4 text-xs text-gray-600 dark:text-gray-400">
                <span className="mr-4">Async: {resource_loading?.scripts?.async?.length || 0}</span>
                <span className="mr-4">Defer: {resource_loading?.scripts?.defer?.length || 0}</span>
                <span>Blocking: {resource_loading?.scripts?.render_blocking || 0}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Images</span>
                <span>{resource_loading?.images?.all?.length || 0}</span>
              </div>
              <div className="ml-4 text-xs text-gray-600 dark:text-gray-400">
                <span className="mr-4">Lazy loaded: {resource_loading?.images?.lazy_loaded || 0}</span>
                <span>Missing lazy loading: {resource_loading?.images?.missing_lazy_loading || 0}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Stylesheets</span>
              <span>{resource_loading?.stylesheets?.all?.length || 0}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Optimization Score */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Optimization Score</h3>
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(optimization_score || 0)}/100
            </div>
          </div>
          <Progress
            value={optimization_score || 0}
            color="warning"
            size="md"
            className="mt-3"
          />
        </CardBody>
      </Card>

      {/* Recommendations */}
      {performance.recommendations && performance.recommendations.length > 0 && (
        <Card>
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Recommendations</h3>
            <div className="space-y-3">
              {performance.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    rec.priority === 'high' ? 'bg-red-500' :
                    rec.priority === 'medium' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm">{rec.recommendation}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Priority: <span className="font-medium">{rec.priority}</span> | 
                      Impact: <span className="font-medium">{rec.impact}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}