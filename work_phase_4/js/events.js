/**
 * EVENTS PAGE
 * JavaScript for handling event submission form with visual feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Events page loaded - Hardcoded version');
  
  // Initialize the event submission form
  initializeEventForm();
});

/**
 * Initializes the event submission form with visual feedback
 */
function initializeEventForm() {
  const form = document.getElementById('event-form');
  const feedback = document.getElementById('event-form-feedback');
  
  if (!form || !feedback) {
    console.error('Event form elements not found');
    return;
  }
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values for validation
    const formData = new FormData(form);
    const eventName = formData.get('event_name');
    const location = formData.get('location');
    const eventType = formData.get('event_type');
    const eventDate = formData.get('event_date');
    const eventTime = formData.get('event_time');
    const description = formData.get('description');
    const organiser = formData.get('organiser');
    
    // Check if all required fields are filled
    if (!eventName || !location || !eventType || !eventDate || !eventTime || !description || !organiser) {
      feedback.textContent = 'Please fill in all required fields.';
      feedback.className = 'form-feedback feedback-error';
      return;
    }
    
    // Show loading state
    feedback.textContent = 'Submitting your event...';
    feedback.className = 'form-feedback feedback-loading';
    
    // Simulate API submission with a delay
    setTimeout(() => {
      // Success feedback
      feedback.textContent = 'Event submitted successfully!';
      feedback.className = 'form-feedback feedback-success';
      
      // Reset form after 2 seconds
      setTimeout(() => {
        form.reset();
        feedback.textContent = '';
        feedback.className = 'form-feedback';
        
        // Optional: Scroll to top to show success
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
    }, 1500); // Simulate 1.5 second processing time
  });
  
  // Add visual feedback for file input
  const fileInput = document.getElementById('event_photo');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
        if (fileSize > 10) {
          alert('File size exceeds 10MB. Please choose a smaller image.');
          fileInput.value = '';
        } else {
          console.log(`File selected: ${file.name} (${fileSize}MB)`);
        }
      }
    });
  }
}