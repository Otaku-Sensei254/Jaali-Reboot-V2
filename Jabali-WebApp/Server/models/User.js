const bcrypt = require('bcrypt');
const { prisma } = require('../config/db');

const SALT_ROUNDS = 10;

const findByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });
};

const create = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      fullName: data.fullName,
      role: data.role,
    },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });
};

const verifyPassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = {
  findByEmail,
  findById,
  create,
  verifyPassword,
};