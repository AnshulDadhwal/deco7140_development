/**
 * Accordion Module
 * Provides functionality for interactive accordion components
 */
function initAccordion(containerSelector) {
  const accordions = document.querySelectorAll(containerSelector);
  accordions.forEach((container) => {
    const headers = container.querySelectorAll(".accordion-header");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains("open");
        
        // Toggle the open class
        item.classList.toggle("open");
        
        // Update aria-expanded attribute for accessibility
        header.setAttribute("aria-expanded", !isOpen);
      });
    });
  });
}

export { initAccordion };