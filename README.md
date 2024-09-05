# Repo for reproducing svelte bug

This is a repo for reproducing svelte 5 false positive warning in firefox about `ownership_invalid_mutation`.

![WarningScreenshot](https://github.com/TUTOR03/svelte-firefox-false-positive-wrong-mutation-warning/raw/master/assets/warning_screenshot.png)

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

## Why it happens

In fact `getPropsCreator` from `dummy-lib` is just a higher order function that creates the `$state` rune with name `data` and returns `createProps` function that creates object with `onclick` handler modifying `data`.  
If we copy-past it directly to `app`, there will be no warnings.

Lets check how this warning is created by `check_ownership` function from [svelte source code](https://github.com/sveltejs/svelte/blob/main/packages/svelte/src/internal/client/dev/ownership.js). It is trying to get the component and check if it differs from metadata component. The component is obtained by parsing the `new Error().stack` and matching filenames from it with values in `boundaries`.

For example head of my `new Error().stack` looks like this:  
\* Dropped first 4 svelte internals lines

```plaintext
changeData@http://localhost:5173/node_modules/.vite/deps/dummy-lib.js?v=a5a66ca1:62:5

onclick@http://localhost:5173/node_modules/.vite/deps/dummy-lib.js?v=a5a66ca1:67:9

handle_event_propagation@http://localhost:5173/node_modules/.vite/deps/chunk-43KEDLR5.js?v=a5a66ca1:128:23

EventListener.handleEvent*event_handle@http://localhost:5173/node_modules/.vite/deps/chunk-LVTCNQTG.js?v=a5a66ca1:494:14

delegate@http://localhost:5173/node_modules/.vite/deps/chunk-43KEDLR5.js?v=a5a66ca1:72:7

set_attributes@http://localhost:5173/node_modules/.vite/deps/chunk-EJ2MPTJ6.js?v=a5a66ca1:1429:19

App/children</<@http://localhost:5173/src/lib/App.svelte:19:42

update_reaction@http://localhost:5173/node_modules/.vite/deps/chunk-HU3FE7VV.js?v=a5a66ca1:1568:23

update_effect@http://localhost:5173/node_modules/.vite/deps/chunk-HU3FE7VV.js?v=a5a66ca1:1663:36

create_effect@http://localhost:5173/node_modules/.vite/deps/chunk-HU3FE7VV.js?v=a5a66ca1:991:20

render_effect@http://localhost:5173/node_modules/.vite/deps/chunk-HU3FE7VV.js?v=a5a66ca1:1106:10

template_effect@http://localhost:5173/node_modules/.vite/deps/chunk-HU3FE7VV.js?v=a5a66ca1:1114:10
...
```

As we see it starts from `changeData` function from `dummy-lib`. And there is a value in `boundaries` for `http://localhost:5173/node_modules/.vite/deps/dummy-lib.js?v=a5a66ca1`, because `dummy-lib` exports `Dummy.svelte` component. So `get_component` function will skip this line and return component for `http://localhost:5173/src/lib/App.svelte` file. If we copy paste `getPropsCreator` the stack will be nearly the same except of the file name. Also there will be no value in `boundaries`. Due to this, `get_component` will return null at line [57](https://github.com/sveltejs/svelte/blob/main/packages/svelte/src/internal/client/dev/ownership.js#L57) as expected in the comment above this line.

## Conclusion

If our app is suitable for conditions:

- There is a package installed that exports any `.svelte` component and high order function, that creates a function for modifying an underlying `$state` rune
- This hog is used in some componet and return is passed to snippet created in parent component.

Then we will have warning on every `$state` rune update.
