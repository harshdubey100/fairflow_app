const prisma = require('../config/prisma');

const userSelect = {
  id: true,
  clerkId: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
};

const findByClerkId = (clerkId) =>
  prisma.user.findUnique({ where: { clerkId }, select: userSelect });

const findById = (id) =>
  prisma.user.findUnique({ where: { id }, select: userSelect });

const findAll = () => prisma.user.findMany({ select: userSelect });

const upsert = (clerkId, data) =>
  prisma.user.upsert({
    where: { clerkId },
    update: data,
    create: { clerkId, ...data },
    select: userSelect,
  });

module.exports = { findByClerkId, findById, findAll, upsert, userSelect };
