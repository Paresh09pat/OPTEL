// Blog Category ID to Display Name Mapping
export const blogCategoryNames = {
  2: 'Cars and Vehicles',
  3: 'Comedy',
  4: 'Economics and Trade',
  5: 'Education',
  6: 'Entertainment',
  7: 'Movies & Animation',
  8: 'Gaming',
  9: 'History and Facts',
  10: 'Live Style',
  11: 'Natural',
  12: 'News and Politics',
  13: 'People and Nations',
  14: 'Pets and Animals',
  15: 'Places and Regions',
  16: 'Science and Technology',
  17: 'Sport',
  18: 'Travel and Events',
  19: 'Other',
};

// Get display name for a category ID
export const getCategoryName = (categoryId) => {
  return blogCategoryNames[categoryId] || 'Unknown Category';
};

