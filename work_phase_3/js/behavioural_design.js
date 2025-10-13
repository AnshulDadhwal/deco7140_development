/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { postFormData } from './modules/postFormData.js';

/**
 * CONSTANTS
 * Define values that don't change e.g. page titles, URLs, etc.
 */

/**
 * VARIABLES
 * Define values that will change e.g. user inputs, counters, etc.
 */

/**
 * FUNCTIONS
 * Group code into functions to make it reusable
 */
function initializeComponents() {
  // Initialize form handling
  initializeFormSubmission();
}

function initializeFormSubmission() {
  const form = document.getElementById('community-form');
  const feedback = document.getElementById('form-feedback');

  // Check if form exists on the page
  if (!form || !feedback) {
    console.log('Form not found on this page');
    return;
  }

  // Add submit event listener
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Show loading state
    feedback.textContent = 'Submitting...';

    // API endpoint from documentation
    const apiEndpoint = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/';

    // Required headers - REPLACE THESE WITH YOUR ACTUAL VALUES
    const { success, data } = await postFormData(form, apiEndpoint, {
      'student_number': 's4738601',
      'uqcloud_zone_id': 'b9e6a7cc',
    });

    if (success) {
      // Success feedback
      feedback.textContent = data.message;
      form.reset();
    } else {
      // Error feedback
      feedback.textContent = data.message || 'Something went wrong.';
    }
  });
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */

// When the page fully loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('Behavioural Design page loaded');
  
  // Initialize page components
  initializeComponents();
});