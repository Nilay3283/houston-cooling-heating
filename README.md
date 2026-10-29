# Houston Cooling & Heating

Website for Houston Cooling & Heating (HVAC, heating, cooling and electrical services, Houston, TX).
React + TypeScript + Vite + Tailwind CSS + Framer Motion + Three.js (React Three Fiber / Drei).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # typecheck + production build into dist/
```

## Before launch

1. **Connect the service request form.** Create a free form at [formspree.io](https://formspree.io) using the business email,
   then set `VITE_FORMSPREE_ENDPOINT` (see `.env.example`, or the repository variable used by the GitHub Pages workflow).
   Until then the form never pretends to send; it points visitors to call, text or email.
2. **Add Texas license numbers** in `src/config/business.ts` (`licenses.hvac`, `licenses.electrical`).
   Texas (TDLR) rules require HVAC and electrical contractors to show license numbers in advertising.
3. **Add the verified Facebook/Instagram URLs** in `src/config/business.ts`.
4. **Replace gallery photos** in `src/components/Sections.tsx` with real job photos (`isStock: false`).
   Stock photos are labelled "Illustrative photo".
5. **Add genuine reviews** (with permission) to `REVIEWS` in `src/components/Sections.tsx`.
6. **Review the Privacy Policy and Terms** text in `src/components/Footer.tsx`.
7. If you move to a custom domain, update the URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml`.

## 3D performance

- The Three.js bundle is lazy-loaded, so text, buttons and the phone number appear immediately over a photo backdrop.
- Phones get lower pixel ratio, no shadows and fewer particles. Data-saver and very low-memory devices get static fallbacks.
- Scenes pause when scrolled off-screen, and animation stops for visitors who prefer reduced motion.
- If WebGL is unavailable or a scene fails, the page keeps working with photo fallbacks and the accessible list of home systems.
