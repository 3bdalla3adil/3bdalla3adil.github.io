# ClinicFlow Google Apps Script Backend

This backend creates a Google Sheets database and exposes a small JSON API for the GitHub Pages ClinicFlow frontend.

## Setup

1. Open Google Apps Script and create a standalone project.
2. Copy `Code.gs` from this folder into the Apps Script project.
3. Run `setupClinicFlow()` once and approve the requested Google permissions.
4. Deploy **Deploy -> New deployment -> Web app**.
5. For the public patient-booking MVP use **Execute as: Me** and **Who has access: Anyone**.
6. Copy the generated `/exec` URL into the frontend API configuration.

The public API exposes only active doctors, available slots, and appointment creation. It does not expose the patient registry, consultation notes, prescriptions, payments, or the full appointment database.

## Security warning

This is an MVP/demo architecture. Do not use it for real sensitive medical records without proper authentication, authorization, audit logging, backups, encryption, retention policies, and an applicable healthcare/privacy compliance review.
