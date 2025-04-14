import prisma from '../lib/prismaclient.js';

export const listAllNGOs = async (req, res) => {
    try{
        const ngos = await prisma.NGO.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                website: true,
                contactEmail: true,
                phone: true,
                address: true,
                status: true
              },
              
        });
        res.status(200).json(ngos);
    }
    catch (error) {
        console.error("Error fetching NGOs:", error);
        res.status(500).json({ message: "Error in file: ngo.controller.js ( listAllNGOs )" });
    }
};

export const createNGO = async (req, res) => {
    try{
        const { name, description, website, contactEmail, phone, address, logo, socialMedia } = req.body;
        
        // Get the user ID from the authenticated request
        const userId = req.user;
        
        // Create the NGO
        const ngo = await prisma.NGO.create({
            data: {
                name,
                description,
                website,
                contactEmail,
                phone,
                address,
                logo,
                socialMedia,
                // Create an NGO admin record at the same time
                admins: {
                    create: [
                        {
                            user: {
                                connect: { id: userId }
                            }
                        }
                    ]
                }
            },
            include: {
                admins: {
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
        
        res.status(201).json(ngo);
    }
    catch (error) {
        console.error("Error creating NGO:", error);
        res.status(500).json({ message: "Error in file: ngo.controller.js ( createNGO )", error: error.message });
    }
}

export const updateNGO = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, description, website, contactEmail, phone, address, logo, socialMedia } = req.body;
        const ngo = await prisma.NGO.update({
            where: { id },
            data: {
                name,
                description,
                website,
                contactEmail,
                phone,
                address,
                logo,
                socialMedia
            },
        });
        res.status(200).json(ngo);
    }
    catch (error) {
        console.error("Error updating NGO:", error);
        res.status(500).json({ message: "Error in file: ngo.controller.js ( updateNGO )" });
    }
}

export const getNGODashboard = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First verify the NGO exists
        const ngoExists = await prisma.NGO.findUnique({
            where: { id }
        });
        
        if (!ngoExists) {
            return res.status(404).json({ message: "NGO not found" });
        }
        
        // Fetch NGO with related data based on the schema relationships
        const ngo = await prisma.NGO.findUnique({
            where: { id },
            include: {
                // Include relationship fields correctly as defined in schema.prisma
                admins: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true,
                            }
                        }
                    }
                },
                subscription: {
                    include: {
                        plan: true
                    }
                },
                donations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                animals: true,
                emergencies: {
                    include: {
                        emergency: true
                    }
                }
            }
        });
        
        // Transform data to include summary statistics
        const dashboardData = {
            ngo: {
                id: ngo.id,
                name: ngo.name,
                description: ngo.description,
                website: ngo.website,
                contactEmail: ngo.contactEmail,
                phone: ngo.phone,
                address: ngo.address,
                logo: ngo.logo,
                socialMedia: ngo.socialMedia,
                status: ngo.status,
                createdAt: ngo.createdAt
            },
            subscription: ngo.subscription,
            stats: {
                totalDonations: ngo.donations.length,
                totalAmount: ngo.donations.reduce((sum, donation) => 
                    donation.status === 'COMPLETED' ? sum + donation.amount : sum, 0),
                totalAnimals: ngo.animals.length,
                availableAnimals: ngo.animals.filter(animal => 
                    animal.status === 'AVAILABLE').length,
                pendingEmergencies: ngo.emergencies.filter(response => 
                    response.status === 'PENDING').length,
                totalEmergencies: ngo.emergencies.length
            },
            admins: ngo.admins.map(admin => ({
                id: admin.id,
                userId: admin.userId,
                userName: admin.user.username,
                email: admin.user.email,
                role: admin.user.role,
                assignedAt: admin.assignedAt
            })),
            recentDonations: ngo.donations
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(donation => ({
                    id: donation.id,
                    amount: donation.amount,
                    status: donation.status,
                    donor: donation.user.username,
                    createdAt: donation.createdAt
                })),
            recentAnimals: ngo.animals
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
        };
        
        res.status(200).json(dashboardData);
    }
    catch (error) {
        console.error("Error fetching NGO dashboard:", error);
        res.status(500).json({ 
            message: "Error fetching NGO dashboard", 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};