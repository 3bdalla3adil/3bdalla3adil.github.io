# Portfolio editing guide

This site is published on GitHub Pages and uses [Pages CMS](https://pagescms.org/) as a visual, Git-based editor. No coding is needed for routine content changes.

## First-time CMS setup

1. Open [Pages CMS](https://app.pagescms.org/) and sign in with the GitHub account that owns this portfolio.
2. Install/authorize the Pages CMS GitHub App for repository `3bdalla3adil/3bdalla3adil.github.io`.
3. Select this repository and the `master` branch after the CMS configuration has been merged.
4. Use **Portfolio projects** to add, edit, reorder, feature, or remove project cards. Add a title, short description, tags, optional cover image, and a link.
5. Use **Site settings** to update the SEO description and public contact/social links.
6. Use **Case studies** to add or update the challenge, solution, outcome, tags, image and related-project link. The case-study cards appear automatically on the homepage; the expandable details show the full story.

## Adding a project

- Use a unique, lowercase ID such as `clinicflow-v2`.
- Fill in both English and Arabic fields when possible.
- Upload a compressed WebP/JPEG cover image (ideally under 300 KB) through the image field.
- Use a public HTTPS URL or an existing site-relative path for the project link.
- Save changes. Pages CMS commits to GitHub; GitHub Pages then publishes the update.

## Contact form

The contact form uses FormSubmit with a hidden honeypot and CAPTCHA enabled. The first submission may require confirming the receiving mailbox. Confirm the activation email before announcing the form publicly. The recipient is controlled by **Site settings → Contact email**. If the endpoint is not activated, visitors can still use the direct email link shown beside the form.

## Deployment and ownership

The public website remains static; there is no e-commerce, database, or server-side application to maintain. Content changes are versioned in GitHub. GitHub Pages publishes the website from the configured repository branch.

## Important checks before launch

- Confirm the contact form by submitting a test message and completing the mailbox activation step.
- Verify the website is publicly accessible after merging.
- Check mobile navigation, project images, PDF resume download, and English/Arabic switching.
- Keep project descriptions free of client-confidential details.
