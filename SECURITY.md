# Security Policy

## Scope and support

This policy covers the Express website in this repository, especially `src/index.js`, the EJS templates, and the static files in `src/public`. The package manifest reports version `1.0.0`; the repository does not define a release support window or supported-version policy.

## Reporting a vulnerability

There is no dedicated security email or private reporting form documented in this repository. Please contact the project maintainer through a known private channel. Avoid posting exploit details publicly or submitting them through the website contact form. That form sends messages to the configured business and developer inboxes and writes the submitted fields to application logs.

Include the affected route or file, the impact, and concise reproduction steps. Do not include real customer data, credentials, or secrets in a report.

## Current application behavior

- The site is an Express/EJS landing page with a contact form. Contact submissions are sent through Gmail SMTP to `RRMEMAIL` and `DEVEMAIL`; the app does not persist them in the MySQL files under `src/database`.
- The submitted name, email address, phone number, and message are currently written to standard application logs and inserted directly into outgoing HTML email without HTML escaping.
- The contact route has no application-level field validation, rate limiting, or CSRF protection. The app does not configure dedicated security headers or spam protection in its Express setup.
- `src/public` contains third-party storefront and analytics code. The landing page can load scripts or resources from Shopify, Google, Meta, and other external providers. Those providers may receive browser or analytics data according to their own behavior and policies.
- `.env` contains SMTP credentials and is excluded by `.gitignore`. Do not commit `.env` or paste its values into issues or security reports.
- The app sets Express `trust proxy` to `1`. Deployments should only place it behind a trusted proxy that overwrites forwarding headers appropriately. TLS termination, proxy configuration, and production log access are deployment concerns not defined in this repository.

This inventory describes the current source; it is not a security audit or a claim that the application meets a particular security standard.
