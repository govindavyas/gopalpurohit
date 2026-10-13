/**
 * Profile Loader & Data Binding Engine
 * Automatically applies data from profile.json to all pages and components.
 */

(function () {
  // Helper to extract nested object properties via dot notation: e.g. "contact.email"
  function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }

  // Update DOM elements with profile data
  function applyProfileData(data) {
    if (!data) return;
    window.CURRENT_PROFILE = data;

    // 1. Update text content for elements with [data-profile]
    document.querySelectorAll('[data-profile]').forEach(el => {
      const key = el.getAttribute('data-profile');
      const val = getNestedValue(data, key);
      if (val !== undefined) {
        el.textContent = val;
      }
    });

    // 2. Update Phone links (tel:)
    if (data.contact && data.contact.phoneRaw) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.setAttribute('href', 'tel:' + data.contact.phoneRaw);
      });
    }

    // 3. Update Email links (mailto:)
    if (data.contact && data.contact.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        const currentHref = a.getAttribute('href');
        const queryParams = currentHref.includes('?') ? currentHref.substring(currentHref.indexOf('?')) : '';
        a.setAttribute('href', 'mailto:' + data.contact.email + queryParams);
      });
    }

    // 4. Update WhatsApp links (wa.me)
    if (data.contact && data.contact.whatsappNumber) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        const href = a.getAttribute('href');
        const textMatch = href.match(/\?text=(.*)/);
        const query = textMatch ? '?text=' + textMatch[1] : '';
        a.setAttribute('href', 'https://wa.me/' + data.contact.whatsappNumber + query);
      });
    }

    // 5. Update Google Maps links
    if (data.location && data.location.mapsUrl) {
      document.querySelectorAll('[data-profile-maps]').forEach(a => {
        a.setAttribute('href', data.location.mapsUrl);
      });
    }

    // 6. Update Schema.org JSON-LD structured data in <head>
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        if (schema['@type'] === 'LocalBusiness') {
          if (data.business?.name) schema.name = data.business.name;
          if (data.contact?.phone) schema.telephone = data.contact.phoneRaw || data.contact.phone;
          if (data.contact?.email) schema.email = data.contact.email;
          if (data.location) {
            schema.address = schema.address || {};
            if (data.location.street) schema.address.streetAddress = data.location.street;
            if (data.location.city) schema.address.addressLocality = data.location.city;
            if (data.location.state) schema.address.addressRegion = data.location.state;
            if (data.location.postalCode) schema.address.postalCode = data.location.postalCode;
          }
          schemaScript.textContent = JSON.stringify(schema, null, 2);
        }
      } catch (err) {
        // Silently skip if parse fails
      }
    }

    // Dispatch event so any custom modules can react
    window.dispatchEvent(new CustomEvent('profileDataLoaded', { detail: data }));
  }

  // Load profile data: try fetch('profile.json'), fallback to window.PROFILE_DATA
  function loadProfile() {
    // Determine path to profile.json (handle root or subfolder)
    const jsonPath = 'profile.json';

    fetch(jsonPath, { cache: 'no-store' })
      .then(resp => {
        if (!resp.ok) throw new Error('Network response was not ok');
        return resp.json();
      })
      .then(data => {
        applyProfileData(data);
      })
      .catch(() => {
        // Fallback for file:/// protocol or offline execution
        if (window.PROFILE_DATA) {
          applyProfileData(window.PROFILE_DATA);
        }
      });
  }

  // Execute once DOM is ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProfile);
  } else {
    loadProfile();
  }
})();
