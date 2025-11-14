import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import api from '@/services/api'
import { useToast } from '@/store/toastStore'
import MainLayout from '@/layouts/MainLayout'

interface EmailRecord {
  _id: string
  description: string
  performedBy: {
    name: string
    email: string
  }
  student?: {
    studentNumber: string
    firstName: string
    lastName: string
  }
  createdAt: string
  metadata?: {
    recipient?: string
    subject?: string
    messageId?: string
    sentCount?: number
    totalRecipients?: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function EmailHistoryPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'single' | 'bulk'>('all')
  const { addToast } = useToast()

  const fetchEmailHistory = async (page = 1) => {
    setIsLoading(true)
    try {
      console.log('[EmailHistory] Fetching email history, page:', page)

      const response = await api.get('/emails/history', {
        params: {
          page,
          limit: 20,
          search: searchTerm || undefined,
        },
      })

      // Response structure: { success, data: records[], pagination: {...} }
      const emailData = response.data?.data || []
      const paginationData = response.data?.pagination

      console.log('[EmailHistory] Loaded emails:', emailData.length, 'pagination:', paginationData)
      setEmails(emailData)
      setPagination(
        paginationData || {
          page,
          limit: 20,
          total: emailData.length,
          totalPages: 1,
        }
      )
    } catch (error: any) {
      console.error('[EmailHistory] Failed to fetch email history:', error)

      if (error.response?.status === 404) {
        addToast('Email history endpoint not available', 'error')
      } else {
        addToast(error.response?.data?.message || 'Failed to load email history', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmailHistory(1)
  }, [searchTerm])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchEmailHistory(newPage)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredEmails = emails.filter((email) => {
    if (filterType === 'single') {
      return !email.metadata?.totalRecipients || email.metadata.totalRecipients === 1
    } else if (filterType === 'bulk') {
      return email.metadata?.totalRecipients && email.metadata.totalRecipients > 1
    }
    return true
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Email History"
          description="View all sent emails and notifications"
          icon={Mail}
          gradient="from-orange-600 via-amber-600 to-yellow-600"
          stats={[
            {
              label: 'Total Emails',
              value: pagination.total,
              icon: Mail,
              color: 'orange',
            },
            {
              label: 'Displayed',
              value: filteredEmails.length,
              icon: Filter,
              color: 'blue',
            },
          ]}
        />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by recipient, subject, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-gray-300"
              />
            </div>

            {/* Filter Type */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="pl-10 pr-4 py-3 h-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Emails</option>
                <option value="single">Single Recipients</option>
                <option value="bulk">Bulk Emails</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Email List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading email history...</p>
              </div>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Mail className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg font-medium">No emails found</p>
              <p className="text-gray-500 text-sm mt-1">
                {searchTerm ? 'Try adjusting your search' : 'No emails have been sent yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Recipient(s)
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sent By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmails.map((email, index) => (
                    <motion.tr
                      key={email._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {formatDate(email.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {email.metadata?.recipient || email.student
                            ? `${email.student?.firstName} ${email.student?.lastName}`
                            : 'Multiple Recipients'}
                        </div>
                        {email.metadata?.totalRecipients && email.metadata.totalRecipients > 1 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {email.metadata.sentCount || email.metadata.totalRecipients} of{' '}
                            {email.metadata.totalRecipients} recipients
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {email.metadata?.subject || 'No subject'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-900">{email.performedBy.name}</div>
                            <div className="text-xs text-gray-500">{email.performedBy.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            email.metadata?.totalRecipients && email.metadata.totalRecipients > 1
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {email.metadata?.totalRecipients && email.metadata.totalRecipients > 1
                            ? 'Bulk'
                            : 'Single'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!isLoading && filteredEmails.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-gray-600">
              Showing {filteredEmails.length} of {pagination.total} emails
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="h-10 px-4 rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="h-10 px-4 rounded-xl"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  )
}
