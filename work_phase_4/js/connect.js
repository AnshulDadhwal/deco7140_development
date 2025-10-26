/**
 * IMPORTS
 */
import { fetchGetData } from './modules/getData.js';
import { postFormData } from './modules/postFormData.js';

/**
 * CONSTANTS
 */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/genericchat/';
const STUDENT_NUMBER = 's4738601';
const ZONE_ID = 'b9e6a7cc';

/**
 * VARIABLES
 */
let discussionData = null;

/**
 * FUNCTIONS
 */

/**
 * Formats a date string into a readable format
 * @param {string} dateString - Date string from the API (e.g., "2025-05-18 15:20")
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return 'Recently';
  
  try {
    // Parse the date string (format: "2025-05-18 15:20")
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    const date = new Date(year, month - 1, day, hour, minute);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Return relative time
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    // Return formatted date for older posts
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-AU', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Creates a discussion item element
 * @param {Object} post - The discussion post object from the API
 * @returns {HTMLElement} - The constructed discussion item element
 */
function createDiscussionItem(post) {
  const item = document.createElement('article');
  item.className = 'discussion-item';
  
  item.innerHTML = `
    <h3 class="discussion-title">${post.chat_post_title}</h3>
    <p class="discussion-excerpt">${post.chat_post_content}</p>
    <p class="discussion-meta">Posted by ${post.person_name} • ${formatDate(post.chat_date_time)}</p>
  `;
  
  return item;
}

/**
 * Loads and displays discussion posts
 */
async function loadDiscussions() {
  const container = document.getElementById('discussion-list');
  
  if (!container) {
    console.error('Discussion list container not found');
    return;
  }
  
  // Show loading state
  container.innerHTML = '<p class="loading-message">Loading discussions...</p>';
  
  try {
    // Fetch the data from the API (headers ARE needed for GET too!)
    const data = await fetchGetData(API_URL, {
      'student_number': STUDENT_NUMBER,
      'uqcloud_zone_id': ZONE_ID,
    });
    
    // Debug: Log the raw data
    console.log('Raw API data:', data);
    console.log('Number of posts:', data ? data.length : 0);
    
    // Check if data was retrieved successfully
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No discussions yet.</p>
          <p>Be the first to start a conversation!</p>
        </div>
      `;
      return;
    }
    
    // Store the data
    discussionData = data;
    
    // Debug: Check what zone_id we're looking for
    console.log('Looking for zone_id:', ZONE_ID);
    console.log('Sample post:', data[0]);
    
    // Filter to only show posts from our website
    const filteredData = data.filter(post => post.website_code === ZONE_ID);
    
    // Debug: Log filtered results
    console.log('Filtered posts:', filteredData.length);
    
    // If no posts from our site, show empty state
    if (filteredData.length === 0) {
      // Show ALL posts temporarily for debugging
      console.warn('No posts match zone_id. Showing all posts for debugging.');
      container.innerHTML = `
        <div class="empty-state">
          <p>⚠️ Debug Mode: No posts match your zone_id (${ZONE_ID})</p>
          <p>Total posts in database: ${data.length}</p>
          <p>Showing all posts below for debugging...</p>
        </div>
      `;
      
      // Display all posts regardless of zone_id for debugging
      data.slice(0, 6).forEach(post => {
        const item = createDiscussionItem(post);
        container.appendChild(item);
      });
      return;
    }
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => {
      return new Date(b.chat_date_time) - new Date(a.chat_date_time);
    });
    
    // Clear the container
    container.innerHTML = '';
    
    // Display up to 6 most recent posts
    const recentPosts = filteredData.slice(0, 6);
    
    recentPosts.forEach(post => {
      const item = createDiscussionItem(post);
      container.appendChild(item);
    });    
  } catch (error) {
    console.error('Error loading discussions:', error);
    container.innerHTML = `
      <div class="error-state">
        <p class="text-danger">Unable to load discussions at this time.</p>
        <p>Please try refreshing the page or check back later.</p>
      </div>
    `;
  }
}

/**
 * Initializes the discussion form
 */
function initializeDiscussionForm() {
  const form = document.getElementById('discussion-form');
  const feedback = document.getElementById('form-feedback');
  const modal = document.getElementById('discussion-modal');
  const openButton = document.getElementById('start-discussion-btn');
  const closeButton = document.getElementById('close-modal');
  const cancelButton = document.getElementById('cancel-btn');
  
  if (!form || !feedback || !modal || !openButton) {
    console.log('Discussion form elements not found');
    return;
  }
  
  // Open modal
  openButton.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal function
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    form.reset();
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  };
  
  // Close modal with X button
  closeButton.addEventListener('click', closeModal);
  
  // Close modal with Cancel button
  if (cancelButton) {
    cancelButton.addEventListener('click', closeModal);
  }
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    feedback.textContent = 'Posting your discussion...';
    feedback.className = 'form-feedback feedback-loading';
    
    // Submit the form
    const { success, data } = await postFormData(form, API_URL, {
      'student_number': STUDENT_NUMBER,
      'uqcloud_zone_id': ZONE_ID,
    });
    
    if (success) {
      // Success feedback
      feedback.textContent = 'Discussion posted successfully!';
      feedback.className = 'form-feedback feedback-success';
      
      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal();
        
        // Reload discussions to show the new post
        loadDiscussions();
      }, 2000);
    } else {
      // Error feedback
      let errorMessage = 'Something went wrong. Please try again.';
      
      // Check for specific error messages
      if (data.chat_post_title) {
        errorMessage = 'Title: ' + data.chat_post_title.join(' ');
      } else if (data.chat_post_content) {
        errorMessage = 'Content: ' + data.chat_post_content.join(' ');
      } else if (data.person_name) {
        errorMessage = 'Name: ' + data.person_name.join(' ');
      } else if (data.message) {
        errorMessage = data.message;
      }
      
      feedback.textContent = errorMessage;
      feedback.className = 'form-feedback feedback-error';
    }
  });
}

/**
 * EVENT LISTENERS
 */

// When the page fully loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Connect page loaded');
  
  // Load and display discussions
  loadDiscussions();
  
  // Initialize the discussion form
  initializeDiscussionForm();
});