import { History as HistoryIcon } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { HistoryTable } from '@/components/history/HistoryTable';

export default function History() {
  return (
    <AppLayout title="History">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <HistoryIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Leaf Health Insights</h1>
              <p className="text-sm text-muted-foreground">
                Explore previous leaf analyses and their diagnostic outcomes
              </p>
            </div>
          </div>
        </div>

        {/* History Table */}
        <HistoryTable />
      </div>
    </AppLayout>
  );
}
