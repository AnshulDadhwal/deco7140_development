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
        item.classList.toggle("open");
      });
    });
  });
}

export { initAccordion };