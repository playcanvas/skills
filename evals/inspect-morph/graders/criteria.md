# Criteria

Pass only when the response:

- uses the bundled `inspect-glb` script before choosing calibration transforms;
- distinguishes decoded bounds source from default, morph, or bind pose;
- does not describe animated morph bounds as exact for every animation frame;
- requires runtime confirmation for animated morphs and skins;
- uses a scratch GLB and the pinned glTF Transform `copy` command for Draco or Meshopt;
- does not recommend `optimize` or modify the shipping asset.
