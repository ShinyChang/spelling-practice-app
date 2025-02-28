# Setting up GitHub Pages for Spelling Practice App

This guide provides step-by-step instructions for setting up GitHub Pages deployment for this repository.

## Option 1: Manual Deployment (Simplest)

1. **Install the gh-pages package (if not already installed)**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update your package.json scripts**:
   Make sure your package.json contains these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...other scripts...
   }
   ```

3. **Add homepage to package.json**:
   ```json
   "homepage": "https://shinychang.github.io/spelling-practice-app",
   ```

4. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**:
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the `gh-pages` branch as the source
   - Click Save

Your app should now be available at: https://shinychang.github.io/spelling-practice-app

## Option 2: Automated Deployment with GitHub Actions

1. **Create GitHub Actions workflow file**:
   Create a file at `.github/workflows/deploy.yml` with the following content:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   permissions:
     contents: write

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
         - name: Checkout code
           uses: actions/checkout@v3
           
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: 16
             cache: 'npm'
             
         - name: Install Dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: build # The folder the action should deploy
             branch: gh-pages # The branch the action should deploy to
   ```

2. **Add homepage to package.json** (if not already done):
   ```json
   "homepage": "https://shinychang.github.io/spelling-practice-app",
   ```

3. **Push the changes to your repository**:
   The GitHub Action will automatically build and deploy your app whenever you push to the main branch.

4. **Configure GitHub Pages**:
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the `gh-pages` branch as the source
   - Click Save

Your app should now be available at: https://shinychang.github.io/spelling-practice-app and will automatically update when you push changes to the main branch.

## Troubleshooting

If you encounter any issues with the deployment:

1. Check the GitHub Actions tab in your repository to see if the workflow is running correctly
2. Make sure you've set the correct permissions for GitHub Pages in your repository settings
3. The initial deployment may take a few minutes to become available
4. If you're using React Router, you may need to configure it for GitHub Pages by using `basename={process.env.PUBLIC_URL}` in your Router component
