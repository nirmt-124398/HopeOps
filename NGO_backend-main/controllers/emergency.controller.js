import prisma from "../lib/prismaclient.js";

// List all emergencies.
export const listEmergencies = async (req, res) => {
    try {
        const emergencies = await prisma.emergency.findMany({
            include: {
                responses: true,  // Optionally include responses for context
                user: {           // Include user who created the emergency
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(emergencies);
    } catch (error) {
        console.error("Error listing emergencies:", error);
        return res.status(500).json({ error: "Error fetching emergencies" });
    }
};

// List only emergencies with PENDING status
export const listPendingEmergencies = async (req, res) => {
    try {
        const pendingEmergencies = await prisma.emergency.findMany({
            where: {
                status: 'PENDING'
            },
            include: {
                responses: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
            },
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(pendingEmergencies);
    } catch (error) {
        console.error("Error listing pending emergencies:", error);
        return res.status(500).json({ error: "Error fetching pending emergencies" });
    }
};

export const createEmergency = async (req, res) => {
    try {
        const userId = req.user;
        const { location, description } = req.body;

        // Input validation
        if (!location || !description) {
            return res.status(400).json({
                error: "Both location and description are required"
            });
        }

        // Validate location format (should be a JSON object with lat and lng)
        if (!location.lat || !location.lng) {
            return res.status(400).json({
                error: "Location must include latitude and longitude coordinates"
            });
        }
 
        // Create the emergency record
        const emergency = await prisma.emergency.create({
            data: {
                user: { connect: { id: userId } },
                location, // Store the location as JSON { lat: number, lng: number }
                description,

            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        // Return the created emergency with a 201 Created status
        return res.status(201).json({
            message: "Emergency reported successfully",
            emergency
        });
    } catch (error) {
        console.error("Error creating emergency:", error);
        return res.status(500).json({ error: "Failed to report emergency" });
    }
};

export const getEmergencyStatus = async (req, res) => {
    try {
        let { EmergencyId } = req.params;
        // Validate EmergencyId
        if (!EmergencyId) {
            return res.status(400).json({ error: "EmergencyId is required" });
        }
        // Fetch the emergency status
        let emergency = await prisma.emergency.findUnique({
            where: { id: EmergencyId },
            include: {
                responses: true,  // Include responses if needed
                user: {           // Include user who created the emergency
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
        // Check if emergency exists
        if (!emergency) {
            return res.status(404).json({ error: "Emergency not found" });
        }
        // Return the emergency status
        return res.status(200).json({
            message: "Emergency status fetched successfully",
            emergency
        });

    } catch (error) {
        console.error("Error fetching emergency status:", error);
        return res.status(500).json({ error: "Error fetching emergency status" });

    }
};

// Add this diagnostic function
async function diagnoseNGOAdminIssue(userId) {
    try {
        // Check user
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
                ngoAdmins: true
            }
        });
        console.log("User details:", user);

        // Check NGO Admin records
        const ngoAdminRecords = await prisma.NGOAdmin.findMany({
            where: { userId: userId },
            include: {
                ngo: true
            }
        });
        console.log("NGO Admin records:", ngoAdminRecords);

        return { user, ngoAdminRecords };
    } catch (error) {
        console.error("Diagnostic error:", error);
        return null;
    }
}

// Modify the respondToEmergency function to include diagnosis
export const respondToEmergency = async (req, res) => {
    try {
        const { EmergencyId } = req.params;
        const { status, notes } = req.body;
        const userId = req.user;

        // Log incoming request for debugging
        console.log("Emergency response request:", {
            EmergencyId,
            requestBody: req.body,
            userId
        });

        // Run diagnostics
        const diagnosis = await diagnoseNGOAdminIssue(userId);
        console.log("Diagnostic results:", diagnosis);

        // Add this debug check
        console.log("User Role:", req.userRole);
        if (req.userRole !== 'NGO_ADMIN') {
            return res.status(403).json({ error: "Only NGO admins can respond to emergencies" });
        }

        // Validate inputs
        if (!EmergencyId) {
            return res.status(400).json({ error: "EmergencyId is required" });
        }

        // Validate status if provided
        if (status && !['PENDING', 'ACCEPTED', 'RESOLVED'].includes(status)) {
            return res.status(400).json({
                error: "Invalid status. Must be one of: PENDING, ACCEPTED, RESOLVED"
            });
        }

        // Check if the emergency exists    
        const emergency = await prisma.emergency.findUnique({
            where: { id: EmergencyId },
            include: {
                responses: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        if (!emergency) {
            return res.status(404).json({ error: "Emergency not found" });
        }

        // Check if the emergency is already being handled
        if (emergency.status !== 'PENDING') {
            return res.status(400).json({ 
                error: "This emergency is already being handled",
                currentStatus: emergency.status
            });
        }

        // Check if this NGO has already responded to this emergency
        console.log("User ID for lookup:", userId);
        console.log("Searching for NGO Admin with userId:", userId);

        let ngoAdmin = await prisma.NGOAdmin.findFirst({
            where: {
                userId: userId
            },
            include: {
                ngo: true,
                user: {
                    select: {
                        username: true,
                        email: true,
                        role: true
                    }
                }
            }
        });

        console.log("NGO Admin lookup result:", ngoAdmin);

        if (!ngoAdmin) {
            console.log("Looking for verified NGOs...");

            const verifiedNGO = await prisma.NGO.findFirst({
                where: {
                    status: 'VERIFIED'
                }
            });

            console.log("Verified NGO found:", verifiedNGO);

            if (!verifiedNGO) {
                return res.status(403).json({ 
                    error: "No verified NGO found. Please contact an administrator." 
                });
            }

            try {
                // Create NGO Admin association
                ngoAdmin = await prisma.NGOAdmin.create({
                    data: {
                        user: { connect: { id: userId } },
                        ngo: { connect: { id: verifiedNGO.id } }
                    },
                    include: {
                        ngo: true
                    }
                });

                console.log("Successfully created NGO Admin association:", ngoAdmin);
            } catch (error) {
                console.error("Error creating NGO Admin association:", error);
                return res.status(403).json({ 
                    error: "Failed to create NGO association. Please contact an administrator." 
                });
            }
        }

        // Check if this NGO has already responded to this emergency
        const existingResponse = await prisma.emergencyResponse.findFirst({
            where: {
                emergencyId: EmergencyId,
                ngoId: ngoAdmin.ngoId
            }
        });

        if (existingResponse) {
            return res.status(400).json({ 
                error: "Your organization has already responded to this emergency",
                existingResponse 
            });
        }

        // First update the emergency status (before creating the response)
        const emergencyStatus = status || 'ACCEPTED';
        const updatedEmergency = await prisma.emergency.update({
            where: { id: EmergencyId },
            data: { status: emergencyStatus },
            select: {
                id: true,
                userId: true,
                location: true,
                description: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        // Prepare response data with notes handling
        const responseData = {
            emergency: { connect: { id: EmergencyId } },
            ngo: { connect: { id: ngoAdmin.ngoId } },
            respondedBy: userId,
            status: 'ACCEPTED', // Explicitly set status to ACCEPTED
            acceptedAt: new Date()
        };

        // Only add notes if they're provided
        if (notes !== undefined && notes !== null) {
            responseData.notes = notes;
            console.log("Adding notes to response:", notes);
        }

        // Create the response record - will now reference the updated emergency
        const response = await prisma.emergencyResponse.create({
            data: responseData,
            include: {
                emergency: true, // This will now contain the updated emergency status
                ngo: {
                    select: {
                        id: true,
                        name: true,
                        contactEmail: true,
                        phone: true
                    }
                }
            }
        });

        // Return the created response with a 201 Created status
        return res.status(201).json({
            message: "Response to emergency created successfully",
            response,
            emergency: updatedEmergency 
        });

    } catch (error) {
        console.error("Error responding to emergency:", error);
        return res.status(500).json({ error: "Error responding to emergency" });
    }
};

/**
 * Update the status of an emergency response
 * @route PATCH /api/emergencies/:emergencyId/response/:responseId
 * @access Private (NGO_ADMIN only)
 */
export const updateEmergencyResponseStatus = async (req, res) => {
    try {
        const { emergencyId, responseId } = req.params;
        const { status } = req.body;
        const userId = req.user;

        // Validate input
        if (!emergencyId || !responseId) {
            return res.status(400).json({ 
                error: "Emergency ID and Response ID are required" 
            });
        }

        if (!status || !['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ 
                error: "Valid status (PENDING, ACCEPTED, REJECTED) is required" 
            });
        }

        // Verify the NGO Admin status of the user
        const ngoAdmin = await prisma.NGOAdmin.findFirst({
            where: { userId },
            include: { ngo: true }
        });

        if (!ngoAdmin) {
            return res.status(403).json({ 
                error: "You must be an NGO Admin to update emergency responses" 
            });
        }

        // Check if the emergency response exists and belongs to the NGO
        const emergencyResponse = await prisma.emergencyResponse.findFirst({
            where: {
                id: responseId,
                emergencyId,
                ngoId: ngoAdmin.ngoId
            },
            include: {
                emergency: true
            }
        });

        if (!emergencyResponse) {
            return res.status(404).json({ 
                error: "Emergency response not found or you don't have permission to update it" 
            });
        }

        // Update the emergency response status
        const updatedResponse = await prisma.emergencyResponse.update({
            where: { id: responseId },
            data: { 
                status,
                // If accepting, set the acceptedAt timestamp
                ...(status === 'ACCEPTED' && { acceptedAt: new Date() })
            },
            include: {
                emergency: true,
                ngo: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        // If the response is accepted, update the emergency status to ACCEPTED as well
        if (status === 'ACCEPTED') {
            await prisma.emergency.update({
                where: { id: emergencyId },
                data: { status: 'ACCEPTED' }
            });
        }

        // If the response is rejected, keep the emergency as PENDING
        // so other NGOs can respond

        return res.status(200).json({
            message: `Emergency response status updated to ${status}`,
            response: updatedResponse
        });
    } catch (error) {
        console.error("Error updating emergency response status:", error);
        return res.status(500).json({ 
            error: "Error updating emergency response status",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};