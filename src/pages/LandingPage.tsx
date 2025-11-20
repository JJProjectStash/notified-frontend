import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Shield,
} from 'lucide-react'
import { ROUTES, APP_NAME } from '@/utils/constants'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* Floating orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
      />

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-50"
              />
              <div className="relative p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
              <p className="text-xs text-slate-400">For Educators</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-white transition-all h-11 px-6 backdrop-blur-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate(ROUTES.SIGNUP)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 px-6 shadow-lg hover:shadow-xl transition-all border-0"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto relative z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4" />
            Professional Academic Management Platform
          </motion.div>

          {/* Main Heading with animated gradient */}
          <h2 className="text-7xl font-bold text-white mb-6 leading-tight">
            Empower Your{' '}
            <span className="relative inline-block">
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-[length:200%_auto]"
              >
                Teaching
              </motion.span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="12"
                viewBox="0 0 300 12"
                fill="none"
              >
                <motion.path
                  d="M0 6 Q75 0, 150 6 T300 6"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive platform designed exclusively for professors and educators to streamline
            student management, track attendance, and maintain academic records with precision and
            ease.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 px-10 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all border-0 group"
              >
                Start Managing
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 inline-block"
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="h-14 px-10 text-lg border-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-white hover:border-slate-600 transition-all backdrop-blur-sm"
              >
                Access Portal
              </Button>
            </motion.div>
          </div>

          {/* Decorative SVG illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            <svg viewBox="0 0 800 400" className="w-full h-auto opacity-80">
              {/* Dashboard mockup */}
              <defs>
                <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main dashboard card */}
              <motion.rect
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                x="50"
                y="50"
                width="700"
                height="300"
                rx="20"
                fill="url(#cardGradient)"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Header bar */}
              <motion.rect
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                x="70"
                y="70"
                width="660"
                height="40"
                rx="8"
                fill="#1e293b"
                style={{ transformOrigin: 'left' }}
              />

              {/* Stats cards */}
              {[0, 1, 2].map((i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <rect
                    x={90 + i * 220}
                    y="140"
                    width="180"
                    height="100"
                    rx="12"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                  />
                  <motion.rect
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    x={110 + i * 220}
                    y="160"
                    width="60"
                    height="8"
                    rx="4"
                    fill={i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#10b981'}
                  />
                  <rect x={110 + i * 220} y="180" width="140" height="4" rx="2" fill="#334155" />
                  <rect x={110 + i * 220} y="195" width="100" height="4" rx="2" fill="#334155" />
                </motion.g>
              ))}

              {/* Chart area */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <rect x="90" y="270" width="640" height="60" rx="8" fill="#0f172a" />
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <motion.rect
                    key={i}
                    animate={{
                      height: [
                        20 + Math.random() * 30,
                        30 + Math.random() * 20,
                        20 + Math.random() * 30,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                    x={110 + i * 65}
                    y={300 - (20 + Math.random() * 30)}
                    width="40"
                    height={20 + Math.random() * 30}
                    rx="4"
                    fill={`url(#barGradient${i})`}
                    opacity="0.8"
                  />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <defs key={`def-${i}`}>
                    <linearGradient id={`barGradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                  </defs>
                ))}
              </motion.g>

              {/* Floating particles */}
              {[...Array(12)].map((_, i) => (
                <motion.circle
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  cx={100 + Math.random() * 600}
                  cy={100 + Math.random() * 250}
                  r={2 + Math.random() * 3}
                  fill="#60a5fa"
                  filter="url(#glow)"
                />
              ))}
            </svg>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-32 relative z-10"
        >
          <FeatureCard
            icon={<Users className="w-12 h-12 text-blue-400" />}
            title="Student Records"
            description="Comprehensive student profiles with academic history, contact information, and performance tracking at your fingertips."
            gradient="from-blue-600 to-indigo-600"
            delay={0.1}
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-purple-400" />}
            title="Analytics Dashboard"
            description="Real-time insights into attendance patterns, class performance, and student engagement with detailed visualizations."
            gradient="from-purple-600 to-violet-600"
            delay={0.2}
          />
          <FeatureCard
            icon={<ClipboardList className="w-12 h-12 text-emerald-400" />}
            title="Attendance Tracking"
            description="Efficient attendance management with automated reports, notifications, and historical data for informed decision-making."
            gradient="from-emerald-600 to-teal-600"
            delay={0.3}
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-32"
        >
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-4 text-center">
                Trusted by Academic Professionals
              </h3>
              <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
                Join hundreds of educators who have streamlined their administrative workflow
              </p>
              <div className="grid md:grid-cols-4 gap-8">
                <StatCard
                  value="99.9%"
                  label="Uptime"
                  color="from-blue-400 to-indigo-400"
                  delay={0.1}
                />
                <StatCard
                  value="24/7"
                  label="Support"
                  color="from-purple-400 to-violet-400"
                  delay={0.2}
                />
                <StatCard
                  value="10k+"
                  label="Students"
                  color="from-emerald-400 to-teal-400"
                  delay={0.3}
                />
                <StatCard
                  value="500+"
                  label="Educators"
                  color="from-orange-400 to-amber-400"
                  delay={0.4}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-32 text-center"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl"
            />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-16 border border-slate-700">
              <h3 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Classroom Management?
              </h3>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join our community of educators and experience seamless academic administration
              </p>
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-16 px-12 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all border-0"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-32 border-t border-slate-800/50 relative z-10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </div>
          <p className="text-slate-400 font-medium mb-2">
            © 2025 {APP_NAME}. Professional Academic Management Platform.
          </p>
          <p className="text-sm text-slate-500">
            Built with React, TypeScript, and TailwindCSS by Team Arpanet
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: ReactNode
  title: string
  description: string
  gradient: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -8 }}
      className="relative group"
    >
      {/* Animated gradient glow */}
      <motion.div
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl blur-xl`}
      />

      {/* Card content */}
      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600 shadow-xl hover:shadow-2xl transition-all duration-300">
        <motion.div
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-xl shadow-lg mb-6`}
        >
          {icon}
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>

        {/* Decorative corner accent */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  )
}

function StatCard({
  value,
  label,
  color,
  delay,
}: {
  value: string
  label: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="text-center group"
    >
      <motion.p
        whileHover={{ scale: 1.1 }}
        className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${color} mb-2`}
      >
        {value}
      </motion.p>
      <p className="text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
        {label}
      </p>
    </motion.div>
  )
}
