import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async delete({ args, query }) {

        return prisma.user.update({
          where: args.where, 
          data: { deletedAt: new Date() }, // Sets the deletedAt field to the current date, marking the user as deleted
          ...args.select ? { select: args.select } : {}, // If a select argument is provided, include it to specify which fields to return after the update
          ...args.include ? { include: args.include } : {}, // If an include argument is provided, include it to specify which related records to include in the result
        });
      },
      async deleteMany({ args, query }) {
        // Perform a soft delete on multiple users
        return query({
          ...args,
          data: { 
            ...args.data,
            deletedAt: new Date() // Set the deletedAt field to the current date for all matched users
          },
        });
      },
      async findMany({ args, query }) {
        // Find many users that are not soft deleted
        return query({
          ...args,
          where: {
            ...args.where,
            deletedAt: null, // Only return users where deletedAt is null
          },
        });
      },
      async findFirst({ args, query }) {
        // Handle the case where args.where might be undefined
        const whereClause = args.where || {};
        
        // Execute the query with deletedAt filter
        const result = await query({
          ...args,
          where: {
            ...whereClause,
            deletedAt: null, // Only return users where deletedAt is null
          },
        });
        
        return result;
      },
      async findUnique({ args, query }) {
        // First perform the unique lookup
        const result = await query(args);
        // Only return the user if they exist and aren't deleted
        if (result && result.deletedAt === null) {   // Giving deletedAt to check if user is deleted is necessary if you want to check if user is deleted or not
          return result;
        }
        
        // Otherwise return null
        return null;
      },
    }
  }
});

export default prisma;