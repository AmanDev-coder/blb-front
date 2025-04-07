// Removed imports because they're not used in the file
// import { Notification, Ticket } from '../../../../utils/notifications';

/**
 * Sample notification data
 * Each notification has:
 * - id: number
 * - type: string 
 * - message: string
 * - severity: 'critical' | 'warning' | 'info' | 'success'
 * - date: string (ISO date)
 * - read: boolean
 */
export const sampleNotifications = [
  {
    id: 1,
    type: "System Alert",
    message: "Server maintenance scheduled for 12 AM tonight.",
    severity: "critical",
    date: "2024-03-15T08:30:00Z",
    read: false,
  },
  {
    id: 2,
    type: "User Message",
    message: "New booking request from John Doe.",
    severity: "info",
    date: "2024-03-15T10:45:00Z",
    read: true,
  },
  {
    id: 3,
    type: "Transaction Alert",
    message: "Payment of $1,500 received from Jane Smith.",
    severity: "success",
    date: "2024-03-14T15:20:00Z",
    read: false,
  },
  {
    id: 4,
    type: "Security Warning",
    message: "Multiple failed login attempts detected.",
    severity: "warning",
    date: "2024-03-13T22:10:00Z",
    read: false,
  },
];

/**
 * Sample ticket data
 * Each ticket contains:
 * - Standard ticket fields (id, title, description, status, priority, category)
 * - User information (createdBy, assignedTo)
 * - Timestamps (createdAt, updatedAt)
 * - Comment history
 */
export const sampleTickets = [
  {
    id: 1,
    title: "Yacht AC not working properly",
    description: "The air conditioning system in yacht 'Sea Breeze' is not maintaining the set temperature.",
    status: "open",
    priority: "high",
    category: "maintenance",
    createdBy: {
      id: 101,
      name: "John Smith",
      email: "john@example.com",
      role: "owner"
    },
    createdAt: "2024-03-14T10:30:00Z",
    updatedAt: "2024-03-14T10:30:00Z",
    comments: [
      {
        id: 1,
        text: "Technician has been notified and will check tomorrow morning.",
        createdBy: {
          id: 201,
          name: "Support Team"
        },
        createdAt: "2024-03-14T11:00:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Booking system error",
    description: "Unable to complete booking process, getting error code E123.",
    status: "in_progress",
    priority: "urgent",
    category: "technical",
    createdBy: {
      id: 102,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "user"
    },
    assignedTo: {
      id: 201,
      name: "Tech Support"
    },
    createdAt: "2024-03-15T09:15:00Z",
    updatedAt: "2024-03-15T10:20:00Z",
    comments: [
      {
        id: 1,
        text: "Issue identified, working on fix.",
        createdBy: {
          id: 201,
          name: "Tech Support"
        },
        createdAt: "2024-03-15T10:20:00Z"
      }
    ]
  }
];