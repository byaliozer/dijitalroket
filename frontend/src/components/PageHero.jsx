import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-[#07111F] text-white" data-testid="page-hero">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-[#2563EB]/25 blur-[120px]" />
        <div className="absolute -top-20 right-1/4 h-[360px] w-[360px] rounded-full bg-[#22D3EE]/15 blur-[120px]" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-[#07111F]" />
      </div>
      <div className="container-x relative pt-24 pb-20 sm:pt-32 sm:pb-24 text-center">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow-light justify-center"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-4 h1-display text-white max-w-4xl mx-auto"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">{children}</div>}
      </div>
    </section>
  );
}
