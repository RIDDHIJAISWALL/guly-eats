export const famousPlaces = [
  // Varanasi
  {
    name: 'Dashashwamedh Ghat',
    cityName: 'Varanasi',
    type: 'heritage',
    description: 'The most spectacular and lively ghat in Varanasi, famous for its grand evening Ganga Aarti.',
    address: 'Dashashwamedh Ghat Rd, Varanasi',
    location: { type: 'Point', coordinates: [83.0069, 25.3065] },
    images: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500'],
    entryFee: 0,
    timings: { open: '24 Hours', close: '' },
    timeRequired: '1-2 hours'
  },
  {
    name: 'Kashi Vishwanath Temple',
    cityName: 'Varanasi',
    type: 'temple',
    description: 'One of the most famous Hindu temples dedicated to Lord Shiva.',
    address: 'Vishwanath Gali, Varanasi',
    location: { type: 'Point', coordinates: [83.0107, 25.3109] },
    images: ['https://images.unsplash.com/photo-1627896157734-45fb3018ceee?w=500'],
    entryFee: 0,
    timings: { open: '4:00 AM', close: '11:00 PM' },
    timeRequired: '2-3 hours'
  },

  // Lucknow
  {
    name: 'Bara Imambara',
    cityName: 'Lucknow',
    type: 'monument',
    description: 'An architectural marvel featuring the Bhool Bhulaiya (labyrinth) and incredible vaulted halls.',
    address: 'Husainabad Trust Rd, Lucknow',
    location: { type: 'Point', coordinates: [80.9130, 26.8621] },
    images: ['https://images.unsplash.com/photo-1598285741634-8c8cf7c5fbab?w=500'],
    entryFee: 50,
    timings: { open: '6:00 AM', close: '5:00 PM' },
    timeRequired: '2-3 hours'
  },

  // Delhi
  {
    name: 'India Gate',
    cityName: 'Delhi',
    type: 'monument',
    description: 'A 42m-high war memorial standing proudly in the heart of New Delhi.',
    address: 'Rajpath, India Gate, New Delhi',
    location: { type: 'Point', coordinates: [77.2295, 28.6129] },
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500'],
    entryFee: 0,
    timings: { open: '24 Hours', close: '' },
    timeRequired: '1 hour'
  }
];
