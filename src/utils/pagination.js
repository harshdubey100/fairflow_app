/**
 * Pagination Utilities
 * 
 * This module provides helper functions for implementing pagination in API responses.
 * Pagination prevents returning excessive data and improves API performance.
 * 
 * Pagination Strategy:
 * - Default page: 1 (first page)
 * - Default limit: 20 items per page
 * - Maximum limit: 100 items per page (prevents abuse)
 * - Uses skip/take pattern (Prisma native pagination)
 * 
 * Usage Example:
 * const { skip, take } = getPaginationParams(req.query);
 * const [data, total] = await Promise.all([
 *   prisma.ticket.findMany({ skip, take, where }),
 *   prisma.ticket.count({ where })
 * ]);
 * return buildPaginatedResponse(data, total, page, limit);
 * 
 * Response Format:
 * {
 *   data: [...],
 *   pagination: {
 *     total: 50,          // Total records in database
 *     page: 1,            // Current page number
 *     limit: 20,          // Records per page
 *     totalPages: 3       // Total pages needed
 *   }
 * }
 */

/**
 * getPaginationParams - Extracts and validates pagination query parameters.
 * 
 * Validation Rules:
 * - Page must be >= 1 (uses Math.max)
 * - Limit must be 1-100 (capped to prevent abuse)
 * - Defaults: page=1, limit=20
 * - Skip calculation: (page - 1) * limit
 * 
 * @param {object} query - Express req.query object
 * @param {string|number} query.page - Requested page number
 * @param {string|number} query.limit - Items per page
 * @returns {object} Pagination parameters for Prisma
 * @returns {number} skip - Records to skip for Prisma findMany
 * @returns {number} take - Records to retrieve for Prisma findMany
 * @returns {number} page - Current page number
 * @returns {number} limit - Items per page
 * 
 * @example
 * // User requests: GET /api/tickets?page=2&limit=25
 * const { skip, take, page, limit } = getPaginationParams(req.query);
 * // Returns: { skip: 25, take: 25, page: 2, limit: 25 }
 * 
 * @example
 * // Default pagination: GET /api/tickets (no params)
 * const { skip, take, page, limit } = getPaginationParams({});
 * // Returns: { skip: 0, take: 20, page: 1, limit: 20 }
 */
const getPaginationParams = (query) => {
  // Ensure page >= 1, default to 1
  const page = Math.max(1, parseInt(query.page) || 1);
  
  // Enforce 1 <= limit <= 100, default to 20
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  
  // Calculate how many records to skip for this page
  // Page 1: skip 0, Page 2: skip 20, Page 3: skip 40 (if limit=20)
  const skip = (page - 1) * limit;
  
  return { skip, take: limit, page, limit };
};

/**
 * buildPaginatedResponse - Wraps data with pagination metadata.
 * 
 * Creates a standardized paginated response structure that includes:
 * - The actual data array
 * - Pagination metadata for client-side navigation
 * 
 * @param {array} data - The array of records to return
 * @param {number} total - Total count of records matching the query
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {object} Standardized paginated response
 * @returns {array} data - The records for this page
 * @returns {object} pagination - Pagination metadata
 * @returns {number} pagination.total - Total records in database
 * @returns {number} pagination.page - Current page number
 * @returns {number} pagination.limit - Records per page
 * @returns {number} pagination.totalPages - Total pages needed to display all records
 * 
 * @example
 * const response = buildPaginatedResponse(
 *   [ticket1, ticket2],  // data
 *   50,                   // total count
 *   1,                    // page
 *   20                    // limit
 * );
 * // Returns:
 * // {
 * //   data: [ticket1, ticket2],
 * //   pagination: {
 * //     total: 50,
 * //     page: 1,
 * //     limit: 20,
 * //     totalPages: 3
 * //   }
 * // }
 */
const buildPaginatedResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  },
});

module.exports = { getPaginationParams, buildPaginatedResponse };
