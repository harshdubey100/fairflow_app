/**
 * getPaginationParams - Extracts and validates pagination query params.
 * @param {object} query - req.query
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
};

/**
 * buildPaginatedResponse - Wraps data with pagination metadata.
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
