import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

async function testNGOAdminCreation() {
  try {
    console.log("Testing NGO admin creation...");
    
    // 1. Login as SUPER_ADMIN to get token
    const loginResponse = await fetch(`${process.env.API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    
    const token = loginData.token;
    
    // 2. Create NGO and assign admin
    const testUserId = process.env.TEST_USER_ID; // Set this in your .env file
    
    const ngoData = {
      name: "Test NGO " + new Date().toISOString(),
      description: "This is a test NGO for development purposes",
      website: "https://testngo.example.com",
      contactEmail: "contact@testngo.example.com",
      phone: "1234567890",
      address: "123 Test Street, Test City",
      logo: "https://example.com/logo.png",
      socialMedia: {
        facebook: "https://facebook.com/testngo",
        twitter: "https://twitter.com/testngo"
      }
    };
    
    const createResponse = await fetch(`${process.env.API_URL}/api/test/create-ngo-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: testUserId,
        ngoData
      })
    });
    
    const createData = await createResponse.json();
    if (!createResponse.ok) {
      throw new Error(`NGO creation failed: ${JSON.stringify(createData)}`);
    }
    
    console.log("✅ Success! NGO and admin created:");
    console.log(JSON.stringify(createData, null, 2));
    
  } catch (error) {
    console.error("❌ Error testing NGO admin creation:", error);
  }
}

testNGOAdminCreation();
