import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, suffix, trend, trendUp, color = 'text-primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-xl p-5 transition hover:border-primary/40"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40', color)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={cn(
            'rounded-full px-2 py-0.5 text-xs font-semibold',
            trendUp ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
          )}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-bold">
        {value}{suffix ?? ''}
      </div>
    </motion.div>
  );
}
