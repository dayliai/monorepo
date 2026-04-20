const ALL_SUGGESTIONS = [
  // Mobility
  'Walking support', 'Transfer help', 'Stair safety', 'Wheelchair options',
  'Balance aids', 'Fall prevention', 'Grip support', 'Standing assistance',
  // Bathing / Hygiene
  'Shower safety', 'Toilet support', 'Grooming aids', 'Oral care',
  'Hair washing', 'Skin care', 'Bathroom access', 'Hygiene tools',
  // Dressing
  'Dressing help', 'Sock aids', 'Shoe options', 'Button assistance',
  'Zipper support', 'Adaptive clothing', 'Bra alternatives', 'Winter dressing',
  // Eating / Cooking
  'Meal prep', 'Easy cooking', 'Jar opening', 'Adaptive utensils',
  'Drinking aids', 'Kitchen safety', 'One-handed cooking', 'Microwave meals',
  // Home / Household
  'Cleaning help', 'Laundry tips', 'Bed making', 'Home access',
  'Closet organization', 'Dish washing', 'Trash management', 'Pet care',
  // Cognition / Focus
  'Memory support', 'Focus tools', 'Routine planning', 'Task reminders',
  'Visual schedules', 'Decision support', 'ADHD strategies', 'Executive function',
  // Communication / Technology
  'Speech support', 'Phone accessibility', 'Computer access', 'Smart home',
  'Voice control', 'Text alternatives', 'Alert systems', 'Communication boards',
  // Sensory / Comfort
  'Noise reduction', 'Light sensitivity', 'Sensory tools', 'Pain relief',
  'Comfort seating', 'Sleep support', 'Temperature control', 'Calm spaces',
  // Transportation / Community
  'Travel support', 'Public transit', 'Car transfers', 'Parking access',
  'Store navigation', 'Appointment planning', 'Community resources', 'Errand help',
  // Work / School
  'Desk setup', 'Work accommodations', 'School supports', 'Note taking',
  'Study tools', 'Time management', 'Energy pacing', 'Remote work',
  // Caregiving
  'Care planning', 'Daily routines', 'Transfer training', 'Medication reminders',
  'Respite options', 'Safety checks', 'Behavior support', 'Care coordination',
  // Emotion-friendly / conversational
  "I'm struggling", 'Need support', 'Feeling overwhelmed', 'Make easier',
  'Save energy', 'Reduce pain', 'Stay independent', 'Find alternatives',
]

export function getRandomSuggestions(count = 3): string[] {
  const shuffled = [...ALL_SUGGESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
