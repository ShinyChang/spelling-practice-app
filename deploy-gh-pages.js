// Simple script to help with GitHub Pages deployment
const ghpages = require('gh-pages');
const path = require('path');

console.log('Starting deployment to GitHub Pages...');

ghpages.publish(
  path.join(process.cwd(), 'build'),
  {
    branch: 'gh-pages',
    repo: 'https://github.com/ShinyChang/spelling-practice-app.git',
    message: 'Auto-deploy from script [ci skip]',
  },
  (err) => {
    if (err) {
      console.error('Deployment error:', err);
      process.exit(1);
    } else {
      console.log('Deployment successful!');
      console.log('Your app should be available at: https://shinychang.github.io/spelling-practice-app/');
      console.log('');
      console.log('Note: It might take a few minutes for the changes to propagate.');
      console.log('');
      console.log('If this is your first deployment, please check your repository settings:');
      console.log('1. Go to https://github.com/ShinyChang/spelling-practice-app/settings/pages');
      console.log('2. Make sure "Source" is set to the "gh-pages" branch');
      console.log('3. Click "Save"');
    }
  }
);
