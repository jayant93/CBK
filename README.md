# 🚀 CKB – Check Karo Badshaho 👑

Bright Gen-Z LinkHub using React + Firebase Realtime Database.

## Quick start
1. Extract the project and open in terminal.
2. Run `npm install`.
3. In Firebase Console: create a project, enable **Authentication -> Phone**, add test phone numbers (for dev), and create **Realtime Database** (start in test mode for dev).
4. Replace firebase config in `src/firebase.js` with your project's config.
5. `npm start` to run locally.

## Notes
- Save profile -> gets shareable link `/u/:phone`.
- WhatsApp numbers are auto-converted to `https://wa.me/<number>`.
- Email becomes `mailto:` link.
- After saving, click **Copy Link** to copy your public profile link to clipboard.
