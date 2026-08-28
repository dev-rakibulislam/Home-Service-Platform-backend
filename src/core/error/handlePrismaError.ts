export const handlePrismaError = (error: any) => {
	switch (error.code) {
		case "P2002": {
			const constraint =
				error.meta?.driverAdapterError?.cause?.constraint?.index;

			const field = constraint?.replace(/_key$/, "").split("_").pop();

			return {
				statusCode: 409,
				message: "Duplicate value found",
				errors: [
					{
						path: field || "unknown",
						message: `${field} already exists`,
					},
				],
			};
		}
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
