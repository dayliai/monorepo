import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/* ------------------------------------------------------------------ */
/*  Sparkle component                                                  */
/* ------------------------------------------------------------------ */

function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-dayli-cyan"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.2, 0],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Floating butterfly                                                 */
/* ------------------------------------------------------------------ */

function FloatingButterfly() {
  return (
    <motion.div
      className="absolute -top-6 right-4 text-4xl select-none pointer-events-none"
      animate={{
        y: [0, -14, 0],
        rotate: [0, 8, -4, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    >
      {/* SVG butterfly matching the Dayli brand */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 24C18 14 6 12 8 22C10 30 20 28 24 24Z"
          fill="#DBB0FF"
          stroke="#9230E3"
          strokeWidth="1.2"
        />
        <path
          d="M24 24C30 14 42 12 40 22C38 30 28 28 24 24Z"
          fill="#F1E1FF"
          stroke="#9230E3"
          strokeWidth="1.2"
        />
        <path
          d="M24 24C20 30 12 36 14 28C16 22 22 26 24 24Z"
          fill="#DBB0FF"
          stroke="#9230E3"
          strokeWidth="1.2"
        />
        <path
          d="M24 24C28 30 36 36 34 28C32 22 26 26 24 24Z"
          fill="#F1E1FF"
          stroke="#9230E3"
          strokeWidth="1.2"
        />
        <circle cx="24" cy="24" r="2" fill="#461F65" />
      </svg>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function RequestSuccessScreen() {
  return (
    <div className="min-h-screen bg-dayli-bg flex items-center justify-center px-4">
      <div className="relative max-w-md w-full text-center py-12">
        {/* Sparkle effects */}
        <Sparkle delay={0} x={10} y={15} />
        <Sparkle delay={0.4} x={85} y={10} />
        <Sparkle delay={0.8} x={20} y={70} />
        <Sparkle delay={1.2} x={75} y={65} />
        <Sparkle delay={1.6} x={50} y={5} />
        <Sparkle delay={0.6} x={90} y={45} />

        {/* Floating butterfly */}
        <FloatingButterfly />

        {/* Animated checkmark */}
        <motion.div
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 200,
            delay: 0.2,
          }}
        >
          <motion.svg
            className="w-12 h-12 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </motion.svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="font-heading text-2xl sm:text-3xl font-bold text-dayli-deep mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Your Solution Request Has Been Submitted!
        </motion.h1>

        {/* Description */}
        <motion.p
          className="font-body text-dayli-deep/70 text-base mb-10 leading-relaxed max-w-sm mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Our team is reviewing your request. We will match you with
          personalized solutions and notify you when they are ready.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Link
            to="/chat"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-dayli-vibrant text-white font-body font-semibold text-sm hover:opacity-90 transition-opacity text-center"
          >
            Chat with Dayli AI
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-dayli-pale text-dayli-deep font-body font-semibold text-sm hover:bg-dayli-pale/50 transition-colors text-center"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
