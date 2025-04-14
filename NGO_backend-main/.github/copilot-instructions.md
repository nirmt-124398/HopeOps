# GitHub Copilot Instructions for NGO Management Website

## Project Overview
This project is an NGO management website that includes multiple core features:
- **Authentication & Authorization:** User registration, login, logout (using JWT stored in HTTP-only cookies), and role-based access control.
- **NGO Management:** CRUD operations for NGOs, with specific access for NGO administrators.
- **Subscription System:** NGO subscription management with Razorpay integration.
- **Donation Module:** Allowing users to donate to NGOs, including payment verification.
- **Emergency Rescue Operations:** Users can report emergencies and NGOs can respond.
- **Animal Adoption:** NGOs list animals for adoption and users can request adoptions.

The backend is built with **Express.js**, using **Prisma ORM** with **MongoDB** as the database. The project uses middleware for authentication, error handling, and input validation.

## Key Technologies
- **Backend Framework:** Express.js
- **Database/ORM:** MongoDB with Prisma ORM
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies
- **Payment Gateway:** Razorpay for handling donations and subscriptions
- **Soft Deletion:** Implemented via a `deletedAt` field in models (using custom Prisma middleware/extensions)

## Coding Conventions & Best Practices
- **ES6+ Syntax:** Use `import/export`, async/await, and modern JavaScript best practices.
- **Modular Code Structure:**  
  - Controllers in `controllers/`
  - Routes in `routes/`
  - Database client and configuration in `lib/prismaclient.js`
- **Error Handling:** Use try/catch blocks and centralized error-handling middleware.
- **Security:**  
  - Validate all inputs thoroughly.
  - Hash sensitive data (like passwords) using bcrypt.
  - Use HTTP-only cookies to store JWTs.
  - Ensure role-based access control in protected routes.
- **Soft Deletion:**  
  - Instead of permanently deleting records (e.g., users), update the `deletedAt` field.
  - Always filter out records with a non-null `deletedAt` when fetching active data.

## Specific Copilot Instructions
- **When Generating New Code:**  
  - Follow the project’s established structure and naming conventions (e.g., `User`, `NGO`, `SubscriptionPlan`).
  - Include inline comments to explain code logic.
  - Use async/await for all asynchronous operations.
  - Add input validation and error handling where applicable.
  - Use clear, descriptive variable and function names.
  
- **For Authentication/Authorization:**  
  - Generate code that creates JWT tokens and stores them in HTTP-only cookies.
  - Ensure that middleware properly verifies tokens and assigns roles.
  
- **For CRUD Controllers (User, NGO, etc.):**  
  - Create separate controllers for each resource (e.g., user profile update, NGO creation).
  - For update/delete operations, consider soft deletion by setting the `deletedAt` field.
  
- **For Payment, Subscription, and Donation Modules:**  
  - Integrate Razorpay where needed.
  - Generate code that logs transactions and handles webhook events.
  
- **For Emergency & Adoption Features:**  
  - Provide detailed comments and clear steps for status updates and role-based actions.
  
- **If the Prompt is Ambiguous:**  
  - Generate a code template with clear placeholders and comments indicating where further customizations are needed.
  
- **When New Middleware is Needed:**  
  - Generate modular middleware functions that can be reused across multiple routes (e.g., authentication, error handling, rate limiting).

## Example Prompts and Expected Outputs
- **"Create a user profile update controller"**  
  Generate a controller that accepts user input, validates it, updates the user in the database using Prisma, and returns the updated profile (without sensitive fields like the password).

- **"Implement an error handling middleware"**  
  Generate a middleware function that catches errors from asynchronous routes and returns a standardized JSON error response.

- **"Write a route for NGO creation"**  
  Generate an Express route that calls an NGO controller to create a new NGO, ensuring that only users with the NGO_ADMIN role can access it.

## Additional Notes
- Environment variables are defined in the `.env` file.
- Use Prisma’s custom extensions or middleware to handle soft deletion where needed.
- Keep security best practices in mind, especially regarding password storage and JWT management.
- Always refer back to this file for guidelines when generating new code for this project.
- Always refer to `prisma/schema.prisma` for correct model, field names, and relationships.
- Always add ".js" ot file extension name when importing a file.


By following these instructions, GitHub Copilot will generate code that is consistent with the project's requirements, style, and architecture.
