require('dotenv').config();
const axios = require('axios');

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
});

let adminToken = '';

async function adminLogin() {
  try {
    const res = await API.post('/auth/admin/login', {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    adminToken = res.data.data.token;
    API.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    console.log('Admin login successful!');
  } catch (err) {
    console.error('Admin login failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

async function seedEvents() {
  const events = [
    {
      name: 'Football Finals',
      description: 'The grand finale of the football tournament.',
      day: '2025-08-01',
      time: '10:00 AM',
      venue: 'Main Ground',
      branchTags: ['Mechanical', 'Electrical'], // 2 branches for team event
      gameType: 'Football',
      category: 'Boys',
      eventType: 'Team',
      points: {
        first: 5,
        second: 3,
        third: 1
      },
      status: 'Upcoming'
    },
    {
      name: 'Basketball Semis',
      description: 'Semi-final match for basketball.',
      day: '2025-07-28',
      time: '2:00 PM',
      venue: 'Court 2',
      branchTags: ['Electrical', 'Civil'], // 2 branches for team event
      gameType: 'Basketball',
      category: 'Girls',
      eventType: 'Team',
      points: {
        first: 4,
        second: 2,
        third: 1
      },
      status: 'Active'
    },
    {
      name: 'Chess Open',
      description: 'Open chess tournament.',
      day: '2025-07-20',
      time: '11:00 AM',
      venue: 'Hall A',
      branchTags: ['Computer', 'Mechanical', 'Electrical', 'Civil'], // 4 branches for individual event
      gameType: 'Chess',
      category: 'Boys',
      eventType: 'Individual',
      points: {
        first: 3,
        second: 2,
        third: 1
      },
      status: 'Concluded'
    }
  ];
  for (const event of events) {
    try {
      await API.post('/events', event);
      console.log('Added event:', event.name);
    } catch (err) {
      console.error('Error adding event:', event.name, err.response?.data || err.message);
    }
  }
}

// Fetch all events and return a map of name -> _id
async function fetchEventIds() {
  try {
    const res = await API.get('/events');
    const map = {};
    for (const event of res.data.data) {
      map[event.name] = event._id;
    }
    return map;
  } catch (err) {
    console.error('Error fetching events for photo seeding:', err.response?.data || err.message);
    return {};
  }
}

async function seedPhotos(eventIds) {
  const photos = [
    {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      caption: 'Epic Football Match',
      eventName: 'Football Finals'
    },
    {
      url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
      caption: 'Basketball Action',
      eventName: 'Basketball Semis'
    },
    {
      url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      caption: 'Chess Tournament',
      eventName: 'Chess Open'
    }
  ];
  for (const photo of photos) {
    const eventId = eventIds[photo.eventName];
    if (!eventId) {
      console.error('No eventId found for photo:', photo.caption);
      continue;
    }
    try {
      await API.post('/photos', { url: photo.url, caption: photo.caption, eventId });
      console.log('Added photo:', photo.caption);
    } catch (err) {
      console.error('Error adding photo:', photo.caption, err.response?.data || err.message);
    }
  }
}

async function seedAnnouncements() {
  const announcements = [
    {
      title: 'Welcome to Urjaa!',
      body: 'Let the games begin! Check the schedule for your events.',
      date: '2025-07-15'
    },
    {
      title: 'Photo Gallery Updated',
      body: 'New photos from the basketball semis are now live!',
      date: '2025-07-28'
    }
  ];
  for (const ann of announcements) {
    try {
      await API.post('/announcements', ann);
      console.log('Added announcement:', ann.title);
    } catch (err) {
      console.error('Error adding announcement:', ann.title, err.response?.data || err.message);
    }
  }
}

async function main() {
  await adminLogin();
  await seedEvents();
  const eventIds = await fetchEventIds();
  await seedPhotos(eventIds);
  await seedAnnouncements();
  console.log('Dummy data seeding complete!');
}

main(); 