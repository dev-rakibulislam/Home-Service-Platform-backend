import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import type { AuthenticatedUser } from "../../types/auth";
import type { CreateReviewPayload } from "./review.validation";

const createReviewService = async (
	bookingId: string,
	user: AuthenticatedUser,
	payload: CreateReviewPayload,
) => {
	const booking = await prisma.booking.findUnique({
		where: {
			id: bookingId,
		},
		include: {
			review: true,
		},
	});

	if (!booking) {
		throw new AppError(404, "Booking not found");
	}

	// Only booking owner can review
	if (booking.customerId !== user.id) {
		throw new AppError(403, "You are not authorized to review this booking");
	}

	// Booking must be completed
	if (booking.status !== BookingStatus.COMPLETED) {
		throw new AppError(
			400,
			"Review can only be given after booking is completed",
		);
	}

	// One booking = one review
	if (booking.review) {
		throw new AppError(409, "You already reviewed this booking");
	}

	const transaction = await prisma.$transaction(async (tx) => {
		const CreateReview = await tx.review.create({
			data: {
				bookingId,
				rating: payload.rating,
				comment: payload.comment,
			},
		});

		const ratingResult = await tx.review.aggregate({
			where: {
				booking: {
					technicianId: booking.technicianId,
				},
			},
			_avg: {
				rating: true,
			},
		});

		await tx.technicianProfile.update({
			where: {
				id: booking.technicianId,
			},
			data: {
				avgRating: ratingResult._avg.rating,
			},
		});

		return CreateReview;
	});

	return transaction;
};

export const reviewService = {
	createReviewService,
};
