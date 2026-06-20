const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://ai-travel-planner-blush-three.vercel.app' // Your live frontend!
  ],
  credentials: true
}));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const tripSchema = new mongoose.Schema({
  destination: String,
  days: Number,
  budget: String,
  interests: [String],
  itineraryText: String,
  daysArray: [{ dayNumber: Number, activities: [String] }],
  hotels: [{ name: String, details: String }],
  estimatedBudget: { total: String, transpo: String, accommodation: String, food: String },
  createdAt: { type: Date, default: Date.now }
});
const Trip = mongoose.model('Trip', tripSchema);

// --- AUTH ROUTING ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already registered' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, message: 'Account established!' });
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    res.status(200).json({ success: true, user: { id: user._id, email: user.email } });
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
});

// Helper parsing block designed for structured tagging
function parseItineraryDays(text, totalDays) {
  const daysArray = [];
  const lines = text.split('\n');
  let currentDayNum = 0;
  let currentActivities = [];

  for (let line of lines) {
    const cleanLine = line.trim();
    if (/^(?:Day\s*\d+|##\s*Day\s*\d+)/i.test(cleanLine)) {
      if (currentDayNum > 0 && currentActivities.length) {
        daysArray.push({ dayNumber: currentDayNum, activities: currentActivities });
      }
      currentDayNum = parseInt(cleanLine.match(/\d+/)?.[0] || (currentDayNum + 1));
      currentActivities = [];
    } else if ((cleanLine.startsWith('*') || cleanLine.startsWith('-') || /^\d+\./.test(cleanLine)) && currentDayNum > 0) {
      const activityText = cleanLine.replace(/^[*-\d.]\s*/, '');
      if (activityText.length > 3 && !activityText.toLowerCase().includes('budget') && !activityText.toLowerCase().includes('hotel')) {
        currentActivities.push(activityText);
      }
    }
  }
  if (currentDayNum > 0 && currentActivities.length && daysArray.length < totalDays) {
    daysArray.push({ dayNumber: currentDayNum, activities: currentActivities });
  }

  if (daysArray.length === 0) {
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ dayNumber: i, activities: [`Explore premium sights around ${i}`] });
    }
  }
  return daysArray;
}

app.post('/api/trips', async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;
    const targetDays = Number(days) || 3;

    const prompt = `Provide a travel plan for ${destination || 'Paris'} for ${targetDays} days. Financial tier: ${budget || 'Medium'}. Key interests: ${interests?.join(', ')}.

You must format your entire response using the following structure exactly. Do not add intro or outro text.

[BUDGET]
Total: 150
Transit: 20
Accommodation: 80
Food: 50

[HOTELS]
Hotel Le Littré - 4-star comfortable rooms with view
Grand Hôtel de L'Univers - Central location boutique stay

[ITINERARY]
Day 1
- Morning: Visit the core landmark attractions
- Afternoon: Walking tour and lunch exploration
- Evening: Local culinary tasting dinner

Day 2
- Morning: Secondary cultural exploration points
- Afternoon: Shopping and nature park walks`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const aiText = response.text;

    // Isolate chunks cleanly via the section tags
    const budgetPart = aiText.match(/\[BUDGET\]([\s\S]*?)\[HOTELS\]/i)?.[1] || "";
    const hotelsPart = aiText.match(/\[HOTELS\]([\s\S]*?)\[ITINERARY\]/i)?.[1] || "";
    const itineraryPart = aiText.match(/\[ITINERARY\]([\s\S]*)$/i)?.[1] || aiText;

    const getBudgetVal = (regex, fallback) => {
      const m = budgetPart.match(regex);
      return m ? m[1].trim() : fallback;
    };

    const estimatedBudget = {
      total: getBudgetVal(/Total:\s*(.*)/i, "120-180"),
      transpo: getBudgetVal(/Transit:\s*(.*)/i, "10-20"),
      accommodation: getBudgetVal(/Accommodation:\s*(.*)/i, "70-120"),
      food: getBudgetVal(/Food:\s*(.*)/i, "40-60")
    };

    const hotels = [];
    const hotelLines = hotelsPart.split('\n');
    for (let line of hotelLines) {
      if (line.trim() && line.includes('-')) {
        const p = line.split('-');
        hotels.push({ name: p[0].replace(/^[*-\s]*/, '').trim(), details: p[1].trim() });
      }
    }
    if (hotels.length === 0) {
      hotels.push({ name: "Hotel Le Littré", details: "Comfortable boutique hotel stay" });
      hotels.push({ name: "Grand Hôtel de L'Univers", details: "Highly-rated central placement" });
    }

    const daysArray = parseItineraryDays(itineraryPart, targetDays);

    const newTrip = new Trip({
      destination,
      days: targetDays,
      budget,
      interests,
      itineraryText: itineraryPart.trim(),
      daysArray,
      hotels,
      estimatedBudget
    });
    await newTrip.save();

    res.status(201).json({ success: true, ...newTrip._doc, itinerary: itineraryPart.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server process vector fault' });
  }
});

app.patch('/api/trips/:id', async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, ...updatedTrip._doc, itinerary: updatedTrip.itineraryText });
  } catch (error) { res.status(500).json({ error: 'Server Sync Error' }); }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('SUCCESS: Connected to MongoDB'))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`SERVER LISTENING ON PORT: ${PORT}`));