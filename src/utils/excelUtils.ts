import * as XLSX from 'xlsx'
import { StudentFormData } from '@/types'

export interface ExcelStudent {
  'Student Number': string
  'First Name': string
  'Last Name': string
  Email: string
  Section?: string
  'Guardian Name'?: string
  'Guardian Email'?: string
}

/**
 * Parse Excel file and extract student data
 */
export const parseExcelFile = (file: File): Promise<StudentFormData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<ExcelStudent>(worksheet)

        // Transform Excel data to StudentFormData format
        const students: StudentFormData[] = jsonData.map((row) => ({
          studentNumber: String(row['Student Number'] || '').trim(),
          firstName: String(row['First Name'] || '').trim(),
          lastName: String(row['Last Name'] || '').trim(),
          email: String(row.Email || '').trim(),
          section: row.Section ? String(row.Section).trim() : '',
          guardianName: row['Guardian Name'] ? String(row['Guardian Name']).trim() : '',
          guardianEmail: row['Guardian Email'] ? String(row['Guardian Email']).trim() : '',
        }))

        // Filter out empty rows
        const validStudents = students.filter(
          (student) =>
            student.studentNumber && student.firstName && student.lastName && student.email
        )

        resolve(validStudents)
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please check the format.'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * Generate Excel template for students
 */
export const generateStudentTemplate = () => {
  const templateData = [
    {
      'Student Number': '24-0001',
      'First Name': 'John',
      'Last Name': 'Doe',
      Email: 'john.doe@example.com',
      Section: '1-A',
      'Guardian Name': 'Jane Doe',
      'Guardian Email': 'jane.doe@example.com',
    },
    {
      'Student Number': '24-0002',
      'First Name': 'Alice',
      'Last Name': 'Smith',
      Email: 'alice.smith@example.com',
      Section: '1-B',
      'Guardian Name': 'Bob Smith',
      'Guardian Email': 'bob.smith@example.com',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 }, // Student Number
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 25 }, // Email
    { wch: 10 }, // Section
    { wch: 20 }, // Guardian Name
    { wch: 25 }, // Guardian Email
  ]

  // Download the file
  XLSX.writeFile(workbook, 'student_import_template.xlsx')
}

/**
 * Export students to Excel
 */
export const exportStudentsToExcel = (
  students: any[],
  filename: string = 'students_export.xlsx'
) => {
  const exportData = students.map((student) => ({
    'Student Number': student.studentNumber,
    'First Name': student.firstName,
    'Last Name': student.lastName,
    Email: student.email,
    Section: student.section || '',
    'Guardian Name': student.guardianName || '',
    'Guardian Email': student.guardianEmail || '',
    'Created At': new Date(student.createdAt).toLocaleDateString(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 25 },
    { wch: 10 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
  ]

  XLSX.writeFile(workbook, filename)
}
