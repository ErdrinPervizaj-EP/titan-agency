import { History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardHeader } from './ui';
import { superAdminApi } from './api';
import { ErrorState, LoadingState, PageIntro, SuperAdminMetricCard } from './components';
import type { OverviewPayload } from './types';

export default function OverviewPage() {
  const [searchParams] = useSearchParams();
  const [payload, setPayload] = useState<OverviewPayload | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    superAdminApi.overview(searchParams, controller.signal).then(({ data }) => setPayload(data)).catch((caught: unknown) => {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Unable to load overview');
    });
    return () => controller.abort();
  }, [searchParams, revision]);

  return (
    <div className="space-y-5">
      <PageIntro eyebrow="Platform control center" title="Overview" description="A complete operational picture across every organization running on Desk.TitanNetwork." />
      {!payload && !error && <Card><LoadingState rows={8} /></Card>}
      {error && <Card><ErrorState message={error} onRetry={() => setRevision((value) => value + 1)} /></Card>}
      {payload && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{payload.metrics.map((item) => <SuperAdminMetricCard key={item.key} metric={item} />)}</div>
          <Card className="overflow-hidden">
            <CardHeader icon={History} title="Recent Super Admin actions" />
            <div className="divide-y divide-line-soft">
              {payload.recentActions.length === 0 && <p className="px-5 py-6 text-body-sm text-ink-soft">No recorded actions yet.</p>}
              {payload.recentActions.map((row) => (
                <div key={`${row.action}-${row.timestamp}`} className="px-5 py-3">
                  <div className="flex items-center gap-2"><code className="min-w-0 flex-1 truncate text-2xs font-semibold text-ink">{String(row.action)}</code><span className="shrink-0 text-2xs text-ink-muted">{String(row.resource)}</span></div>
                  <p className="mt-1 truncate text-2xs text-ink-muted">{String(row.actor)} · {String(row.timestamp)}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
