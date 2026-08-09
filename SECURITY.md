# Security Policy & Vulnerability Reporting

The NMLL Studio Web team takes the security of our platform, user workspace state, and serverless backend seriously. We appreciate the efforts of security researchers and open-source contributors who help us keep our platform safe.

---

## Supported Versions

We actively maintain and provide security updates for the following versions of NMLL Studio Web:

| Version | Supported | Notes |
| :--- | :---: | :--- |
| **1.4.x** (Latest) | ✅ Yes | Active production release on Vercel |
| **1.3.x** | ⚠️ Critical Only | Legacy branch support |
| **< 1.3.0** | ❌ No | Please upgrade to the latest version |

---

## Reporting a Vulnerability

If you discover a security vulnerability or security bug in NMLL Studio Web, please follow these reporting guidelines:

### 🔒 Reporting Channel
**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please report vulnerabilities privately using one of the following methods:
1. **GitHub Private Vulnerability Reporting**: Submit a private advisory directly via the **Security** tab on our repository: [https://github.com/shivvx/nmll-concept/security/advisories](https://github.com/shivvx/nmll-concept/security/advisories)
2. **Email Security Team**: Send details to:
   - **Wiroxa Security**: `security@wiroxa.dev`
   - **Lead Maintainer**: `shivprv@icloud.com`

---

## Vulnerability Information to Include

To help us assess and resolve the issue quickly, please include:
- **Type of Vulnerability**: (e.g., XSS, API Token Exposure, Serverless Execution Injection, CORS misconfiguration).
- **Step-by-Step Proof of Concept (PoC)**: Detailed reproduction steps or script.
- **Affected Components**: Specific source files, API routes, or environment dependencies.
- **Impact Assessment**: Explanation of potential risks to users or infrastructure.

---

## Response & Disclosure Timeline

- **Initial Acknowledgment**: Within 24-48 hours.
- **Triage & Assessment**: Within 3 business days.
- **Patch & Fix Release**: Within 7 business days for high/critical vulnerabilities.
- **Public Disclosure**: We coordinate public disclosure with researchers after a patch has been deployed to production.

---

## Security Best Practices for Self-Hosters

When running your own instance of NMLL Studio Web:
1. Never commit `.env` or `.env.local` files containing `GEMINI_API_KEY` to public repositories.
2. Keep dependencies updated using `npm audit` and dependabot alerts.
3. Ensure CORS policies in `server.ts` are strictly scoped to your domain in production environments.

Thank you for helping keep NMLL Studio Web secure!
