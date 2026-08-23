import { motion } from 'framer-motion';
import { School, Cpu, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/card';

export type Mode = 'rural' | 'urban';

export default function Landing({ onSelect }: { onSelect: (mode: Mode) => void }) {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.07]" />
      <div className="absolute -top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {t('landing.demo.label')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-center font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          <span className="text-gradient">Two Classrooms.</span>{' '}
          <span className="text-foreground">One Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 max-w-md text-center text-base text-muted-foreground sm:text-lg"
        >
          {t('landing.subtitle')}
        </motion.p>

        <div className="grid w-full gap-6 md:grid-cols-2">
          {/* Rural Card */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -6 }}
            onClick={() => onSelect('rural')}
            className="group text-left"
          >
            <Card className="glass relative h-full overflow-hidden p-8 transition-all hover:border-primary/40 hover:glow-primary">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:bg-primary/20" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <School className="h-7 w-7" />
                </div>
                <h2 className="mb-3 font-display text-2xl font-semibold text-foreground">
                  {t('landing.rural.title')}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {t('landing.rural.desc')}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {['No smartboards', 'No student phones', 'Assessment-driven'].map((tag) => (
                    <span key={tag} className="rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                  {t('landing.enterRural')}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </motion.button>

          {/* Urban Card */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -6 }}
            onClick={() => onSelect('urban')}
            className="group text-left"
          >
            <Card className="glass relative h-full overflow-hidden p-8 transition-all hover:border-accent/40 hover:glow-accent">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:bg-accent/20" />
              <div className="relative">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                  <Cpu className="h-7 w-7" />
                </div>
                <h2 className="mb-3 font-display text-2xl font-semibold text-foreground">
                  {t('landing.urban.title')}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {t('landing.urban.desc')}
                </p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {['Digital tools', 'Advanced analytics', 'Privacy-safe'].map((tag) => (
                    <span key={tag} className="rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:translate-x-1">
                  {t('landing.enterUrban')}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Card>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <ShieldCheck className="h-4 w-4 text-success" />
          No facial recognition · No individual emotion detection · No student surveillance
        </motion.div>
      </div>
    </div>
  );
}
