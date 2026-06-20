const Trip = require('../models/Trip');

async function fetchWithRetry(url, options, retries = 5, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429 && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(`API Status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

exports.generateNewTrip = async (req, res) => {
  try {
    const { destination, durationDays, budgetTier, interests } = req.body;
    const userId = req.user.id;

    const prompt = `Create a travel plan for ${durationDays} days to ${destination}. Budget: ${budgetTier}. Interests: ${interests.join(', ')}. Return valid JSON object structure: {"itinerary": [{"dayNumber": 1, "activities": [{"title": "Name", "description": "Text", "estimatedCostUSD": 0, "timeOfDay": "Morning"}]}], "hotels": [{"name": "Hotel Name", "tier": "Budget", "estimatedCostNightUSD": 0, "rating": "4/5"}], "estimatedBudget": {"transport": 0, "accommodation": 0, "food": 0, "activities": 0, "total": 0}, "packingList": [{"item": "Name", "category": "Clothing", "isPacked": false}]}`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const data = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error('Generation Empty');

    const result = JSON.parse(textResponse);
    const trip = new Trip({
      userId,
      destination,
      durationDays,
      budgetTier,
      interests,
      itinerary: result.itinerary,
      hotels: result.hotels,
      estimatedBudget: result.estimatedBudget,
      packingList: result.packingList
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'AI Processing Fault' });
  }
};

exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};