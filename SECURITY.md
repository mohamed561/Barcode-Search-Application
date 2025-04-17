# Security Policy

## Supported Versions

The BSA Barcode Search APP is actively maintained, and security updates are provided for the latest version. Ensure you’re using the most recent release to benefit from security fixes.

| Version | Supported |
| --- | --- |
| 2.0 | ✅ |
| &lt; 2.0 | ❌ |

## Reporting a Vulnerability

We take the security of the BSA Barcode Search APP seriously. If you discover a security vulnerability, please report it responsibly by following these steps:

1. **Do Not Disclose Publicly**: Avoid sharing the vulnerability in public forums (e.g., GitHub issues, social media) until it has been addressed to protect users.
2. **Email Us**: Send a detailed report to mohamedtroufi01@gmail.com. Include:
   - A description of the vulnerability (e.g., XSS in search input).
   - Steps to reproduce the issue.
   - Potential impact (e.g., data exposure, app crash).
   - Any suggested fixes, if applicable.
3. **Expect a Response**: We’ll acknowledge your email within 48 hours and work with you to assess and resolve the issue. We aim to release a fix within 14 days for critical vulnerabilities, depending on complexity.
4. **Coordinated Disclosure**: Once the vulnerability is fixed, we’ll coordinate with you to disclose it responsibly, crediting you (if desired) in release notes or a security advisory.

## Scope

This security policy applies to:

- The core source code of the BSA Barcode Search APP (e.g., `src/components/BarcodeSearch.js`, `src/App.js`).
- Included sample data files (`src/data/database.js`, `src/data/constantDatabase.js`).
- Documentation in this repository (e.g., `README.md`).

**Out of Scope**:

- The `easter-egg.gif` asset, as it is currently disabled and excluded pending copyright confirmation.
- User-provided EAN code databases, which are the user’s responsibility.
- Third-party dependencies (e.g., `jsbarcode`, React), though we’ll address vulnerabilities by updating to secure versions.

## Security Best Practices

To keep your instance of the BSA Barcode Search APP secure:

- **Update Dependencies**: Regularly run `npm update` to ensure `jsbarcode`, React, and other dependencies are on the latest secure versions. Check for known vulnerabilities using `npm audit`.
- **Sanitize Inputs**: The app sanitizes search inputs to prevent XSS, but verify this if deploying publicly.
- **Secure Deployment**: If hosting online, use HTTPS, set secure HTTP headers (e.g., Content-Security-Policy), and limit API access to trusted sources.
- **Monitor Logs**: Watch for unusual activity (e.g., repeated failed searches) that might indicate an attack.

## Credits

We appreciate the security community’s help in keeping the BSA Barcode Search APP safe. Contributors reporting valid vulnerabilities will be acknowledged in our release notes, unless anonymity is requested.

Thank you for helping us maintain a secure project!