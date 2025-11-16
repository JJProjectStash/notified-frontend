# 🔥 Quick Copy-Paste Code Snippets

Ready-to-use code snippets for common attendance management tasks.

---

## 🎯 **1. Add Attendance Route**

```typescript
// src/App.tsx
import AttendancePage from '@/pages/AttendancePage'

// Add inside your Routes:
<Route path="/attendance" element={
  <ProtectedRoute>
    <AttendancePage />
  </ProtectedRoute>
} />
```

---

## 🧭 **2. Add Navigation Link**

```typescript
// src/layouts/MainLayout.tsx or your navigation component
import { ClipboardList } from 'lucide-react'

const navigationItems = [
  // ... existing items
  {
    name: 'Attendance',
    path: '/attendance',
    icon: ClipboardList,
    badge: null,
  },
]
```

---

## 📊 **3. Add Summary to Dashboard**

```typescript
// src/pages/DashboardPage.tsx
import { AttendanceSummary } from '@/components/attendance/AttendanceSummary'

// Add to your dashboard layout:
<div className="mt-8">
  <AttendanceSummary 
    showStudentDetails={false} 
    dateFilter="today"
  />
</div>
```

---

## ✅ **4. Add Dropdown to Students Table**

```typescript
// src/pages/StudentsPage.tsx
import { AttendanceDropdown } from '@/components/attendance/AttendanceDropdown'

// Add column to table header:
<th>Actions</th>

// Add cell to table body:
<td>
  <AttendanceDropdown
    student={student}
    onSuccess={() => {
      refetch() // Refresh students list
    }}
    showNotifyOption={true}
  />
</td>
```

---

## 📧 **5. Send Custom Notification**

```typescript
import { generateAttendanceMessage } from '@/utils/messageTemplates'
import emailService from '@/services/email.service'

// Generate and send message
const sendNotification = async (student: Student, timeSlot: 'arrival' | 'departure') => {
  const studentName = `${student.firstName} ${student.lastName}`
  const message = generateAttendanceMessage(
    timeSlot,
    studentName,
    student.studentNumber
  )
  
  if (student.guardianEmail) {
    await emailService.sendEmail({
      to: student.guardianEmail,
      subject: `${timeSlot === 'arrival' ? 'Arrival' : 'Departure'} Notification`,
      message,
    })
  }
}
```

---

## 📥 **6. Excel Import Handler**

```typescript
import { parseAttendanceExcel, validateAttendanceData } from '@/utils/attendanceExcelUtils'
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    // Parse Excel
    const data = await parseAttendanceExcel(file)
    
    // Validate
    const validation = validateAttendanceData(data)
    if (!validation.isValid) {
      alert(`Validation errors: ${validation.errors.join(', ')}`)
      return
    }
    
    // Import
    const result = await enhancedAttendanceService.importFromExcel(file)
    alert(`Imported ${result.success} records, ${result.failed} failed`)
  } catch (error: any) {
    alert(`Import failed: ${error.message}`)
  }
}

// JSX:
<input
  type="file"
  accept=".xlsx,.xls"
  onChange={handleFileImport}
/>
```

---

## 📤 **7. Excel Export Handler**

```typescript
import { exportAttendanceToExcel } from '@/utils/attendanceExcelUtils'
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const handleExport = async () => {
  try {
    const records = await enhancedAttendanceService.getAttendanceRecords({
      // Optional filters:
      // status: 'present',
      // timeSlot: 'arrival',
      // dateRange: { startDate: '2025-11-01', endDate: '2025-11-30' }
    })
    
    exportAttendanceToExcel(records, 'attendance_november_2025.xlsx')
    alert('Export successful!')
  } catch (error) {
    alert('Export failed')
  }
}

// JSX:
<button onClick={handleExport}>
  Export to Excel
</button>
```

---

## 📝 **8. Download Template**

```typescript
import { generateAttendanceTemplate } from '@/utils/attendanceExcelUtils'

const handleDownloadTemplate = () => {
  generateAttendanceTemplate(true) // true = include instructions
  // File will download automatically
}

// JSX:
<button onClick={handleDownloadTemplate}>
  Download Import Template
</button>
```

---

## 📈 **9. Get Today's Statistics**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const loadTodayStats = async () => {
  const summary = await enhancedAttendanceService.getDailySummary()
  
  console.log('Total Students:', summary.totalStudents)
  console.log('Present:', summary.present)
  console.log('Absent:', summary.absent)
  console.log('Late:', summary.late)
  console.log('Attendance Rate:', summary.attendanceRate + '%')
  console.log('Arrivals Today:', summary.arrivalCount)
  console.log('Departures Today:', summary.departureCount)
}
```

---

## 🔍 **10. Check Student Attendance**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const checkStudentStatus = async (studentId: number) => {
  const hasCheckedIn = await enhancedAttendanceService.hasCheckedInToday(studentId)
  const hasCheckedOut = await enhancedAttendanceService.hasCheckedOutToday(studentId)
  
  if (!hasCheckedIn) {
    console.log('Student has not checked in yet')
  } else if (!hasCheckedOut) {
    console.log('Student is currently in school')
  } else {
    console.log('Student has checked out')
  }
}
```

---

## 📊 **11. Get Student Attendance Summary**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const loadStudentSummary = async (studentId: number) => {
  const summary = await enhancedAttendanceService.getStudentSummary(
    studentId,
    '2025-11-01', // Start date (optional)
    '2025-11-30'  // End date (optional)
  )
  
  console.log('Total Days:', summary.totalDays)
  console.log('Present Days:', summary.presentDays)
  console.log('Absent Days:', summary.absentDays)
  console.log('Late Days:', summary.lateDays)
  console.log('Attendance Rate:', summary.attendanceRate + '%')
}
```

---

## 📅 **12. Mark Attendance Programmatically**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const markAttendance = async (studentId: number) => {
  try {
    const record = await enhancedAttendanceService.markAttendance({
      studentId: studentId,
      status: 'present',
      timeSlot: 'arrival',
      timestamp: new Date().toISOString(),
      notes: 'Marked by system'
    })
    
    console.log('Attendance marked:', record)
    return record
  } catch (error) {
    console.error('Failed to mark attendance:', error)
  }
}
```

---

## 🎯 **13. Bulk Mark Attendance**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const markBulkAttendance = async (studentIds: number[]) => {
  try {
    const records = await enhancedAttendanceService.markBulkAttendance({
      studentIds: studentIds,
      status: 'present',
      timeSlot: 'arrival',
      timestamp: new Date().toISOString(),
      notes: 'Bulk marked'
    })
    
    console.log(`Marked ${records.length} students`)
    return records
  } catch (error) {
    console.error('Bulk marking failed:', error)
  }
}

// Usage:
markBulkAttendance([1, 2, 3, 4, 5])
```

---

## 🎨 **14. Custom Message Template**

```typescript
import { createCustomTemplate, fillTemplate } from '@/utils/messageTemplates'

// Create custom template
const customTemplate = createCustomTemplate(
  'arrival',
  'Welcome Message',
  'Welcome {{studentName}}! You checked in at {{time}}. Have a great day! 🎉'
)

// Use the template
const message = fillTemplate(customTemplate.message, {
  studentName: 'John Doe',
  studentNumber: '24-0001',
  time: '08:30 AM',
  date: 'November 16, 2025'
})

console.log(message)
// Output: "Welcome John Doe! You checked in at 08:30 AM. Have a great day! 🎉"
```

---

## 🔔 **15. Preview Message Template**

```typescript
import { previewTemplate, getTemplatesByType } from '@/utils/messageTemplates'

// Get all arrival templates
const arrivalTemplates = getTemplatesByType('arrival')

// Preview a template
arrivalTemplates.forEach(template => {
  console.log('Template:', template.title)
  console.log('Preview:', previewTemplate(template.id))
  console.log('---')
})
```

---

## 📊 **16. Filter Attendance Records**

```typescript
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const getFilteredRecords = async () => {
  // Get only late arrivals from last week
  const records = await enhancedAttendanceService.getAttendanceRecords({
    status: 'late',
    timeSlot: 'arrival',
    dateRange: {
      startDate: '2025-11-10',
      endDate: '2025-11-16'
    }
  })
  
  return records
}
```

---

## 🎯 **17. Simple Attendance Button**

```typescript
import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

const QuickAttendanceButton = ({ studentId }: { studentId: number }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    try {
      await enhancedAttendanceService.markAttendance({
        studentId,
        status: 'present',
        timeSlot: 'arrival',
        timestamp: new Date().toISOString()
      })
      alert('Attendance marked!')
    } catch (error) {
      alert('Failed to mark attendance')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CheckCircle className="w-4 h-4" />
      )}
      Mark Present
    </button>
  )
}
```

---

## 🚀 **18. Use in React Query**

```typescript
import { useQuery } from '@tanstack/react-query'
import { enhancedAttendanceService } from '@/services/enhanced-attendance.service'

// In your component:
const { data: summary, isLoading } = useQuery({
  queryKey: ['attendance-summary', 'today'],
  queryFn: () => enhancedAttendanceService.getDailySummary(),
  refetchInterval: 30000, // Refetch every 30 seconds
})

// Use the data:
if (isLoading) return <div>Loading...</div>
if (!summary) return <div>No data</div>

return (
  <div>
    <h2>Attendance Rate: {summary.attendanceRate}%</h2>
    <p>Present: {summary.present}</p>
    <p>Absent: {summary.absent}</p>
  </div>
)
```

---

## 💡 **Tips for Best Results**

1. **Always validate Excel data** before importing
2. **Use React Query** for automatic caching and refetching
3. **Handle errors gracefully** with try-catch blocks
4. **Show loading states** for better UX
5. **Refresh data** after marking attendance
6. **Test with sample data** before production use
7. **Add proper TypeScript types** for type safety
8. **Use toast notifications** for user feedback

---

## 🎉 **Ready to Use!**

All these snippets are production-ready and follow your project's coding patterns. Copy, paste, and customize as needed!
