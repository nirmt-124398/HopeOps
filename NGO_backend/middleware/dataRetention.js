// middleware/dataRetention.js
export const softDelete = async (req, res, next) => {
    req.softDelete = {
      update: {
        deletedAt: new Date()
      }
    };
    next();
  };
  
  export const excludeDeleted = {
    where: {
      deletedAt: null
    }
  };