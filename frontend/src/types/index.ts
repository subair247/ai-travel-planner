export interface Activity {
  _id?: string;
  title: string;
  description: string;
  estimatedCostUSD: number;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
}

export interface ItineraryDay {
  dayNumber: number;
  activities: Activity[];
}

export interface PackingItem {
  _id?: string;
  item: string;
  category: 'Documents' | 'Clothing' | 'Gear' | 'Other';
  isPacked: boolean;
}

export interface Hotel {
  name: string;
  tier: string;
  estimatedCostNightUSD: number;
  rating: string;
}

export interface Trip {
  _id: string;
  destination: string;
  durationDays: number;
  budgetTier: 'Low' | 'Medium' | 'High';
  interests: string[];
  itinerary: ItineraryDay[];
  hotels: Hotel[];
  packingList: PackingItem[];
  estimatedBudget: {
    total: number;
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
  };
}