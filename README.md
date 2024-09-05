# Repo for reproducing svelte bug

This is a repo for reproducing svelte 5 false positive warning in firefox about `ownership_invalid_mutation`.

<!-- ![ErrorScreenshot]() -->

## Steps to reproduce

Both `app` and `dummy-lib` repos were created with `npm create svelte@latest`

### Setup `dummy-lib`

```bash
cd dummy-lib
npm i
npm run build
```

### Setup `app`

```bash
cd app
npm i
```

### Reproduce bug

- Start app with `npm run dev`
- Open app in firefox
- Click on `Snippet from App` text
- Check devtools for warning
