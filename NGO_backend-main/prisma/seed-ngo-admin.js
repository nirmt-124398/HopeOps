import dotenv from 'dotenv';
import prisma from "../lib/prismaclient.js";

// Load environment variables from .env file
dotenv.config();

async function seedNGOAdmin() {
  try {
    console.log("Starting to seed NGO admin records...");
    console.log("Database URL configured:", process.env.DATABASE_URL ? "Yes" : "No");
    
    // 1. Find all users with NGO_ADMIN role
    const adminUsers = await prisma.user.findMany({
      where: { 
        role: 'NGO_ADMIN',
        deletedAt: null
      }
    });
    
    if (adminUsers.length === 0) {
      console.log("No users with NGO_ADMIN role found. Please create one first.");
      return;
    }
    
    console.log(`Found ${adminUsers.length} admin users`);
    
    // 2. Find all NGOs
    const ngos = await prisma.NGO.findMany({
      where: {
        deletedAt: null
      }
    });
    
    if (ngos.length === 0) {
      console.log("No NGOs found. Please create an NGO first.");
      return;
    }
    
    console.log(`Found ${ngos.length} NGOs`);
    
    // 3. Get existing associations to avoid duplicates
    const existingAssociations = await prisma.NGOAdmin.findMany();
    console.log(`Found ${existingAssociations.length} existing associations`);
    
    // Create a map of existing associations for quick lookup
    const associationMap = new Map();
    existingAssociations.forEach(assoc => {
      const key = `${assoc.userId}-${assoc.ngoId}`;
      associationMap.set(key, true);
    });
    
    // 4. Create missing associations
    let createdCount = 0;
    
    // Create at least one association for each NGO admin
    for (const user of adminUsers) {
      let isAssociated = false;
      
      // Check if user already has an association
      for (const assoc of existingAssociations) {
        if (assoc.userId === user.id) {
          isAssociated = true;
          break;
        }
      }
      
      // If not associated, create an association with the first NGO
      if (!isAssociated && ngos.length > 0) {
        const ngo = ngos[0]; // Use the first NGO
        const key = `${user.id}-${ngo.id}`;
        
        if (!associationMap.has(key)) {
          // Create a new association
          const ngoAdmin = await prisma.NGOAdmin.create({
            data: {
              user: { connect: { id: user.id } },
              ngo: { connect: { id: ngo.id } }
            }
          });
          
          console.log(`Created association: User ${user.username} (${user.id}) → NGO ${ngo.name} (${ngo.id})`);
          associationMap.set(key, true);
          createdCount++;
        }
      }
    }
    
    if (createdCount > 0) {
      console.log(`Successfully created ${createdCount} new NGO admin associations`);
    } else {
      console.log("No new associations were needed");
    }
    
  } catch (error) {
    console.error("Error seeding NGO admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNGOAdmin()
  .then(() => console.log("NGO Admin seeding completed."))
  .catch((e) => console.error("Error during NGO Admin seeding:", e));