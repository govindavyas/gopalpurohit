/**
 * Profile Loader & Data Binding Engine
 * Applies the canonical profile.json data to all pages and components.
 */

(function () {
  // Helper to extract nested object properties via dot notation: e.g. "contact.email"
  function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    if (path === 'location.formatted' && obj.location) {
      const location = obj.location;
      return [
        location.street,
        [[location.city, location.state].filter(Boolean).join(', '), location.postalCode]
          .filter(Boolean)
          .join(' '),
        location.country
      ].filter(Boolean).join(', ');
    }
    if (path === 'location.mapsUrl' && obj.location) {
      const location = obj.location;
      const address = [
        location.street,
        location.city,
        location.state,
        location.postalCode,
        location.country
      ].filter(Boolean).join(' ');
      return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    }
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  }

  function getPhoneDigits(phone) {
    return phone ? String(phone).replace(/\D/g, '') : '';
  }

  // Update DOM elements with profile data
  function applyProfileData(data) {
    if (!data || !data.contact || !data.contact.phone) {
      throw new Error('profile.json must define contact.phone');
    }
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
    const phoneDigits = getPhoneDigits(data.contact.phone);
    document.querySelectorAll('a[href^="tel:"], a[data-profile-link="tel"]').forEach(a => {
      a.setAttribute('href', `tel:${phoneDigits}`);
    });

    // 3. Update Email links (mailto:)
    if (data.contact.email) {
      document.querySelectorAll('a[href^="mailto:"], a[data-profile-link="email"]').forEach(a => {
        const currentHref = a.getAttribute('href');
        const queryParams = currentHref.includes('?') ? currentHref.substring(currentHref.indexOf('?')) : '';
        a.setAttribute('href', 'mailto:' + data.contact.email + queryParams);
      });
    }

    // 4. Update WhatsApp links (wa.me)
    if (phoneDigits) {
      document.querySelectorAll('a[href*="wa.me"], a[data-profile-link="whatsapp"]').forEach(a => {
        const href = a.getAttribute('href');
        const textMatch = href.match(/\?text=(.*)/);
        const query = textMatch ? '?text=' + textMatch[1] : '';
        a.setAttribute('href', `https://wa.me/${phoneDigits}${query}`);
      });
    }

    // 5. Update Google Maps links
    document.querySelectorAll('[data-profile-maps]').forEach(a => {
      a.setAttribute('href', getNestedValue(data, 'location.mapsUrl'));
    });

    // 6. Update profile-driven image and social preview URLs
    document.querySelectorAll('[data-profile-src]').forEach(el => {
      const src = getNestedValue(data, el.getAttribute('data-profile-src'));
      if (src !== undefined) el.setAttribute('src', src);
    });
    document.querySelectorAll('[data-profile-content]').forEach(el => {
      const content = getNestedValue(data, el.getAttribute('data-profile-content'));
      if (content !== undefined) el.setAttribute('content', content);
    });

    // 7. Update Schema.org JSON-LD structured data in <head>
    const schemaScript = document.querySelector('script[type="application/ld+json"]');
    if (schemaScript) {
      try {
        const schema = JSON.parse(schemaScript.textContent);
        if (schema['@type'] === 'LocalBusiness') {
          if (data.business?.name) schema.name = data.business.name;
          if (data.contact?.phone) schema.telephone = data.contact.phone;
          if (data.contact?.email) schema.email = data.contact.email;
          if (data.images?.hero) schema.image = data.images.hero;
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
        console.error('Unable to update LocalBusiness structured data.', err);
      }
    }

    // Dispatch event so any custom modules can react
    window.dispatchEvent(new CustomEvent('profileDataLoaded', { detail: data }));
  }

  // profile.json is the single source of truth; serve the site over HTTP(S).
  function loadProfile() {
    fetch(new URL('profile.json', window.location.href), { cache: 'no-store' })
      .then(resp => {
        if (!resp.ok) throw new Error(`Request failed with status ${resp.status}`);
        return resp.json();
      })
      .then(data => {
        applyProfileData(data);
      })
      .catch(err => {
        console.error('Unable to load profile.json. Run this site from an HTTP(S) server.', err);
      });
  }

  // Execute once DOM is ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProfile);
  } else {
    loadProfile();
  }
})();
