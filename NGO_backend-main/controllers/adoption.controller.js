import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Create adoption request by a user
export const createAdoptionRequest = async (req, res) => {
  try {
    const schema = z.object({
      animalId: z.string().min(1, "Animal ID is required")
    });

    // Validate request body
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const { animalId } = validation.data;

    // Check if animal exists and is available
    const animal = await prisma.animal.findUnique({
      where: { id: animalId }
    });

    if (!animal) {
      return res.status(404).json({ error: "Animal not found" });
    }

    if (animal.status !== 'AVAILABLE') {
      return res.status(400).json({ error: "Animal is not available for adoption" });
    }

    // Check if user already has a pending request for this animal
    const existingRequest = await prisma.adoptionRequest.findFirst({
      where: {
        userId: req.user,
        animalId: animalId
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: "You already have a request for this animal" });
    }

    // Create adoption request - use connect to create the relationship properly
    const adoptionRequest = await prisma.adoptionRequest.create({
      data: {
        user: {
          connect: { id: req.user }  // Connect to existing user
        },
        animal: {
          connect: { id: animalId }  // Connect to existing animal
        },
        status: 'PENDING'
      }
    });

    // Update animal status to PENDING
    await prisma.animal.update({
      where: { id: animalId },
      data: { status: 'PENDING' }
    });

    return res.status(201).json(adoptionRequest);
  } catch (error) {
    console.error("Error creating adoption request:", error);
    return res.status(500).json({ error: "Failed to create adoption request" });
  }
};

// Get all adoption requests for an NGO admin
export const getNGOAdoptionRequests = async (req, res) => {
  try {
    // Find the NGO associated with this admin
    const ngoAdmin = await prisma.nGOAdmin.findFirst({
      where: { userId: req.user } // Use req.user not req.user.id
    });

    if (!ngoAdmin) {
      return res.status(403).json({ error: "You are not authorized to view adoption requests" });
    }

    // Get all animals belonging to this NGO
    const animals = await prisma.animal.findMany({
      where: { ngoId: ngoAdmin.ngoId },
      select: { id: true }
    });

    const animalIds = animals.map(animal => animal.id);

    // Get all adoption requests for these animals
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      where: {
        animalId: { in: animalIds }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        animal: true
      }
    });

    return res.status(200).json(adoptionRequests);
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return res.status(500).json({ error: "Failed to fetch adoption requests" });
  }
};
 
// Get adoption requests made by a user
export const getUserAdoptionRequests = async (req, res) => {
  try {
    const adoptionRequests = await prisma.adoptionRequest.findMany({
      where: { userId: req.user.id },
      include: {
        animal: {
          include: {
            ngo: {
              select: {
                name: true,
                contactEmail: true,
                phone: true
              }
            }
          }
        }
      }
    });

    return res.status(200).json(adoptionRequests);
  } catch (error) {
    console.error("Error fetching user adoption requests:", error);
    return res.status(500).json({ error: "Failed to fetch adoption requests" });
  }
};

// Update adoption request status (approve/reject)
export const updateAdoptionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schema = z.object({
      status: z.enum(['APPROVED', 'REJECTED'])
    });

    // Validate request body
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    // Find the adoption request
    const adoptionRequest = await prisma.adoptionRequest.findUnique({
      where: { id },
      include: { animal: true }
    });

    if (!adoptionRequest) {
      return res.status(404).json({ error: "Adoption request not found" });
    }

    // Check if user is authorized (must be NGO admin for the animal's NGO)
    const ngoAdmin = await prisma.nGOAdmin.findFirst({
      where: { 
        userId: req.user.id,
        ngoId: adoptionRequest.animal.ngoId 
      }
    });

    if (!ngoAdmin && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: "You are not authorized to update this adoption request" });
    }

    // Update the adoption request
    const updatedRequest = await prisma.adoptionRequest.update({
      where: { id },
      data: { status: validation.data.status }
    });

    // If approved, update animal status to ADOPTED
    if (validation.data.status === 'APPROVED') {
      await prisma.animal.update({
        where: { id: adoptionRequest.animalId },
        data: { status: 'ADOPTED' }
      });

      // Reject all other pending requests for this animal
      await prisma.adoptionRequest.updateMany({
        where: { 
          animalId: adoptionRequest.animalId,
          id: { not: id },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });
    } 
    // If rejected and there are no other pending requests, set animal back to AVAILABLE
    else if (validation.data.status === 'REJECTED') {
      const pendingRequests = await prisma.adoptionRequest.count({
        where: {
          animalId: adoptionRequest.animalId,
          status: 'PENDING'
        }
      });
      
      if (pendingRequests === 0) {
        await prisma.animal.update({
          where: { id: adoptionRequest.animalId },
          data: { status: 'AVAILABLE' }
        });
      }
    }

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating adoption request:", error);
    return res.status(500).json({ error: "Failed to update adoption request" });
  }
};
