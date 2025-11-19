import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AttendanceRecord, AttendanceFormData, AttendanceStatus, TimeSlot } from '@/types'
import { attendanceService } from '@/services/attendance.service'

interface EditAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  record?: AttendanceRecord | null
  onUpdated?: (rec: AttendanceRecord) => void
}

export default function EditAttendanceModal({
  isOpen,
  onClose,
  record,
  onUpdated,
}: EditAttendanceModalProps) {
  const [status, setStatus] = useState<AttendanceStatus>(record?.status ?? 'present')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(record?.timeSlot ?? 'arrival')
  const [notes, setNotes] = useState(record?.notes || '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (record) {
      setStatus(record.status)
      setTimeSlot(record.timeSlot)
      setNotes(record.notes || '')
    }
  }, [record])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (!record) return
      const updated = await attendanceService.update(record.id, {
        status,
        timeSlot,
        notes,
      })
      onUpdated?.(updated)
      onClose()
    } catch (err) {
      console.error('Failed to update attendance record', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-enterprise-2xl border border-slate-700/50 w-full max-w-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div>
                  <h3 className="text-lg font-semibold text-white">Edit Attendance</h3>
                  <p className="text-xs text-slate-400">
                    ID: {String(record?.id ?? '').slice(0, 8)}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 rounded hover:bg-white/10">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <label className="block text-xs text-slate-400">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                  className="w-full rounded-xl h-10 bg-slate-900/50 border border-slate-600 px-3 text-white"
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>

                <label className="block text-xs text-slate-400">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="w-full rounded-xl h-10 bg-slate-900/50 border border-slate-600 px-3 text-white"
                >
                  <option value="arrival">Arrival</option>
                  <option value="departure">Departure</option>
                </select>

                <label className="block text-xs text-slate-400">Notes</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes"
                  className="bg-slate-900/50"
                />

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
