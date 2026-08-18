# Criteria

Pass only when the response:

- imports entities from `@playcanvas/react`, components from `@playcanvas/react/components`, and
  hooks from `@playcanvas/react/hooks`;
- keeps `useModel` unconditional and handles its loading and error states;
- limits the declarative `Anim` shortcut to a confirmed single-clip asset;
- explains that current `Anim` assigns package clips to the same `animation` track;
- uses inspected clip names and an Engine animation state graph or script for multi-clip control.
