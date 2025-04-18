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
        const { name, description, website, contactEmail, phone, address, logo, socialMedia, subscriptionId } = req.body;
        
        // Get the user ID from the authenticated request
        const userId = req.user;
        
        console.log("Received user ID from auth middleware:", userId);
        
        if (!userId) {
            return res.status(422).json({
                success: false,
                message: "Validation failed",
                errors: [{ field: "authentication", message: "User not authenticated" }]
            });
        }
        
        // Log the user ID for debugging
        console.log("Creating NGO with subscription ID:", subscriptionId);
        console.log("User ID format:", typeof userId, userId);
        
        // First check the user's current role - with error handling
        let existingUser;
        try {
            existingUser = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, username: true, email: true, role: true }
            });
            
            console.log("Found user:", existingUser);
        } catch (findError) {
            console.error("Error finding user:", findError);
            
            // Try with ObjectId if needed
            try {
                const { ObjectId } = require('mongodb');
                console.log("Trying with MongoDB ObjectId");
                existingUser = await prisma.user.findUnique({
                    where: { id: new ObjectId(userId).toString() },
                    select: { id: true, username: true, email: true, role: true }
                });
                console.log("Found user with ObjectId:", existingUser);
            } catch (objectIdError) {
                console.error("ObjectId attempt failed:", objectIdError);
            }
        }
        
        if (!existingUser) {
            console.log("User not found, falling back to finding by any field");
            // Try finding the user by other fields
            try {
                // Try find by email if user provided it
                if (contactEmail) {
                    const userByEmail = await prisma.user.findFirst({
                        where: { email: contactEmail },
                        select: { id: true, username: true, email: true, role: true }
                    });
                    
                    if (userByEmail) {
                        console.log("Found user by email:", userByEmail);
                        existingUser = userByEmail;
                        // Update userId to match
                        userId = userByEmail.id;
                    }
                }
            } catch (fallbackError) {
                console.error("Fallback search failed:", fallbackError);
            }
        }
        
        // Even if we can't find the user, let's create the NGO
        if (!existingUser) {
            console.warn("Could not find user. Will continue without role update.");
        } else {
            console.log("Current user role:", existingUser.role);
            
            // Update the user's role to ngo_admin
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: { role: 'NGO_ADMIN' }
                });
                console.log("User role updated to NGO_ADMIN");
            } catch (roleError) {
                console.error("Error updating role:", roleError);
                // Continue despite the role update error
            }
        }

        // Create the NGO first
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
            }
        });
        
        console.log("NGO created:", ngo.id);
        
        // Now create the subscription with proper relationship to the NGO
        if (subscriptionId) {
            try {
                // First get plan details from the request or fetch from Razorpay
                const planId = req.body.planId || subscription?.planId;
                
                console.log("Creating subscription with plan ID:", planId);
                
                // Check if the plan exists in our database
                const existingPlan = await prisma.subscriptionPlan.findFirst({
                    where: {
                        id: planId
                    }
                });
                
                if (!existingPlan) {
                    console.log("Plan not found in database, will use a default one");
                    // Find any available plan in the database
                    const anyPlan = await prisma.subscriptionPlan.findFirst();
                    
                    if (!anyPlan) {
                        console.error("No subscription plans found in database");
                        throw new Error("No subscription plans available");
                    }
                    
                    console.log("Using default plan:", anyPlan.id);
                    
                    // Create the subscription with the NGO relationship
                    const subscription = await prisma.subscription.create({
                        data: {
                            id: subscriptionId,
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
                            status: 'COMPLETED',
                            ngo: {
                                connect: { id: ngo.id }
                            },
                            plan: {
                                connect: { id: anyPlan.id }
                            }
                        }
                    });
                    
                    console.log("Subscription created and linked to NGO:", subscription.id);
                } else {
                    // Plan exists, connect to it
                    console.log("Using existing plan:", existingPlan.id);
                    
                    const subscription = await prisma.subscription.create({
                        data: {
                            id: subscriptionId,
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
                            status: 'COMPLETED',
                            ngo: {
                                connect: { id: ngo.id }
                            },
                            plan: {
                                connect: { id: existingPlan.id }
                            }
                        }
                    });
                    
                    console.log("Subscription created and linked to NGO:", subscription.id);
                }
            } catch (subError) {
                console.error("Error creating subscription:", subError);
                
                // Try a simpler approach without relations if the first attempt fails
                try {
                    console.log("Trying alternative subscription creation approach");
                    // Update the NGO with just the subscription ID reference
                    await prisma.NGO.update({
                        where: { id: ngo.id },
                        data: { subscriptionId }
                    });
                    console.log("Updated NGO with subscription ID reference");
                } catch (finalError) {
                    console.error("Failed to link subscription by any means:", finalError);
                    // Continue without subscription linkage - the NGO is already created
                }
            }
        }
        
        // Get the complete NGO with relations for the response
        const completeNgo = await prisma.NGO.findUnique({
            where: { id: ngo.id },
            include: {
                admins: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                subscription: true
            }
        });
        
        res.status(201).json({ success: true, ngo: completeNgo });
    }
    catch (error) {
        console.error("Error creating NGO:", error);
        
        // Provide clearer error messages for specific cases
        if (error.code === 'P2025') {
            return res.status(422).json({
                success: false,
                message: "Validation failed",
                errors: [{ field: "subscriptionId", message: "Subscription not found" }]
            });
        }
        
        if (error.meta?.field_name?.includes('subscription')) {
            return res.status(422).json({
                success: false,
                message: "Validation failed",
                errors: [{ field: "subscriptionId", message: "Invalid subscription format" }]
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: "Error creating NGO", 
            error: error.message 
        });
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