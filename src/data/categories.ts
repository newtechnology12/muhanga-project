import slugify from '../utils/slugify';

let categories = [
	{
		icon: '/car-icons/car-svgrepo-com.svg',
		text: 'Sedans',
		subcategories: [
			{ text: 'Compact Sedans' },
			{ text: 'Midsize Sedans' },
			{ text: 'Full-size Sedans' },
			{ text: 'Luxury Sedans' },
			{ text: 'Sports Sedans' }
		]
	},
	{
		icon: '/car-icons/sport-utility-vehicle-svgrepo-com.svg',
		text: 'SUVs (Sports Utility Vehicle)',
		subcategories: [
			{ text: 'Compact SUVs' },
			{ text: 'Midsize SUVs' },
			{ text: 'Full-size SUVs' },
			{ text: 'Crossover SUVs' },
			{ text: 'Luxury SUVs' }
		]
	},
	{
		icon: '/car-icons/taxi-car-svgrepo-com.svg',
		text: 'Hatchbacks',
		subcategories: [
			{ text: 'Compact Hatchbacks' },
			{ text: 'Midsize Hatchbacks' },
			{ text: 'Full-size Hatchbacks' },
			{ text: 'Sporty Hatchbacks' },
			{ text: 'Luxury Hatchbacks' }
		]
	},
	{
		icon: '/car-icons/trucks-truck-svgrepo-com.svg',
		text: 'Pickup & Trucks',
		subcategories: [
			{ text: 'Compact Pickup Trucks' },
			{ text: 'Midsize Pickup Trucks' },
			{ text: 'Full-size Pickup Trucks' },
			{ text: 'Luxury Pickup Trucks' },
			{ text: 'Off-road Pickup Trucks' }
		]
	},
	{
		icon: '/car-icons/pickup-truck-svgrepo-com.svg',
		text: 'Coupes',
		subcategories: [
			{ text: 'Sport Coupes' },
			{ text: 'Luxury Coupes' },
			{ text: 'Compact Coupes' },
			{ text: 'Midsize Coupes' },
			{ text: 'Full-size Coupes' }
		]
	}
].map((e) => ({
	...e,
	slug: slugify(e.text),
	subcategories: e.subcategories.map((e) => ({ text: e.text, slug: slugify(e.text) }))
}));

export default categories;
