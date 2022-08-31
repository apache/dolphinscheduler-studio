# Contributing to the DolphinScheduler Studio

Thanks for taking the time to contribute !
You can start by reading this guidelines.

## Setup

Install the dependencies

```shell
pnpm install
pnpm dev
```

Please don't forget to setup your IDE with `eslint` and `prettier`.

## Project structure

- **studio** contains studio component.
  - **component** contains generic components used inside the studio component.
  - **hooks** contains generic hooks.
  - **locales** contains locales.
  - **pages** contains page components for vue-router.
  - **service** contains axios initialization and apis

- **src** contains a separate project that references studio.
  - **assets** contains generic assets used inside the separate project.
  - **component** contains generic components.
  - **locales** contains vue-il8n initialization and locales.
  - **router** contains vue-router initialization and routers.
  - **views** contains page components for vue-router.

## Issue reports

A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search** &mdash; check if the issue has already been
   reported.

2. **Check if the issue has been fixed** &mdash; try to reproduce it using the
   latest `main` branch in the repository.
  
3. **Add attachments** &mdash; add photos or gifs.

A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report. What is
your environment? What steps will reproduce the issue? What browser(s) and OS
experience the problem? What would you expect to be the outcome? All these
details will help people to fix any potential bugs.