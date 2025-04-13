import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed subscription plans...');
  
  // Check if plans already exist
  const existingPlansCount = await prisma.subscriptionPlan.count();
  
  if (existingPlansCount > 0) {
    console.log(`${existingPlansCount} subscription plans already exist, skipping seed.`);
    return;
  }
  
  // Define the subscription plans
  const subscriptionPlans = [
    {
      name: "Basic Plan",
      price: 999,
      duration: 1, // 1 month
      features: ["Basic dashboard access", "Up to 5 animals", "Email support"]
    },
    {
      name: "Standard Plan",
      price: 2499,
      duration: 3, // 3 months
      features: ["Full dashboard access", "Up to 15 animals", "Priority email support", "Basic analytics"]
    },
    {
      name: "Premium Plan",
      price: 4999,
      duration: 12, // 12 months
      features: ["Full platform access", "Unlimited animals", "24/7 phone support", "Advanced analytics", "Featured listings"]
    }
  ];
  
  // Create plans in database
  const createdPlans = await Promise.all(
    subscriptionPlans.map(plan => 
      prisma.SubscriptionPlan.create({
        data: plan
      })
    )
  );
  
  console.log(`Created ${createdPlans.length} subscription plans successfully:`);
  console.log(createdPlans.map(plan => `- ${plan.name}: ₹${plan.price} for ${plan.duration} month(s)`).join('\n'));
}

main()
  .catch(e => {
    console.error('Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });