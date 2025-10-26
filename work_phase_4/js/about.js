/**
 * IMPORTS
 * Keep track of external modules being used
 */
import { initAccordion } from './modules/accordion.js';

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

/**
 * Adds smooth scroll behavior for anchor links
 */
function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Skip if it's just "#"
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * EVENT LISTENERS
 * The code that runs when a user interacts with the page
 */

// When the page fully loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('About page loaded');
  
  // Initialize smooth scrolling
  initializeSmoothScroll();
  
  // Initialize accordion functionality
  initAccordion('.accordion');
});