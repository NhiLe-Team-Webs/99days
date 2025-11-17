// Test script to verify Zoom link rotation logic
const ZOOM_LINKS = [
  'https://zoom.us/j/91099405116?pwd=amLoPr1KDy7peEq4zOwPib1hVCGZ2i.1',
  'https://zoom.us/j/98009145941?pwd=9V0bg9PGrvyManbMyBNl904AOd7waC.1',
  'https://zoom.us/j/93932757317?pwd=PYQDif2aXZYO5W6nzGypyYlGQ0pJiY.1',
  'https://zoom.us/j/96202879776?pwd=2nT6J6kflA0GKOovqOoYdqoLnIfb0D.1',
  'https://zoom.us/j/95006619662?pwd=NkRXfIsVOrT8eWenvNtlQYTVp2o60i.1'
];

// Function to get the appropriate Zoom link based on date rotation
const getRotatingZoomLink = (date) => {
  // Start date for rotation (17-11-2025)
  const startDate = new Date('2025-11-17T00:00:00');
  
  // Calculate days difference
  const timeDiff = date.getTime() - startDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // Calculate index (modulo 5 for 5 links)
  const linkIndex = ((daysDiff % 5) + 5) % 5; // Ensure positive result
  
  return ZOOM_LINKS[linkIndex];
};

// Test the rotation for several consecutive days
console.log('Testing Zoom link rotation:');
console.log('================================');

// Test from 17-11-2025 to 23-11-2025 (7 days to cover full rotation)
for (let i = 0; i < 7; i++) {
  const testDate = new Date('2025-11-17T00:00:00');
  testDate.setDate(testDate.getDate() + i);
  
  const link = getRotatingZoomLink(testDate);
  const linkIndex = ZOOM_LINKS.indexOf(link);
  
  console.log(`${testDate.toISOString().split('T')[0]} - Link ${linkIndex + 1}: ${link}`);
}

console.log('\nExpected rotation pattern:');
console.log('17-11-25 - Link 1');
console.log('18-11-25 - Link 2');
console.log('19-11-25 - Link 3');
console.log('20-11-25 - Link 4');
console.log('21-11-25 - Link 5');
console.log('22-11-25 - Link 1');
console.log('23-11-25 - Link 2');