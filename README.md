# Hyderabad Healthcare Atlas

A maps-first healthcare directory for Hyderabad, built with Next.js, TypeScript, Leaflet and OpenStreetMap/Overpass.

## Features
- Searchable medical directory and interactive map for hospitals, clinics/doctors, pharmacies, diagnostics, dental care, blood banks, emergency services, nursing/care centres and other mapped healthcare facilities.
- Locality/area filtering, category filters, search across facility tags, opening-hours filter and sorting.
- Facility details shown inside the application, including mapped contact information, hours, speciality, beds, accessibility, emergency and payment tags when available.
- Directions open Google Maps. Browsing and facility details remain inside HealthAtlas.
- Hospital rating fields are displayed only if a numeric rating is explicitly present in source tags. OpenStreetMap does not provide a consistent public review-rating dataset, so many or most hospitals may show “No verified rating”; no scores are fabricated.
- Live results depend on the completeness of community-mapped OpenStreetMap data and Overpass availability. The map is not an official or complete medical directory.

## Run locally
```bash
npm install
npm run dev
npm run build
```

## Data and attribution
Facility data is queried from public Overpass API endpoints and map tiles from OpenStreetMap. Attribution: https://www.openstreetmap.org/copyright. Satellite tiles are provided by Esri and their contributors. Public endpoints may rate-limit requests; use a compliant backend/cache for production-scale traffic. Confirm emergency contacts, opening hours and medical services directly before relying on them.
