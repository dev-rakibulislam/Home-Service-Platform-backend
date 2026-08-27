import { config } from "../../config/env";
import type { AuthenticatedUser } from "../../types/auth";

export async function paymentWithSslcommerz(
	booking: any,
	userData: AuthenticatedUser,
) {
	const transactionId = `TXN-${Date.now()}-${Math.random()
		.toString(36)
		.substring(2, 8)
		.toUpperCase()}`;

	const paymentData = new URLSearchParams({
		store_id: config.sslcommerz.storeId ?? "",
		store_passwd: config.sslcommerz.storePassword ?? "",
		total_amount: booking.service.price.toString(),
		tran_id: transactionId,

		success_url: config.sslcommerz.successUrl ?? "",
		fail_url: config.sslcommerz.failUrl ?? "",
		cancel_url: config.sslcommerz.cancelUrl ?? "",
		ipn_url: config.sslcommerz.ipnUrl ?? "",

		product_name: booking.service.name,
		product_category: booking.service.category.name,
		product_profile: "general",

		cus_name: userData.name ?? "",
		cus_email: userData.email ?? "",
		cus_add1: booking.customer.address ?? "dhaka-1200",
		cus_city: "N/A",
		cus_country: "Bangladesh",
		cus_phone: booking.customer.phoneNumber ?? "n/a",

		shipping_method: "NO",
		num_of_item: "1",
	});

	const response = await fetch(
		`${config.sslcommerz.sandboxApiUrl}/gwprocess/v4/api.php`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: paymentData.toString(),
		},
	);
	return { data: await response.json(), transactionId };
}

export async function paymentVerifySslcommerz(val_id: string) {
	const validationUrl =
		"https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php" +
		`?val_id=${val_id}` +
		`&store_id=${config.sslcommerz.storeId}` +
		`&store_passwd=${config.sslcommerz.storePassword}` +
		`&format=json`;

	const response = await fetch(validationUrl);
	return await response.json();
}
