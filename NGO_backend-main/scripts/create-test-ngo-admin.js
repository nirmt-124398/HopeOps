import dotenv from 'dotenv';
import prisma from "../lib/prismaclient.js";

dotenv.config();

async function updateUserToNGOAdmin() {
  try {
    const userId = process.argv[2];
    
    if (!userId) {
      console.error("Please provide a user ID as command line argument");
      console.log("Example: node scripts/create-test-ngo-admin.js USER_ID");
      return;
    }
    
    // 1. Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
    
    // 2. Update user role to NGO_ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'NGO_ADMIN' }
    });
    
    console.log(`✅ Updated user ${user.username} to NGO_ADMIN role`);
    console.log(`\nUser details:`);
    console.log(`- ID: ${updatedUser.id}`);
    console.log(`- Username: ${updatedUser.username}`);
    console.log(`- Email: ${updatedUser.email}`);
    console.log(`- Role: ${updatedUser.role}`);
    
    console.log(`\nNext steps:`);
    console.log(`1. Login with the user's credentials in Postman`);
    console.log(`2. Use the POST /api/ngos endpoint to create an NGO`);
    console.log(`3. The NGO admin association will be automatically created by the controller`);
    
  } catch (error) {
    console.error("Error updating user role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserToNGOAdmin();
