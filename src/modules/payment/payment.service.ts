import {
	PaymentProvider,
	PaymentStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../config/prisma";
import AppError from "../../core/error/appError";
import { paymentWithSslcommerz } from "../../core/utils/sslComarcePayment";
import type { AuthenticatedUser } from "../../types/auth";
import type { CreatePaymentPayload } from "./payment.validator";

const createPaymentService = async (
	payload: CreatePaymentPayload,
	userData: AuthenticatedUser,
) => {
	const booking = await prisma.booking.findFirst({
		where: {
			id: payload.bookingId,
			customerId: userData.id,
		},
		include: {
			customer: true,
			service: {
				include: {
					category: true,
				},
			},
		},
	});

	if (!booking) {
		throw new AppError(404, "Booking not found");
	}

	if (booking.status !== "ACCEPTED") {
		throw new AppError(400, "Payment can only be made for an accepted booking");
	}

	const existingPayment = await prisma.payment.findUnique({
		where: {
			bookingId: booking.id,
		},
	});

	// Already paid
	if (existingPayment?.status === PaymentStatus.COMPLETED) {
		return {
			message: "Booking is already paid",
			paymentUrl: null,
		};
	}

	// Create new SSLCommerz payment session
	const sslResponse = await paymentWithSslcommerz(booking, userData);

	if (!sslResponse.data.status || sslResponse.data.status !== "SUCCESS") {
		throw new AppError(400, "Failed to initialize payment");
	}

	// PENDING payment exists → update it
	if (existingPayment?.status === PaymentStatus.PENDING) {
		await prisma.payment.update({
			where: {
				id: existingPayment.id,
			},
			data: {
				transactionId: sslResponse.transactionId,
				amount: booking.service.price,
				provider: PaymentProvider.SSLCOMMERZ,
				status: PaymentStatus.PENDING,
			},
		});
		return {
			message: "Payment is pending. You can complete the payment now",
			transactionId: sslResponse.transactionId,
			paymentUrl: sslResponse.data.GatewayPageURL,
		};
	}

	if (existingPayment?.status === PaymentStatus.FAILED) {
		await prisma.payment.update({
			where: {
				id: existingPayment.id,
			},
			data: {
				transactionId: sslResponse.transactionId,
				amount: booking.service.price,
				provider: PaymentProvider.SSLCOMMERZ,
				status: PaymentStatus.PENDING,
			},
		});

		return {
			message: "Previous payment failed. You can try again",
			transactionId: sslResponse.transactionId,
			paymentUrl: sslResponse.data.GatewayPageURL,
		};
	}

	// No payment exists → create new one
	await prisma.payment.create({
		data: {
			transactionId: sslResponse.transactionId,
			bookingId: booking.id,
			amount: booking.service.price,
			provider: PaymentProvider.SSLCOMMERZ,
			status: PaymentStatus.PENDING,
		},
	});

	return {
		message: "Payment initialized successfully",
		transactionId: sslResponse.transactionId,
		paymentUrl: sslResponse.data.GatewayPageURL,
	};
};

export const paymentService = {
	createPaymentService,
};
