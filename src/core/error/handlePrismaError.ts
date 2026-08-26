export const handlePrismaError = (error: any) => {
  switch (error.code) {
    case "P2002":
      return {
        statusCode: 409,
        message: "Duplicate value found",
        errors: [
          {
            path: error.meta?.target?.toString() || "unknown",
            message: "This value already exists",
          },
        ],
      };

    case "P2025":
      return {
        statusCode: 404,
        message: "Record not found",
        errors: [],
      };

    default:
      return {
        statusCode: 500,
        message: "Database error",
        errors: [],
      };
  }
};
