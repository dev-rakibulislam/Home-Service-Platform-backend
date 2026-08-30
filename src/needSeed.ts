import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import crypto from "node:crypto";
import {
	BookingStatus,
	DayOfWeek,
	PaymentProvider,
	PaymentStatus,
	TechnicianStatus,
	UserRole,
	UserStatus,
} from "../generated/prisma/enums";

import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
	adapter,
});

const passwordHash = bcrypt.hashSync("Password123!", 10);

const categories = [
	{
		name: "ac repair",
		description: "Air conditioner repair and maintenance",
	},
	{
		name: "plumbing",
		description: "Plumbing installation and repair services",
	},
	{
		name: "electrical",
		description: "Electrical repair and installation services",
	},
	{
		name: "home cleaning",
		description: "Professional home cleaning services",
	},
	{
		name: "painting",
		description: "Interior and exterior painting services",
	},
	{
		name: "appliance repair",
		description: "Home appliance repair services",
	},
	{
		name: "carpentry",
		description: "Furniture and woodwork services",
	},
	{
		name: "computer repair",
		description: "Computer and laptop repair services",
	},
	{
		name: "pest control",
		description: "Professional pest control services",
	},
	{
		name: "moving service",
		description: "Home and office moving services",
	},
];

const technicianData = [
	{
		name: "Rahim Ahmed",
		email: "rahim.tech@example.com",
		phoneNumber: "01710000001",
		address: "Mirpur, Dhaka",
		userName: "rahim_tech",
		bio: "Experienced AC and electrical technician",
		skills: ["AC Repair", "Electrical", "Maintenance"],
		experienceYears: 7,
		hourlyRate: 800,
	},
	{
		name: "Karim Hasan",
		email: "karim.tech@example.com",
		phoneNumber: "01710000002",
		address: "Uttara, Dhaka",
		userName: "karim_tech",
		bio: "Professional plumbing and appliance technician",
		skills: ["Plumbing", "Appliance Repair"],
		experienceYears: 6,
		hourlyRate: 700,
	},
	{
		name: "Sakib Khan",
		email: "sakib.tech@example.com",
		phoneNumber: "01710000003",
		address: "Dhanmondi, Dhaka",
		userName: "sakib_tech",
		bio: "Professional home service technician",
		skills: ["Painting", "Carpentry", "Cleaning"],
		experienceYears: 5,
		hourlyRate: 650,
	},
	{
		name: "Tanvir Hossain",
		email: "tanvir.tech@example.com",
		phoneNumber: "01710000004",
		address: "Mohammadpur, Dhaka",
		userName: "tanvir_tech",
		bio: "Computer and networking specialist",
		skills: ["Computer Repair", "Networking"],
		experienceYears: 8,
		hourlyRate: 900,
	},
	{
		name: "Nayeem Islam",
		email: "nayeem.tech@example.com",
		phoneNumber: "01710000005",
		address: "Bashundhara, Dhaka",
		userName: "nayeem_tech",
		bio: "Expert AC and electrical service provider",
		skills: ["AC Repair", "Electrical"],
		experienceYears: 9,
		hourlyRate: 1000,
	},
	{
		name: "Fahim Rahman",
		email: "fahim.tech@example.com",
		phoneNumber: "01710000006",
		address: "Banani, Dhaka",
		userName: "fahim_tech",
		bio: "Home cleaning and pest control specialist",
		skills: ["Cleaning", "Pest Control"],
		experienceYears: 4,
		hourlyRate: 600,
	},
	{
		name: "Rasel Mia",
		email: "rasel.tech@example.com",
		phoneNumber: "01710000007",
		address: "Khilgaon, Dhaka",
		userName: "rasel_tech",
		bio: "Professional moving and carpentry technician",
		skills: ["Moving", "Carpentry"],
		experienceYears: 10,
		hourlyRate: 750,
	},
];

const customerData = [
	{
		name: "Rakib Hasan",
		email: "rakib.customer@example.com",
		phoneNumber: "01810000001",
		address: "Mirpur, Dhaka",
	},
	{
		name: "Nusrat Jahan",
		email: "nusrat.customer@example.com",
		phoneNumber: "01810000002",
		address: "Uttara, Dhaka",
	},
	{
		name: "Shakil Ahmed",
		email: "shakil.customer@example.com",
		phoneNumber: "01810000003",
		address: "Dhanmondi, Dhaka",
	},
];

const serviceTemplates = [
	["AC Repair", "Complete AC inspection and repair", 1200, 120],
	["AC Installation", "Professional AC installation service", 1800, 180],
	["AC Gas Refill", "AC gas refill and cooling check", 1500, 90],

	["Pipe Repair", "Water pipe leakage repair", 800, 90],
	["Bathroom Plumbing", "Complete bathroom plumbing service", 1200, 120],
	["Water Tap Repair", "Tap replacement and repair", 500, 60],

	["Electrical Wiring", "Home electrical wiring service", 1500, 180],
	["Fan Installation", "Ceiling fan installation", 700, 60],
	["Switch Repair", "Switch and socket repair", 400, 45],

	["Deep Home Cleaning", "Complete deep cleaning service", 2500, 240],
	["Kitchen Cleaning", "Professional kitchen cleaning", 1200, 120],
	["Bathroom Cleaning", "Complete bathroom cleaning", 900, 90],

	["Room Painting", "Professional room painting", 3000, 360],
	["Wall Painting", "Interior wall painting service", 2500, 300],
	["House Painting", "Complete house painting", 10000, 1440],

	["Refrigerator Repair", "Refrigerator troubleshooting and repair", 1000, 120],
	["Washing Machine Repair", "Washing machine repair service", 1200, 120],
	["Microwave Repair", "Microwave oven repair", 900, 90],

	["Furniture Repair", "Furniture repair and maintenance", 1200, 120],
	["Door Repair", "Door repair and adjustment", 800, 90],
	["Custom Woodwork", "Custom carpentry and woodwork", 2500, 240],

	["Laptop Repair", "Laptop hardware repair", 1500, 120],
	["Desktop Repair", "Desktop computer repair", 1200, 120],
	["Windows Installation", "Windows installation and setup", 700, 60],

	["Cockroach Control", "Professional cockroach control", 1500, 120],
	["Mosquito Control", "Mosquito treatment service", 1300, 120],
	["Full Pest Control", "Complete home pest treatment", 3000, 240],

	["Home Moving", "Small home moving service", 5000, 480],
	["Office Moving", "Office moving service", 8000, 720],
	["Furniture Moving", "Furniture shifting service", 2500, 180],
];

const reviewComments = [
	"Excellent service. Very professional.",
	"Technician arrived on time and solved the problem.",
	"Very good service and reasonable price.",
	"Highly recommended.",
	"Excellent experience.",
	"Very professional technician.",
	"Fast and reliable service.",
	"The work quality was excellent.",
	"Satisfied with the service.",
	"Very helpful and polite technician.",
];

const getRandomItem = <T>(items: T[]): T => {
	return items[Math.floor(Math.random() * items.length)]!;
};

const getRandomRating = () => {
	const ratings = [3, 4, 4, 4, 5, 5, 5];
	return getRandomItem(ratings);
};

const getBookingStatus = (index: number): BookingStatus => {
	if (index < 100) return BookingStatus.COMPLETED;

	const statuses = [
		BookingStatus.PENDING,
		BookingStatus.ACCEPTED,
		BookingStatus.IN_PROGRESS,
		BookingStatus.CANCELLED,
	];

	return statuses[index % statuses.length]!;
};

async function main() {
	console.log("Starting database seed...");

	// --------------------------------------------------
	// 1. CREATE CATEGORIES
	// --------------------------------------------------

	const createdCategories = [];

	for (const category of categories) {
		const created = await prisma.category.upsert({
			where: {
				name: category.name,
			},
			update: {
				description: category.description,
			},
			create: {
				name: category.name,
				description: category.description,
				isActive: true,
			},
		});

		createdCategories.push(created);
	}

	console.log(`Created/Found ${createdCategories.length} categories`);

	// --------------------------------------------------
	// 2. CREATE USERS
	// --------------------------------------------------

	const technicians = [];
	const customers = [];

	// Create 7 technicians
	for (const data of technicianData) {
		const user = await prisma.user.upsert({
			where: {
				email: data.email,
			},
			update: {},
			create: {
				name: data.name,
				email: data.email,
				phoneNumber: data.phoneNumber,
				password: passwordHash,
				address: data.address,
				status: UserStatus.UNBAN,
				role: UserRole.TECHNICIAN,
			},
		});

		const technician = await prisma.technicianProfile.upsert({
			where: {
				userId: user.id,
			},
			update: {},
			create: {
				userId: user.id,
				userName: data.userName,
				bio: data.bio,
				skills: data.skills,
				experienceYears: data.experienceYears,
				hourlyRate: data.hourlyRate,
				isAvailable: true,
				status: TechnicianStatus.ACTIVE,
				avgRating: null,
			},
		});

		technicians.push(technician);
	}

	// Create 3 customers
	for (const data of customerData) {
		const user = await prisma.user.upsert({
			where: {
				email: data.email,
			},
			update: {},
			create: {
				name: data.name,
				email: data.email,
				phoneNumber: data.phoneNumber,
				password: passwordHash,
				address: data.address,
				status: UserStatus.UNBAN,
				role: UserRole.CUSTOMER,
			},
		});

		customers.push(user);
	}

	console.log(`Created/Found ${technicians.length} technicians`);
	console.log(`Created/Found ${customers.length} customers`);

	// --------------------------------------------------
	// 3. CREATE SERVICES
	// --------------------------------------------------

	const services = [];

	for (let i = 0; i < serviceTemplates.length; i++) {
		const [name, description, price, duration] = serviceTemplates[i]!;

		const technician = technicians[i % technicians.length];
		const category = createdCategories[i % createdCategories.length];

		const service = await prisma.service.create({
			data: {
				technicianId: technician.id,
				categoryId: category.id,
				name: name as string,
				description: description as string,
				price: price as number,
				duration: duration as number,
				isActive: true,
			},
		});

		services.push(service);
	}

	console.log(`Created ${services.length} services`);

	// --------------------------------------------------
	// 4. CREATE AVAILABILITY SLOTS
	// --------------------------------------------------

	for (const technician of technicians) {
		for (const day of Object.values(DayOfWeek)) {
			await prisma.availabilitySlot.create({
				data: {
					technicianId: technician.id,
					dayOfWeek: day,
					startTime: "09:00",
					endTime: "18:00",
				},
			});
		}
	}

	console.log("Created availability slots");

	// --------------------------------------------------
	// 5. CREATE BOOKINGS
	// --------------------------------------------------

	const completedBookings = [];
	const bookings = [];

	for (let i = 0; i < 120; i++) {
		const customer = customers[i % customers.length];

		const service = services[i % services.length];

		/*
      Important:
      Service-এর technician এবং Booking-এর technician
      একই রাখতে হবে।
    */
		const technicianId = service.technicianId;

		const status = getBookingStatus(i);

		const bookingDate = new Date();

		bookingDate.setDate(bookingDate.getDate() - (i % 30));

		const booking = await prisma.booking.create({
			data: {
				customerId: customer.id,
				technicianId,
				serviceId: service.id,
				bookingDate,
				status,
			},
		});

		bookings.push(booking);

		if (status === BookingStatus.COMPLETED) {
			completedBookings.push(booking);
		}
	}

	console.log(`Created ${bookings.length} bookings`);
	console.log(`Completed bookings: ${completedBookings.length}`);

	// --------------------------------------------------
	// 6. CREATE 100 REVIEWS
	// --------------------------------------------------

	for (let i = 0; i < completedBookings.length; i++) {
		const booking = completedBookings[i];

		await prisma.review.create({
			data: {
				bookingId: booking.id,
				rating: getRandomRating(),
				comment: getRandomItem(reviewComments),
			},
		});
	}

	console.log(`Created ${completedBookings.length} reviews`);

	// --------------------------------------------------
	// 7. UPDATE TECHNICIAN AVG RATINGS
	// --------------------------------------------------

	for (const technician of technicians) {
		const ratingResult = await prisma.review.aggregate({
			where: {
				booking: {
					technicianId: technician.id,
				},
			},
			_avg: {
				rating: true,
			},
		});

		await prisma.technicianProfile.update({
			where: {
				id: technician.id,
			},
			data: {
				avgRating: ratingResult._avg.rating,
			},
		});
	}

	console.log("Updated technician average ratings");

	// --------------------------------------------------
	// 8. CREATE 100 PAYMENTS
	// --------------------------------------------------

	/*
    প্রথম 100 booking-এর জন্য payment তৈরি করছি।

    কারণ Payment.bookingId @unique
    তাই একই booking-এর জন্য একাধিক payment
    তৈরি করা যাবে না।
  */

	for (let i = 0; i < 100; i++) {
		const booking = bookings[i];

		const service = services.find(
			(service) => service.id === booking.serviceId,
		);

		if (!service) {
			throw new Error(`Service not found for booking ${booking.id}`);
		}

		await prisma.payment.create({
			data: {
				transactionId: `TXN-FIXIT-${crypto.randomUUID()}`,
				bookingId: booking.id,
				amount: service.price,
				currency: "BDT",
				provider: PaymentProvider.SSLCOMMERZ,
				status: PaymentStatus.PAID,
				paidAt: new Date(),
				bankTranId: `BANK-${String(i + 1).padStart(5, "0")}`,
				cardBrand: "VISA",
				cardType: "DEBIT",
				cardIssuer: "Test Bank",
				cardCategory: "GENERAL",
				riskLevel: "0",
			},
		});
	}

	console.log("Created 100 payments");

	// --------------------------------------------------
	// FINAL SUMMARY
	// --------------------------------------------------

	const [
		userCount,
		technicianCount,
		customerCount,
		categoryCount,
		serviceCount,
		bookingCount,
		reviewCount,
		paymentCount,
	] = await Promise.all([
		prisma.user.count(),
		prisma.technicianProfile.count(),
		prisma.user.count({
			where: {
				role: UserRole.CUSTOMER,
			},
		}),
		prisma.category.count(),
		prisma.service.count(),
		prisma.booking.count(),
		prisma.review.count(),
		prisma.payment.count(),
	]);

	console.log("\n================================");
	console.log("        SEED COMPLETED");
	console.log("================================");
	console.log(`Users       : ${userCount}`);
	console.log(`Technicians : ${technicianCount}`);
	console.log(`Customers   : ${customerCount}`);
	console.log(`Categories  : ${categoryCount}`);
	console.log(`Services    : ${serviceCount}`);
	console.log(`Bookings    : ${bookingCount}`);
	console.log(`Reviews     : ${reviewCount}`);
	console.log(`Payments    : ${paymentCount}`);
	console.log("================================");
}

main()
	.catch((error) => {
		console.error("Seed failed:");
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

export default main;
