# Security Policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately through
[GitHub Security Advisories](https://github.com/GautamVhavle/spotify-readme/security/advisories/new).
You will get an acknowledgement within a few days, and I will keep you updated as the
issue is investigated and fixed. Credit is given in the advisory unless you prefer to
stay anonymous.

## Supported versions

This project is deployed from `main`. Fixes land there and are released by redeploying;
older commits are not patched.

## Threat model

Each deployment is single-tenant: it serves exactly one Spotify account, owned by whoever
deployed it. The public surface is three unauthenticated `GET` endpoints.

### What the service protects

| Concern                | Mitigation                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Credential exposure    | The client ID, secret and refresh token are read from server-side environment variables only. They are never embedded in the SVG, the JSON response, or an error message.                       |
| SVG / CSS injection    | Colour parameters are matched against a strict hex pattern and discarded if they do not fit. Track titles, artist names and album names are XML-escaped before being written into the document. |
| SSRF via artwork       | Album art is only fetched over HTTPS from an allow-list of Spotify CDN hostnames, with a response size cap.                                                                                     |
| Resource exhaustion    | Numeric parameters are clamped to fixed ranges, artwork responses are capped at 2 MB, and the in-memory caches are bounded.                                                                     |
| Information disclosure | Runtime errors are logged to the platform and replaced with a generic card. Stack traces and upstream messages are never rendered.                                                              |
| Unexpected methods     | Non-`GET` requests are rejected with `405`.                                                                                                                                                     |

### What is intentionally public

The `/`, `/small` and `/json` endpoints expose the track title, artist, album, artwork and
Spotify link of the account that deployed the service. That is the entire point of the
project. If you consider your listening history sensitive, do not deploy this.

### Your responsibilities as a deployer

- Never commit `.env`. It is git-ignored, and the repository contains no credentials.
- Store the three variables in your hosting provider's encrypted environment settings.
- The OAuth scopes requested are read-only: `user-read-currently-playing` and
  `user-read-recently-played`. Do not grant more.
- Rotate by regenerating the client secret in the Spotify dashboard and re-running
  `npm run authorize`. Changing your Spotify password also revokes existing refresh tokens.
- If a token leaks, revoke the app's access at
  [Spotify → Apps](https://www.spotify.com/account/apps/) immediately.

## Dependencies

There are no runtime dependencies. The only development dependencies are TypeScript,
Prettier and Vercel's type definitions, and Dependabot watches them monthly.
