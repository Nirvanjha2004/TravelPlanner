import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Enhanced Unsplash image collections
export const unsplashImages = {
  landscapes: [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop",
  ],
  cities: [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop", // Paris
    "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=1200&auto=format&fit=crop", // New York
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1200&auto=format&fit=crop", // Tokyo
    "https://images.unsplash.com/photo-1493707553966-283afac8c358?q=80&w=1200&auto=format&fit=crop", // Barcelona
    "https://images.unsplash.com/photo-1547448526-5e9d57fa28f7?q=80&w=1200&auto=format&fit=crop", // Rome
  ],
  beaches: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1468413253725-0d5181091126?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  ],
  nature: [
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
  ],
  people: [
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
  ],
  categories: {
    Beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
    Mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop",
    Cultural: "https://images.unsplash.com/photo-1552248524-10d9a7e4b84a", // Traditional dancer
    Food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
    Urban: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=400&auto=format&fit=crop",
    Nature: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=400&auto=format&fit=crop",
    Adventure: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop",
    Relaxation: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400&auto=format&fit=crop",
    Shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop",
    Historical: "https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e", // Ancient ruins
    Budget: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=400&auto=format&fit=crop",
    Luxury: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    Wildlife: "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=400&auto=format&fit=crop",
    "Road Trip": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&auto=format&fit=crop",
    Cruise: "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=400&auto=format&fit=crop",
    Safari: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400&auto=format&fit=crop",
    Hiking: "https://images.unsplash.com/photo-1551632436-cbf6db5ff6a9?q=80&w=400&auto=format&fit=crop",
    City: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&auto=format&fit=crop",
    Temples: "https://images.unsplash.com/photo-1556375413-f6cdc5a01315?q=80&w=400&auto=format&fit=crop",
    Beaches: "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=400&auto=format&fit=crop"
  },
  locations: {
    Thailand: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=400&auto=format&fit=crop",
    Switzerland: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=400&auto=format&fit=crop",
    Indonesia: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=400&auto=format&fit=crop", 
    Tanzania: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400&auto=format&fit=crop",
    Japan: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=400&auto=format&fit=crop",
    Italy: "https://images.unsplash.com/photo-1534445251233-b4d711697acd?q=80&w=400&auto=format&fit=crop",
    USA: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=400&auto=format&fit=crop",
    Australia: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=400&auto=format&fit=crop",
    Egypt: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368" // Pyramids of Giza
  }
};

export function getRandomImage(category = 'landscapes') {
  const collection = unsplashImages[category] || unsplashImages.landscapes;
  if (Array.isArray(collection)) {
    return collection[Math.floor(Math.random() * collection.length)];
  }
  return Object.values(collection)[Math.floor(Math.random() * Object.values(collection).length)];
}

// Enhanced function to get an image for any category
export function getUnsplashImageByTerm(term) {
  // Check exact match
  if (unsplashImages.categories[term]) {
    return unsplashImages.categories[term];
  }
  
  // Check case-insensitive match
  const lowerTerm = term.toLowerCase();
  const categoryKey = Object.keys(unsplashImages.categories).find(
    key => key.toLowerCase() === lowerTerm
  );
  
  if (categoryKey) {
    return unsplashImages.categories[categoryKey];
  }
  
  // Check if it's a location
  if (unsplashImages.locations[term]) {
    return unsplashImages.locations[term];
  }

  // Check for similar terms (singular/plural forms)
  if (lowerTerm.endsWith('s')) {
    const singular = lowerTerm.slice(0, -1);
    const singularKey = Object.keys(unsplashImages.categories).find(
      key => key.toLowerCase() === singular
    );
    if (singularKey) return unsplashImages.categories[singularKey];
  } else {
    const plural = lowerTerm + 's';
    const pluralKey = Object.keys(unsplashImages.categories).find(
      key => key.toLowerCase() === plural
    );
    if (pluralKey) return unsplashImages.categories[pluralKey];
  }
  
  // Return a dynamic URL for Unsplash search as fallback
  return `https://source.unsplash.com/featured/?${encodeURIComponent(term)},travel`;
}

// Update dummy users with Unsplash images
export const dummyUsers = [
  {
    _id: "user1",
    name: "Alex Johnson",
    profilePicture: unsplashImages.people[0],
    bio: "Avid traveler exploring the world one country at a time. Lover of mountains, beaches, and everything in between.",
    location: "New York, USA"
  },
  {
    _id: "user2",
    name: "Sarah Miller",
    profilePicture: unsplashImages.people[4],
    bio: "Food enthusiast and cultural explorer. I travel to taste the world's cuisine and learn about different traditions.",
    location: "London, UK"
  },
  {
    _id: "user3",
    name: "David Wilson",
    profilePicture: unsplashImages.people[1],
    bio: "Adventure seeker and photographer. I'm on a mission to capture the world's most breathtaking landscapes.",
    location: "Sydney, Australia"
  }
];

// Update dummy experiences with Unsplash images
export const dummyExperiences = [
  {
    _id: "exp1",
    title: "Exploring Ancient Temples in Bali",
    description: "A journey through Bali's most sacred temples, from Uluwatu perched on dramatic cliffs to the serene water temple of Ulun Danu Beratan. Each site offers a unique glimpse into Balinese spiritual life and architectural mastery.",
    location: { city: "Ubud", country: "Indonesia" },
    images: [
      unsplashImages.locations.Indonesia,
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588625500630-6e0381450461?q=80&w=1200&auto=format&fit=crop"
    ],
    dateOfVisit: { startDate: "2023-05-15", endDate: "2023-05-25" },
    categories: ["Cultural", "Temples", "Nature"],
    tips: [
      "Visit Uluwatu Temple at sunset for the most magical experience",
      "Bring a sarong or rent one at the entrance - it's required for temple visits",
      "Beware of the monkeys at some temples, they can grab your belongings"
    ],
    user: dummyUsers[0],
    rating: 5,
    likes: ["user2", "user3"],
    budget: {
      amount: 1200,
      currency: "USD"
    },
    createdAt: new Date("2023-06-10").toISOString()
  },
  {
    _id: "exp2",
    title: "Hiking the Swiss Alps",
    description: "An unforgettable adventure through the breathtaking landscapes of the Swiss Alps. From challenging paths to stunning panoramic views, this hiking trip offered both physical exertion and spiritual rejuvenation.",
    location: { city: "Interlaken", country: "Switzerland" },
    images: [
      unsplashImages.locations.Switzerland,
      "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop"
    ],
    dateOfVisit: { startDate: "2023-07-10", endDate: "2023-07-20" },
    categories: ["Mountains", "Hiking", "Nature"],
    tips: [
      "Pack layers even in summer - the weather can change quickly",
      "Book mountain huts in advance during peak season",
      "The Swiss Pass is worth it if you plan to use multiple forms of transport"
    ],
    user: dummyUsers[1],
    rating: 5,
    likes: ["user1"],
    budget: {
      amount: 2500,
      currency: "USD"
    },
    createdAt: new Date("2023-08-05").toISOString()
  },
  {
    _id: "exp3",
    title: "Street Food Adventure in Bangkok",
    description: "A culinary journey through Bangkok's vibrant street food scene. From pad thai cooked in front of you to exotic fruit smoothies, this adventure delighted all the senses and introduced me to the heart of Thai cuisine.",
    location: { city: "Bangkok", country: "Thailand" },
    images: [
      unsplashImages.locations.Thailand,
      // Replace problematic image URLs with more reliable ones
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd"
    ],
    dateOfVisit: { startDate: "2023-03-05", endDate: "2023-03-15" },
    categories: ["Food", "Urban", "Culture"],
    tips: [
      "Look for street food stalls with long locals' queues",
      "The best food markets come alive in the evening",
      "Try mango sticky rice for dessert - it's a must!"
    ],
    user: dummyUsers[2],
    rating: 4,
    likes: ["user1", "user2"],
    budget: {
      amount: 800,
      currency: "USD"
    },
    createdAt: new Date("2023-04-12").toISOString()
  },
  {
    _id: "exp4",
    title: "Safari in Serengeti National Park",
    description: "An incredible wildlife adventure in Tanzania's Serengeti. Witnessed the Great Migration, spotted the Big Five, and experienced the raw beauty of African savanna. The sunsets alone were worth the trip.",
    location: { city: "Serengeti", country: "Tanzania" },
    images: [
      unsplashImages.locations.Tanzania,
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=1200&auto=format&fit=crop"
    ],
    dateOfVisit: { startDate: "2023-08-20", endDate: "2023-09-01" },
    categories: ["Safari", "Wildlife", "Nature"],
    tips: [
      "Book with a reputable tour operator - guides make a huge difference",
      "Pack neutral-colored clothing (beige, khaki)",
      "Bring a good camera with a telephoto lens",
      "The best wildlife viewing is typically at dawn and dusk"
    ],
    user: dummyUsers[0],
    rating: 5,
    likes: ["user2", "user3"],
    budget: {
      amount: 3500,
      currency: "USD"
    },
    createdAt: new Date("2023-09-15").toISOString()
  }
];
