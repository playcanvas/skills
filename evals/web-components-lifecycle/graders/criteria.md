# Criteria

Pass only when the response:

- registers the installed Web Components module;
- keeps modules and assets as direct children of `pc-app` and scene content under `pc-scene`;
- uses `pc-model` for the container asset rather than rebuilding its hierarchy manually;
- uses space-separated vectors and degrees for rotations;
- awaits `whenReady('pc-app')` before accessing the Engine application;
- limits imperative Engine access to behavior with no suitable declarative element.
