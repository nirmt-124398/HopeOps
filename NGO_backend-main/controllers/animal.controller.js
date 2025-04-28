import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Create a new animal for adoption
export const createAnimal = async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(1, "Name is required"),
      species: z.enum(['DOG', 'CAT', 'COW', 'BIRD', 'OTHER']),
      age: z.number().int().positive(),
      description: z.string().min(1, "Description is required"),
      photos: z.array(z.string()).optional().default([]),
    });

    // Validate request body
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    // Get NGO ID from the authenticated admin
    const ngoAdmin = await prisma.nGOAdmin.findFirst({
      where: { userId: req.user }
    });

    if (!ngoAdmin) {
      return res.status(403).json({ error: "You are not authorized to create animals for any NGO" });
    }

    // Create animal in database
    const animal = await prisma.animal.create({
      data: {
        ...validation.data,
        ngoId: ngoAdmin.ngoId,
        status: 'AVAILABLE'
      }
    });

    return res.status(201).json(animal);
  } catch (error) {
    console.error("Error creating animal:", error);
    return res.status(500).json({ error: "Failed to create animal" });
  }
};

// Get all animals with optional filters
export const getAllAnimals = async (req, res) => {
  try {
    const { species, status, ngoId } = req.query;
    
    let filter = {};
    if (species) filter.species = species;
    if (status) filter.status = status;
    if (ngoId) filter.ngoId = ngoId;

    const animals = await prisma.animal.findMany({
      where: filter,
      include: {
        ngo: {
          select: {
            name: true,
            logo: true
          }
        },
        requests: true
      }
    });

    return res.status(200).json(animals);
  } catch (error) {
    console.error("Error fetching animals:", error);
    return res.status(500).json({ error: "Failed to fetch animals" });
  }
};

// Get a single animal by ID
export const getAnimalById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        ngo: {
          select: {
            id: true,
            name: true,
            logo: true,
            contactEmail: true,
            phone: true
          }
        }
      }
    });

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    return res.status(200).json(animal);
  } catch (error) {
    console.error("Error fetching animal:", error);
    return res.status(500).json({ error: "Failed to fetch animal" });
  }
};

// Update animal details
export const updateAnimal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schema = z.object({
      name: z.string().min(1).optional(),
      species: z.enum(['DOG', 'CAT', 'COW', 'BIRD', 'OTHER']).optional(),
      age: z.number().int().positive().optional(),
      description: z.string().min(1).optional(),
      photos: z.array(z.string()).optional(),
      status: z.enum(['AVAILABLE', 'ADOPTED', 'PENDING']).optional(),
    });

    // Validate request body
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    // Check if animal exists and belongs to the NGO of the admin
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: { ngo: true }
    });

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    // Check if user is authorized to update this animal
    const ngoAdmin = await prisma.nGOAdmin.findFirst({
      where: { 
        userId: req.user.id,
        ngoId: animal.ngoId 
      }
    });

    if (!ngoAdmin && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: "You are not authorized to update this animal" });
    }

    // Update animal
    const updatedAnimal = await prisma.animal.update({
      where: { id },
      data: validation.data
    });

    return res.status(200).json(updatedAnimal);
  } catch (error) {
    console.error("Error updating animal:", error);
    return res.status(500).json({ error: "Failed to update animal" });
  }
};

// Delete an animal
export const deleteAnimal = async (req, res) => {
  const { id } = req.params;
 
  try {
    // Check if animal exists
    const animalExists = await prisma.animal.findUnique({
      where: {
        id: id,
      },
    });

    if (!animalExists) {
      return res.status(404).json({ message: "Animal not found" });
    }

    // First, delete associated adoption requests
    await prisma.adoptionRequest.deleteMany({
      where: {
        animalId: id,
      },
    });

    // Now delete the animal
    const animal = await prisma.animal.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ message: "Animal deleted successfully", animal });
  } catch (error) {
    console.error("Error deleting animal:", error);
    res.status(500).json({ message: "Error deleting animal", error: error.message });
  }
};

// Get all animals for a specific NGO
export const getNGOAnimals = async (req, res) => {
  try {
    // Find the NGO associated with this admin
    const ngoAdmin = await prisma.nGOAdmin.findFirst({
      where: { userId: req.user }
    });

    if (!ngoAdmin) {
      return res.status(403).json({ error: "You are not authorized to view NGO animals" });
    }

    // Get all animals belonging to this NGO
    const animals = await prisma.animal.findMany({
      where: { ngoId: ngoAdmin.ngoId },
      include: {
        requests: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json(animals);
  } catch (error) {
    console.error("Error fetching NGO animals:", error);
    return res.status(500).json({ error: "Failed to fetch NGO animals" });
  }
};
