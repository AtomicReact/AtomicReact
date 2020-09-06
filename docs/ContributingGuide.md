# Contributing Guide

## Documentation

1. Install [Docsify CLI](https://docsify.js.org/#/quickstart?id=quick-start)

   ```bash
   npm i docsify-cli -g
   ```

2. Fork the [**AtomicReact Repository**](https://github.com/AtomicReact/AtomicReact)

3. Clone your forked repository

   ```bash
   git clone <your-forked-repository-url>
   ```

4. Go to cloned repository root dirs and initialize the [Docsify](https://docsify.js.org/#/quickstart?id=initialize)

   ```bash
   docsify serve ./docs
   ```

   **Notes:**

   - All documentation is in **docs** dir

   ```text
    ├───docs        <<<---
    │   ├───assets
    │   └───docsify
    ├───init
    ├───modules
    └───tools
   ```

   - You can see on **http://localhost:3000** all changes made on documentation

5. After you make your changes, commit and push to your forked repository

   ```bash
   git add .
   ```

   ```bash
   git commit -m " what you do in documentation "
   ```

   ```bash
   git push
   ```

6. Create a **pull request** from your repository forked to [**AtomicReact Repository**](https://github.com/AtomicReact/AtomicReact) with **documentation** label
