import dotenv from 'dotenv';
import prisma from "../lib/prismaclient.js";

// Load environment variables from .env file
dotenv.config();

async function diagnoseNGOAdmin() {
  try {
    console.log("Starting NGO Admin diagnostic...");
    
    // 1. Output your user ID for verification
    const userId = process.argv[2]; // Pass user ID as command line argument
    if (!userId) {
      console.error("Please provide a user ID as command line argument");
      console.log("Example: node scripts/diagnose-ngo-admin.js YOUR_USER_ID");
      return;
    }
    
    // 2. Check if the user exists and verify role
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.log(`⛔ User with ID ${userId} not found`);
      return;
    }
    
    console.log(`✅ User found: ${user.username} (${user.email})`);
    console.log(`Role: ${user.role}`);
    console.log(`Deleted: ${user.deletedAt ? 'Yes' : 'No'}`);
    
    // 3. Check if any NGO exists
    const ngos = await prisma.NGO.findMany({ 
      where: { deletedAt: null },
      take: 5 
    });
    
    if (ngos.length === 0) {
      console.log("⛔ No NGOs found in the database");
      console.log("Creating a sample NGO...");
      
      const newNGO = await prisma.NGO.create({
        data: {
          name: "Animal Rescue NGO",
          description: "An organization dedicated to rescuing and rehabilitating animals in need",
          website: "https://animalrescue.org",
          contactEmail: "contact@animalrescue.org",
          phone: "1234567890",
          address: "123 Rescue Lane, Animal City",
          logo: "https://example.com/logo.png",
          status: "PENDING"
        }
      });
      
      console.log(`✅ Created NGO: ${newNGO.name} (${newNGO.id})`);
      ngos.push(newNGO);
    } else {
      console.log(`✅ Found ${ngos.length} NGOs:`);
      ngos.forEach((ngo, i) => console.log(`  ${i+1}. ${ngo.name} (${ngo.id})`));
    }
    
    // 4. Check NGO Admin associations
    const ngoAdmin = await prisma.NGOAdmin.findFirst({
      where: { userId }
    });
    
    if (!ngoAdmin) {
      console.log(`⛔ No NGO Admin association found for user ${userId}`);
      
      // 5. Create the association if it doesn't exist
      const newNGOAdmin = await prisma.NGOAdmin.create({
        data: {
          user: { connect: { id: userId } },
          ngo: { connect: { id: ngos[0].id } }
        }
      });
      
      console.log(`✅ Created new NGO Admin association: ${newNGOAdmin.id}`);
      console.log(`User ${user.username} is now associated with NGO ${ngos[0].name}`);
    } else {
      const ngo = await prisma.NGO.findUnique({
        where: { id: ngoAdmin.ngoId }
      });
      
      console.log(`✅ Found NGO Admin association: ${ngoAdmin.id}`);
      console.log(`User is associated with NGO: ${ngo?.name || 'Unknown NGO'} (${ngoAdmin.ngoId})`);
    }
    
    // 6. Verify the association works in the controller logic
    const checkAssoc = await prisma.NGOAdmin.findFirst({
      where: { userId },
      include: { ngo: true }
    });
    
    console.log("\nVerifying controller query...");
    console.log(`Query result: ${checkAssoc ? 'Found' : 'Not found'}`);
    if (checkAssoc) {
      console.log(`Associated NGO: ${checkAssoc.ngo?.name || 'Unknown'}`);
    }
    
  } catch (error) {
    console.error("Error in diagnosis:", error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseNGOAdmin()
  .then(() => console.log("Diagnostic completed."))
  .catch((e) => console.error("Error during diagnostic:", e));