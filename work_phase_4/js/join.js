/**
 * IMPORTS
 */
import { postFormData } from './modules/postFormData.js';

/**
 * CONSTANTS
 */
const API_URL = 'https://damp-castle-86239-1b70ee448fbd.herokuapp.com/decoapi/community/';
const STUDENT_NUMBER = 's4738601';
const ZONE_ID = 'b9e6a7cc';

/**
 * FUNCTIONS
 */

/**
 * Validates file size for photo upload
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateFileSize(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  return file.size <= maxSize;
}

/**
 * Initializes the join form
 */
function initializeJoinForm() {
  const form = document.getElementById('community-form');
  const feedback = document.getElementById('form-feedback');
  const photoInput = document.getElementById('photo');
  
  if (!form || !feedback) {
    console.error('Form elements not found');
    return;
  }
  
  // Validate photo file size on selection
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      
      if (file && !validateFileSize(file)) {
        feedback.textContent = 'Photo file size must be less than 10MB. Please choose a smaller file.';
        feedback.className = 'form-feedback feedback-error';
        photoInput.value = ''; // Clear the input
      } else if (file) {
        // Clear any previous error
        feedback.textContent = '';
        feedback.className = 'form-feedback';
      }
    });
  }
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate photo size again before submission
    const photoFile = photoInput?.files[0];
    if (photoFile && !validateFileSize(photoFile)) {
      feedback.textContent = 'Photo file size must be less than 10MB.';
      feedback.className = 'form-feedback feedback-error';
      return;
    }
    
    // Show loading state
    feedback.textContent = 'Submitting...';
    feedback.className = 'form-feedback feedback-loading';
    
    // Disable submit button to prevent double submission
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }
    
    // Submit the form
    const { success, data } = await postFormData(form, API_URL, {
      'student_number': STUDENT_NUMBER,
      'uqcloud_zone_id': ZONE_ID,
    });
    
    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
    }
    
    if (success) {
      // Success feedback
      feedback.textContent = data.message || 'Thanks for joining the community!';
      feedback.className = 'form-feedback feedback-success';
      
      // Reset form
      form.reset();
      
    } else {
      // Error feedback
      let errorMessage = data.message || 'Something went wrong. Please try again.';
      
      // Check for specific field errors
      if (data.name) {
        errorMessage = 'Name: ' + (Array.isArray(data.name) ? data.name.join(' ') : data.name);
      } else if (data.email) {
        errorMessage = 'Email: ' + (Array.isArray(data.email) ? data.email.join(' ') : data.email);
      } else if (data.photo) {
        errorMessage = 'Photo: ' + (Array.isArray(data.photo) ? data.photo.join(' ') : data.photo);
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
  console.log('Join page loaded');
  
  // Initialize the join form
  initializeJoinForm();
});