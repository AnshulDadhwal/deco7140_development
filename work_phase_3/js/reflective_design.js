/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { fetchGetData } from './modules/getData.js';

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/';
const STUDENT_NUMBER = 's4738601';
const ZONE_ID = 'b9e6a7cc';

/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 */
let communityData = null;

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 */

/**
 * Creates a community member card element
 * @param {Object} member - The member data object from the API
 * @returns {HTMLElement} - The constructed card element
 */
function createMemberCard(member) {
  // Create the main card container
  const card = document.createElement('article');
  card.className = 'community-card';
  
  // Build the card HTML using template literals
  card.innerHTML = `
    <div class="card-image">
      <img 
        src="${member.photo || 'assets/images/default-avatar.png'}" 
        alt="Photo of ${member.name}"
        loading="lazy"
      />
    </div>
    <div class="card-content">
      <h3 class="card-title">${member.name}</h3>
      <p class="card-message">${member.message || 'No message provided.'}</p>
      <div class="card-meta">
        <span class="member-date">Joined: ${formatDate(member.created_at)}</span>
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Formats a date string into a readable format
 * @param {string} dateString - ISO date string from the API
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-AU', options);
}

/**
 * Fetches and displays community member data
 */
async function loadCommunityContent() {
  // Get the container where we'll display the cards
  const container = document.getElementById('community-list');
  
  if (!container) {
    console.error('Community list container not found');
    return;
  }
  
  // Show loading state
  container.innerHTML = '<p class="loading-message">Loading community members...</p>';
  
  try {
    // Fetch the data from the API
    const data = await fetchGetData(API_URL, {
      'student_number': STUDENT_NUMBER,
      'uqcloud_zone_id': ZONE_ID
    });
    
    // Check if data was retrieved successfully
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No community members found yet.</p>
          <p>Be the first to join and share your story!</p>
        </div>
      `;
      return;
    }
    
    // Store the data globally if needed elsewhere
    communityData = data;
    
    // Clear the container
    container.innerHTML = '';
    
    // Add a heading for the section
    const heading = document.createElement('h3');
    heading.textContent = 'Our Community Members';
    heading.className = 'community-heading';
    container.appendChild(heading);
    
    // Create a wrapper for the cards
    const cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'community-cards-grid';
    
    // Create and add a card for each community member
    data.forEach(member => {
      const card = createMemberCard(member);
      cardsWrapper.appendChild(card);
    });
    
    container.appendChild(cardsWrapper);
    
    console.log(`Successfully loaded ${data.length} community members`);
    
  } catch (error) {
    // Handle any errors that occur
    console.error('Error loading community content:', error);
    container.innerHTML = `
      <div class="error-state">
        <p class="text-danger">Unable to load community members at this time.</p>
        <p>Please try refreshing the page or check back later.</p>
      </div>
    `;
  }
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */

// When the page fully loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Reflective Design page loaded');
  
  // Load and display community content
  loadCommunityContent();
});