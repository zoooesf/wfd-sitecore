# TIDAL SitecoreAI Starter Kit

This repository contains a Next.js Starter Kit for SitecoreAI Development. It is intended to get developers up and running quickly with a new front end project that is integrated with SitecoreAI.

[Deploying SitecoreAI](https://doc.sitecore.com/xmc/en/developers/xm-cloud/deploying-xm-cloud.html)

Here's a quick overview of the major folders and their purpose:

  - `/headapps`:
  Contains starter front-end applications. Each subfolder is a working app
    * nextjs-starter: [README](https://github.com/Sitecore/xmcloud-starter-js/tree/main/headapps/nextjs-starter/README.md) 

  - `/local-containers`:
  Contains Docker-related files for local development environments.

  - `/authoring`: 
    The authoring folder is where Sitecore content items are defined and stored for deployment. These items include:
    * Templates: located under /items — defines the structure of content items used in the application..
    * Powershell, Modules, etc. Organized by namespace under items/items, useful for modular development and deployment.
    * Modules: Each module has its own .module.json file (e.g., nextjs-starter.module.json) to define what items it includes and where they should be deployed in the Sitecore content tree.

  - `xmcloud.build.json`: 
    This is the primary configuration file for building and deploying rendering hosts in your SitecoreAI environment.

    Key Sections:
      * renderingHosts: Defines one or more front-end apps to build. Each entry includes:

      * path: where the app is located (e.g., ./examples/kit-nextjs-skate-park)

      * nodeVersion: Node.js version used during build

      * jssDeploymentSecret: Deployment auth key for JSS

      * enabled: Whether the rendering host is active

      * buildCommand / runCommand: Custom scripts for build/start

      * postActions: Actions that run after a successful deployment, such as warming up the CM server or triggering reindexing.

      * authoringPath: Path to the folder containing Sitecore item definitions (default is ./authoring).

## GitHub Template

This Github repository is a template that can be used to create your own repository. To get started, click the `Use this template` button at the top of the repository.

### Prerequisites

- Access to an SitecoreAI Environment
- [Node.js LTS](https://nodejs.org/en/)

### Getting Started Guide

For developers new to SitecoreAI you can follow the Getting Started Guide on the [Sitecore Documentation Site](https://doc.sitecore.com/xmc) to get up and running with SitecoreAI. This will walk you through the process of creating a new SitecoreAI Project, provisioning an Environment, deploying the NextJs Starter Kit, and finally creating your first Component.

### Running the Next.js Starter Kit

>  **Note:** Please refer to the `README.md` of the specific headapp you’re working with for detailed setup instructions.
> The following outlines the general steps to run the app locally:
- Log into the SitecoreAI Deploy Portal, locate your Environment and select the `Developer Settings` tab.
- Ensure that the `Preview` toggle is enabled.
- In the `Local Development` section, click to copy the sample `.env` file contents to your clipboard.
- Create a new `.env.local` file in the `./headapps/nextjs-starter` folder of this repository and paste the contents from your clipboard.
- Run the following commands in the root of the repository to start the NextJs application:
  ```bash
  cd headapps/nextjs-starter
  npm install
  npm run dev
  ```
- You should now be able to access your site on `http://localhost:3000` and see your changes in real-time as you make them.

## Disconnected offline development

It is possible to mock a small subset of the SitecoreAI Application elements to enable offline development. This can allow for a disconnected development experience, however it is recommend to work in the default connected mode.

You can find more information about how setup the offline development experience [here](./local-containers/README.md)

## Development Workflow

This repository ensures the `main` branch is always clean, deployable, and production-ready.

### Quick Overview

- **`main` branch**: Always clean and deployable (never commit directly). Tied to the production Vercel environment.
- **`dev` branch**: Validation layer where PRs are merged and tested. Tied to the development Vercel environment.
- **Other branches**: Created from dev`, PRs target `dev`

### Key Requirements

1. ✅ Always create feature branches from the latest `dev`
2. ✅ Create PRs to `dev` (not `main`)
3. ✅ Do not use **Squash and merge**
4. ✅ Ensure your branch is based on the latest `dev` before creating a PR
5. ✅ PR validation runs automatically (lint, build, type-check)
6. ✅ After merge to `dev`, CI validates the build; `main` is manually updated via merge commits periodically

### For Repository Maintainers

🔒 **[Branch Protection Setup Guide](.github/BRANCH-PROTECTION-SETUP.md)** - Configure GitHub branch protection rules to enforce the workflow.

## AI-Assisted Development

This repository includes comprehensive AI guidance files to help maintain consistent code quality and follow SitecoreAI best practices across all starter applications:

- **Claude Code Guide** (`CLAUDE.md`) - Comprehensive guide for Claude Code and AI assistants with project architecture, coding standards, and best practices
- **Cursor AI Rules** (`.cursor/rules/`) - Automatically provide context and enforce patterns when using Cursor AI
- **Windsurf IDE Rules** (`.windsurfrules`) - Comprehensive coding standards, folder structure, and best practices for Windsurf's agentic IDE workflows
- **GitHub Copilot Instructions** (`copilot-instructions.md`) - Detailed development patterns and component guidelines for GitHub Copilot
- **LLM Guidance** (`LLMs.txt`) - Concise guidance for various AI assistants covering architecture principles and safety rules

These files ensure consistent development patterns whether you're using Claude Code, Cursor AI, Windsurf IDE, GitHub Copilot, or other AI coding assistants. See the [Contributing Guide](CONTRIBUTING.md#ai-assisted-development) for details on using AI assistance with this project.
