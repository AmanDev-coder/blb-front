/**
 * @typedef {Object} Notification
 * @property {number} id - Unique identifier for the notification
 * @property {string} type - Type of notification
 * @property {string} message - Notification message content
 * @property {('critical'|'warning'|'info'|'success')} severity - Severity level of the notification
 * @property {string} date - Date when notification was created
 * @property {boolean} read - Whether notification has been read
 */

/**
 * @typedef {Object} TicketCreator
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {('user'|'owner')} role - User role
 */

/**
 * @typedef {Object} TicketAssignee
 * @property {number} id - User ID
 * @property {string} name - User name
 */

/**
 * @typedef {Object} TicketComment
 * @property {number} id - Comment ID
 * @property {string} text - Comment text
 * @property {Object} createdBy - User who created the comment
 * @property {number} createdBy.id - User ID
 * @property {string} createdBy.name - User name
 * @property {string} createdAt - Comment creation date
 */

/**
 * @typedef {Object} Ticket
 * @property {number} id - Ticket ID
 * @property {string} title - Ticket title
 * @property {string} description - Ticket description
 * @property {('open'|'in_progress'|'resolved'|'closed')} status - Current ticket status
 * @property {('low'|'medium'|'high'|'urgent')} priority - Ticket priority level
 * @property {string} category - Ticket category
 * @property {TicketCreator} createdBy - User who created the ticket
 * @property {TicketAssignee} [assignedTo] - User assigned to the ticket (optional)
 * @property {string} createdAt - Ticket creation date
 * @property {string} updatedAt - Ticket last update date
 * @property {TicketComment[]} comments - Ticket comments
 */

// Export empty objects to maintain compatibility with existing imports
export const Notification = {};
export const Ticket = {};