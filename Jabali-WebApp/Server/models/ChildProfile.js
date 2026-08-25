const { prisma } = require('../config/db');

const findAllByUserId = async (userId) => {
  return prisma.childProfile.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id, userId) => {
  return prisma.childProfile.findFirst({
    where: { id, userId },
  });
};

const create = async (data, userId) => {
  return prisma.childProfile.create({
    data: {
      name: data.name,
      age: data.age,
      supportLevel: data.supportLevel,
      interests: data.interests || [],
      learningPreferences: data.learningPreferences,
      createdBy: data.createdBy || userId,
      userId,
    },
  });
};

const update = async (id, userId, data) => {
  return prisma.childProfile.updateMany({
    where: { id, userId },
    data: {
      name: data.name,
      age: data.age,
      supportLevel: data.supportLevel,
      interests: data.interests,
      learningPreferences: data.learningPreferences,
    },
  });
};

const deleteById = async (id, userId) => {
  return prisma.childProfile.deleteMany({
    where: { id, userId },
  });
};

module.exports = {
  findAllByUserId,
  findById,
  create,
  update,
  deleteById,
};
