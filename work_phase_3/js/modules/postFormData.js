/* Post Form Data Module */

/**
 * Posts form data to an API endpoint
 * @param {HTMLFormElement} formEl - The form element to submit
 * @param {string} endpointUrl - The API endpoint URL
 * @param {Object} customHeaders - Additional headers (e.g., student_number, uqcloud_zone_id)
 * @returns {Object} - Returns {success: boolean, data: Object}
 */
const postFormData = async (formEl, endpointUrl, customHeaders = {}) => {
  const formData = new FormData(formEl);

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: customHeaders,
      body: formData,
    });

    const data = await response.json();

    return {
      success: response.ok && data.status === 'success',
      data,
    };
  } catch (error) {
    return {
      success: false,
      data: { message: 'Network or server error.', error },
    };
  }
};

export { postFormData };