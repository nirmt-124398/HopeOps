import dotenv from 'dotenv';
import prisma from "../lib/prismaclient.js";
import Razorpay from 'razorpay';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function updateUserToNGOAdmin() {
  try {
    const userId = process.argv[2];
    const subscriptionId = process.argv[3];
    
    if (!userId || !subscriptionId) {
      console.error("Please provide user ID and subscription ID as command line arguments");
      console.log("Example: node scripts/create-test-ngo-admin.js USER_ID SUBSCRIPTION_ID");
      return;
    }
    
    // 1. Verify subscription status
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    
    if (subscription.status !== 'active') {
      console.error(`Subscription ${subscriptionId} is not active`);
      return;
    }
    
    // 2. Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
    
    // 3. Update user role to NGO_ADMIN
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        role: 'NGO_ADMIN',
        subscriptionId: subscriptionId,
        subscriptionStatus: subscription.status
      }
    });
    
    console.log(`✅ Updated user ${user.username} to NGO_ADMIN role`);
    console.log(`\nUser details:`);
    console.log(`- ID: ${updatedUser.id}`);
    console.log(`- Username: ${updatedUser.username}`);
    console.log(`- Email: ${updatedUser.email}`);
    console.log(`- Role: ${updatedUser.role}`);
    console.log(`- Subscription ID: ${subscriptionId}`);
    console.log(`- Subscription Status: ${subscription.status}`);
    
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
