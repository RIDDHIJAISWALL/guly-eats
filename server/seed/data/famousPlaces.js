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

  // Amritsar
  {
    name: 'Golden Temple (Sri Harmandir Sahib)',
    cityName: 'Amritsar',
    type: 'temple',
    description: 'The holiest shrine in Sikhism, famous for its stunning golden architecture and the massive langar (community kitchen).',
    address: 'Golden Temple Rd, Atta Mandi, Katra Ahluwalia, Amritsar',
    location: { type: 'Point', coordinates: [74.8765, 31.6200] },
    images: ['https://images.unsplash.com/photo-1517427845336-db18227b6862?w=500'],
    entryFee: 0,
    timings: { open: '24 Hours', close: '' },
    timeRequired: '2-3 hours'
  },
  {
    name: 'Jallianwala Bagh',
    cityName: 'Amritsar',
    type: 'monument',
    description: 'A historic public garden and memorial of national importance, preserving the memory of the 1919 massacre.',
    address: 'Golden Temple Rd, Amritsar',
    location: { type: 'Point', coordinates: [74.8801, 31.6207] },
    images: ['https://images.unsplash.com/photo-1623861214040-5e3b33406e23?w=500'],
    entryFee: 0,
    timings: { open: '6:30 AM', close: '7:30 PM' },
    timeRequired: '1 hour'
  },
  {
    name: 'Wagah Border',
    cityName: 'Amritsar',
    type: 'monument',
    description: 'The international border between India and Pakistan, famous for the daily Beating Retreat border ceremony.',
    address: 'Wagah Border, Amritsar',
    location: { type: 'Point', coordinates: [74.5768, 31.6046] },
    images: ['https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500'], // Fallback image
    entryFee: 0,
    timings: { open: '4:00 PM', close: '6:00 PM' },
    timeRequired: '3-4 hours'
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
  },
  {
    name: 'Red Fort',
    cityName: 'Delhi',
    type: 'heritage',
    description: 'A historic fort in the city of Delhi that served as the main residence of the Mughal Emperors.',
    address: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi',
    location: { type: 'Point', coordinates: [77.2410, 28.6562] },
    images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500'],
    entryFee: 35,
    timings: { open: '9:30 AM', close: '4:30 PM' },
    timeRequired: '2-3 hours'
  },
  {
    name: 'Qutub Minar',
    cityName: 'Delhi',
    type: 'monument',
    description: 'A UNESCO World Heritage Site, it is a 73-metre tall tapering tower of five storeys.',
    address: 'Mehrauli, New Delhi',
    location: { type: 'Point', coordinates: [77.1855, 28.5245] },
    images: ['https://images.unsplash.com/photo-1593444314144-8848c4a938c8?w=500'],
    entryFee: 35,
    timings: { open: '7:00 AM', close: '5:00 PM' },
    timeRequired: '1-2 hours'
  }
];
