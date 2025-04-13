const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new rescue
const createRescue = async (req, res) => {
  try {
    const { location, description, status, animalType, priority } = req.body;
    const rescue = await prisma.rescue.create({
      data: {
        location,
        description,
        status,
        animalType,
        priority,
        createdBy: req.user.id,
      },
    });
    res.status(201).json(rescue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all rescues
const getAllRescues = async (req, res) => {
  try {
    const rescues = await prisma.rescue.findMany({
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(rescues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get rescue by ID
const getRescueById = async (req, res) => {
  try {
    const { id } = req.params;
    const rescue = await prisma.rescue.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!rescue) {
      return res.status(404).json({ error: 'Rescue not found' });
    }
    res.status(200).json(rescue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update rescue
const updateRescue = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, description, status, animalType, priority } = req.body;
    const rescue = await prisma.rescue.update({
      where: { id: parseInt(id) },
      data: {
        location,
        description,
        status,
        animalType,
        priority,
      },
    });
    res.status(200).json(rescue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete rescue
const deleteRescue = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.rescue.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update rescue status
const updateRescueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const rescue = await prisma.rescue.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(rescue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRescue,
  getAllRescues,
  getRescueById,
  updateRescue,
  deleteRescue,
  updateRescueStatus,
}; 