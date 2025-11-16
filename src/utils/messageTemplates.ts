/**
 * Message Templates Utility
 *
 * Provides predefined message templates for arrival/departure notifications
 * with dynamic variable substitution.
 *
 * Features:
 * - Predefined templates for common scenarios
 * - Dynamic variable replacement
 * - Custom template support
 * - Email and SMS formatting
 *
 * Integration: Use with notification.service.ts and email.service.ts
 */

import { MessageTemplate, MessageVariables } from '@/types'
import { format } from 'date-fns'

/**
 * Predefined arrival message templates
 */
export const ARRIVAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'arrival-default',
    type: 'arrival',
    title: 'Student Arrival Notification',
    message:
      'Good day! This is to inform you that {{studentName}} ({{studentNumber}}) has arrived at school on {{date}} at {{time}}.',
    variables: ['studentName', 'studentNumber', 'date', 'time'],
  },
  {
    id: 'arrival-formal',
    type: 'arrival',
    title: 'Arrival Confirmation',
    message:
      'Dear Guardian,\n\nWe wish to inform you that your child, {{studentName}} (Student No: {{studentNumber}}), has safely arrived at our institution on {{date}} at {{time}}.\n\nThank you for your continued trust.',
    variables: ['studentName', 'studentNumber', 'date', 'time'],
  },
  {
    id: 'arrival-casual',
    type: 'arrival',
    title: 'Check-in Alert',
    message:
      'Hi! {{studentName}} just checked in at {{time}} today ({{date}}). Have a great day! 😊',
    variables: ['studentName', 'time', 'date'],
  },
  {
    id: 'arrival-with-subject',
    type: 'arrival',
    title: 'Class Arrival Notification',
    message:
      'Hello! {{studentName}} ({{studentNumber}}) has arrived for {{subject}} class on {{date}} at {{time}}.',
    variables: ['studentName', 'studentNumber', 'subject', 'date', 'time'],
  },
  {
    id: 'arrival-late',
    type: 'arrival',
    title: 'Late Arrival Notice',
    message:
      'Please be informed that {{studentName}} ({{studentNumber}}) arrived late to school on {{date}} at {{time}}. Status: {{status}}',
    variables: ['studentName', 'studentNumber', 'date', 'time', 'status'],
  },
]

/**
 * Predefined departure message templates
 */
export const DEPARTURE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'departure-default',
    type: 'departure',
    title: 'Student Departure Notification',
    message:
      'Good day! This is to inform you that {{studentName}} ({{studentNumber}}) has left school on {{date}} at {{time}}.',
    variables: ['studentName', 'studentNumber', 'date', 'time'],
  },
  {
    id: 'departure-formal',
    type: 'departure',
    title: 'Dismissal Confirmation',
    message:
      'Dear Guardian,\n\nWe wish to inform you that your child, {{studentName}} (Student No: {{studentNumber}}), has been dismissed from our institution on {{date}} at {{time}}.\n\nThank you.',
    variables: ['studentName', 'studentNumber', 'date', 'time'],
  },
  {
    id: 'departure-casual',
    type: 'departure',
    title: 'Check-out Alert',
    message:
      'Hi! {{studentName}} just checked out at {{time}} today ({{date}}). See you tomorrow! 👋',
    variables: ['studentName', 'time', 'date'],
  },
  {
    id: 'departure-with-subject',
    type: 'departure',
    title: 'Class Dismissal Notification',
    message:
      'Hello! {{studentName}} ({{studentNumber}}) has completed {{subject}} class and departed on {{date}} at {{time}}.',
    variables: ['studentName', 'studentNumber', 'subject', 'date', 'time'],
  },
  {
    id: 'departure-early',
    type: 'departure',
    title: 'Early Dismissal Notice',
    message:
      'Please be informed that {{studentName}} ({{studentNumber}}) left school early on {{date}} at {{time}}. Status: {{status}}',
    variables: ['studentName', 'studentNumber', 'date', 'time', 'status'],
  },
]

/**
 * Get all message templates
 */
export const getAllTemplates = (): MessageTemplate[] => {
  return [...ARRIVAL_TEMPLATES, ...DEPARTURE_TEMPLATES]
}

/**
 * Get templates by type
 * @param type - 'arrival' or 'departure'
 */
export const getTemplatesByType = (type: 'arrival' | 'departure'): MessageTemplate[] => {
  return type === 'arrival' ? ARRIVAL_TEMPLATES : DEPARTURE_TEMPLATES
}

/**
 * Get a specific template by ID
 * @param templateId - Template identifier
 */
export const getTemplateById = (templateId: string): MessageTemplate | undefined => {
  return getAllTemplates().find((t) => t.id === templateId)
}

/**
 * Replace template variables with actual values
 *
 * Replaces {{variableName}} placeholders with provided values
 *
 * @param template - Message template string
 * @param variables - Object with variable values
 * @returns Message with variables replaced
 */
export const fillTemplate = (template: string, variables: Partial<MessageVariables>): string => {
  let message = template

  // Replace each variable
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    message = message.replace(regex, value || '')
  })

  // Remove any unfilled variables
  message = message.replace(/\{\{[^}]+\}\}/g, '')

  return message.trim()
}

/**
 * Generate arrival message from template
 *
 * @param templateId - Template ID to use (defaults to 'arrival-default')
 * @param studentName - Student's full name
 * @param studentNumber - Student number
 * @param options - Additional options (date, time, subject, etc.)
 * @returns Formatted message
 */
export const generateArrivalMessage = (
  templateId: string = 'arrival-default',
  studentName: string,
  studentNumber: string,
  options?: {
    date?: string
    time?: string
    subject?: string
    status?: string
  }
): string => {
  const template = getTemplateById(templateId) || ARRIVAL_TEMPLATES[0]

  const now = new Date()
  const variables: MessageVariables = {
    studentName,
    studentNumber,
    date: options?.date || format(now, 'MMMM dd, yyyy'),
    time: options?.time || format(now, 'hh:mm a'),
    subject: options?.subject,
    status: options?.status,
  }

  return fillTemplate(template.message, variables)
}

/**
 * Generate departure message from template
 *
 * @param templateId - Template ID to use (defaults to 'departure-default')
 * @param studentName - Student's full name
 * @param studentNumber - Student number
 * @param options - Additional options (date, time, subject, etc.)
 * @returns Formatted message
 */
export const generateDepartureMessage = (
  templateId: string = 'departure-default',
  studentName: string,
  studentNumber: string,
  options?: {
    date?: string
    time?: string
    subject?: string
    status?: string
  }
): string => {
  const template = getTemplateById(templateId) || DEPARTURE_TEMPLATES[0]

  const now = new Date()
  const variables: MessageVariables = {
    studentName,
    studentNumber,
    date: options?.date || format(now, 'MMMM dd, yyyy'),
    time: options?.time || format(now, 'hh:mm a'),
    subject: options?.subject,
    status: options?.status,
  }

  return fillTemplate(template.message, variables)
}

/**
 * Generate message based on time slot
 *
 * Convenience function that automatically selects arrival or departure template
 *
 * @param timeSlot - 'arrival' or 'departure'
 * @param studentName - Student's full name
 * @param studentNumber - Student number
 * @param options - Additional options
 * @returns Formatted message
 */
export const generateAttendanceMessage = (
  timeSlot: 'arrival' | 'departure',
  studentName: string,
  studentNumber: string,
  options?: {
    templateId?: string
    date?: string
    time?: string
    subject?: string
    status?: string
  }
): string => {
  if (timeSlot === 'arrival') {
    return generateArrivalMessage(
      options?.templateId || 'arrival-default',
      studentName,
      studentNumber,
      options
    )
  } else {
    return generateDepartureMessage(
      options?.templateId || 'departure-default',
      studentName,
      studentNumber,
      options
    )
  }
}

/**
 * Create custom message template
 *
 * @param type - 'arrival' or 'departure'
 * @param title - Template title
 * @param message - Message template with {{variable}} placeholders
 * @returns New message template
 */
export const createCustomTemplate = (
  type: 'arrival' | 'departure',
  title: string,
  message: string
): MessageTemplate => {
  // Extract variables from message
  const variableMatches = message.match(/\{\{([^}]+)\}\}/g) || []
  const variables = variableMatches.map((v) => v.replace(/\{\{|\}\}/g, ''))

  return {
    id: `custom-${type}-${Date.now()}`,
    type,
    title,
    message,
    variables,
  }
}

/**
 * Preview message with sample data
 *
 * Useful for showing users what the message will look like
 *
 * @param templateId - Template ID
 * @returns Filled template with sample data
 */
export const previewTemplate = (templateId: string): string => {
  const template = getTemplateById(templateId)
  if (!template) return ''

  const sampleVariables: MessageVariables = {
    studentName: 'John Doe',
    studentNumber: '24-0001',
    date: format(new Date(), 'MMMM dd, yyyy'),
    time: format(new Date(), 'hh:mm a'),
    subject: 'Computer Science 101',
    status: 'Present',
  }

  return fillTemplate(template.message, sampleVariables)
}
