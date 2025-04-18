import prisma from "../lib/prismaclient.js";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
    try{
        const userId = req.user;
        const user = await prisma.user.findUnique({
            where:{id : userId},
            select:{
                id:true,
                username:true,
                email:true,
                role:true,
                deletedAt:true, // Assuming you have a deletedAt field to check if the user is soft deleted
            }
        });
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json(user);
    }catch(error){
        console.error("Error fetching user profile:", error);
        return res.status(500).json({message:"Error in file: user.controller.js ( getUserProfile )" }); 
    }
};
export const updateUserProfile = async (req, res) => {
    try{
        const userId = req.user;
        const {username, email, password} = req.body;
        const updatedUserDetails={username, email};
        const existingUser = await prisma.user.findUnique({
            where:{id:userId}
        });

        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedUserDetails.password = hashedPassword;
        }
        
        const updatedUser = await prisma.user.update({
            where:{id:userId},
            data:updatedUserDetails,
            select: { id: true, username: true, email: true, role: true }
        })
        return res.status(200).json(updatedUser);
    }catch(error){
        console.error("Error updating user profile:", error);
        return res.status(500).json({message:"Error in file: user.controller.js( updateUserProfile )" });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user;
        const deletedUser = await prisma.user.delete({
            where: { id: userId },
            select: { id: true, username: true, email: true, role: true }
        });

        res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        })
        return res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error("Error deleting user profile:", error);
        return res.status(500).json({ message: "Error in file: user.controller.js ( deleteUserProfile )" });
    }      
};

// Update the current user's role
export const updateUserRole = async (req, res) => {
    try {
        const userId = req.user;
        const { role } = req.body;
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized" 
            });
        }
        
        if (!role) {
            return res.status(400).json({ 
                success: false, 
                message: "Role is required" 
            });
        }
        
        console.log(`Updating user ${userId} role to ${role}`);
        
        // Validate role is one of the allowed values
        const validRoles = ['USER', 'NGO_ADMIN', 'SUPER_ADMIN'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
            });
        }
        
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        
        console.log("User role updated:", updatedUser);
        
        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to update user role", 
            error: error.message 
        });
    }
};