import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, Users, BookOpen, ClipboardList } from 'lucide-react'
import { ROUTES, APP_NAME } from '@/utils/constants'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </Button>
            <Button onClick={() => navigate(ROUTES.SIGNUP)}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Student Management <span className="text-primary">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Track attendance, manage records, and communicate with students and guardians all in one
            modern platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate(ROUTES.SIGNUP)}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(ROUTES.LOGIN)}>
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary" />}
            title="Student Management"
            description="Easily add, edit, and manage student information with a clean, intuitive interface."
          />
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-primary" />}
            title="Subject Tracking"
            description="Organize subjects, sections, and year levels with comprehensive tracking tools."
          />
          <FeatureCard
            icon={<ClipboardList className="w-12 h-12 text-primary" />}
            title="Records & Reports"
            description="Keep detailed attendance and activity logs with powerful filtering options."
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 {APP_NAME}. Built with React, TypeScript, and TailwindCSS.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white rounded-xl shadow-neumorphic hover:shadow-neumorphic-lg transition-all"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}
