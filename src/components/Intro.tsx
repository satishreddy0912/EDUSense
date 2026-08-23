import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/i18n';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const { t } = useI18n();
  const [phase, setPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 600));   // particles
    timers.push(setTimeout(() => setPhase(2), 1800));  // neural network
    timers.push(setTimeout(() => setPhase(3), 2800));  // logo
    timers.push(setTimeout(() => setPhase(4), 3800));  // tagline
    timers.push(setTimeout(() => setShowButton(true), 4600));
    return () => timers.forEach(clearTimeout);
  }, []);

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 1.5,
    size: Math.random() * 4 + 2,
  }));

  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { x: 50 + Math.cos(angle) * 25, y: 50 + Math.sin(angle) * 25, id: i };
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-10" />

      {/* Particles */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: 'radial-gradient(circle, hsl(var(--primary) / 0.9), hsl(var(--accent) / 0.3))',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.6] }}
                transition={{ delay: p.delay, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Neural network */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.svg
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.3] }}
            transition={{ duration: 2 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {nodes.map((node) =>
              nodes
                .filter((n) => n.id > node.id)
                .map((n) => (
                  <motion.line
                    key={`${node.id}-${n.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.15"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
                  />
                ))
            )}
            {nodes.map((node) => (
              <motion.circle
                key={node.id}
                cx={node.x}
                cy={node.y}
                r="1.2"
                fill="hsl(var(--accent))"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.8, delay: node.id * 0.1 }}
              />
            ))}
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-primary">
                    <svg viewBox="0 0 24 24" className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3L2 9l10 6 10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 15l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <h1 className="font-display text-5xl font-bold tracking-tight sm:text-7xl">
                  <span className="text-gradient">Edu</span>
                  <span className="text-foreground">Sense</span>
                </h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3"
            >
              <p className="text-lg font-medium text-accent sm:text-2xl">
                {t('intro.platform')}
              </p>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-lg">
                {t('intro.tagline')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={onComplete}
              className="mt-10 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 glow-primary sm:text-base"
            >
              {t('intro.enter')}
              <span className="ml-2">→</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
