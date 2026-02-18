# Deploying SwitchSprint

Since this is a static React application, you can deploy it for free on many platforms. Here are the two easiest methods.

## Option 1: Netlify Drop (Easiest)

1.  **Build the project** (if you haven't already):
    run `npm run build` in your terminal.
    This creates a `dist` folder in your project directory.
2.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3.  Drag and drop the `dist` folder onto the page.
4.  That's it! Netlify will give you a live URL.

## Option 2: Vercel (Recommended for updates)

1.  Install Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  Run the deploy command:
    ```bash
    vercel
    ```
    *Note: A `vercel.json` configuration file is already included to handle routing correctly.*

3.  Follow the prompts (hit Enter for defaults).
    -   Set up and deploy? [Y]
    -   Which scope? [Select your account]
    -   Link to existing project? [N]
    -   Project name? [switch-sprint]
    -   In which directory? [./]
    -   Want to modify settings? [N]
4.  Your site will be live!

## Option 3: GitHub Pages

1.  Initialize Git (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a repo on GitHub and push your code.
3.  In your project, install `gh-pages`:
    ```bash
    npm install gh-pages --save-dev
    ```
4.  Add these scripts to `package.json`:
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
    ```
5.  Run `npm run deploy`.
