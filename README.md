# Netflix Hub - Streaming Portal 🍿

An elegant, fully-featured Netflix-inspired streaming portal. 

## 🎬 Main Features
- **Cinematic Hero Carousel**: High-quality trailer spotlight, matching algorithms, dynamic genres, and clean CTA actions.
- **Episodic Contents Navigation**: Detailed drawer for TV Series, Anime, & Trailers containing interactive Season and Episode lists.
- **Sleek Horizontal Categorized Rows**: Direct-scroll rows for Trending items, Top anime hits, Action Movies, and TV Shows.
- **Unified Global Search**: Instantly filter your favorite titles, genres, descriptions, and tags.
- **Interactive Local Favorites List ("My List")**: Handcrafted offline favorites bookmarking persisted across browser sessions utilizing `localStorage`.
- **Responsive Layout**: Designed first for touch and custom desktop viewing with an elegant Netflix-style color scheme.

---

## 🛠️ Development & Local Run

To run the application locally on your computer:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```

3. **Build optimized production code**:
   ```bash
   npm run build
   ```

---

## 🚀 GitHub Pages Automated Deployment

This repository includes an automated GitHub Actions deployment workflow. Whenever you push code to the `main` or `master` branch:

1. A GitHub runner will checkout your repository.
2. Build the optimized production assets for React/Vite.
3. Publish and deploy them automatically to a `gh-pages` branch.

### 🌐 Setup Instructions:
1. Go to your repository settings on GitHub.
2. Navigate to **Pages** (under the Code and automation section).
3. Under **Build and deployment**, ensure your **Source** is set to **Deploy from a branch**.
4. Choose the **`gh-pages`** branch and the **`/ (root)`** folder.
5. Save, and your live site will be ready at: \
   `https://<your-username>.github.io/<your-repository-name>/`
