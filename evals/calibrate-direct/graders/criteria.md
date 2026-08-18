# Criteria

Pass only when the response:

- creates separate semantic root, yaw wrapper, and visual model nodes;
- applies gameplay position and heading only to the semantic root;
- applies authored yaw only to the yaw wrapper;
- applies uniform scale to the visual model;
- places the visual model at `[-center.x * scale, y, -center.z * scale]` in the authored frame;
- avoids combining yaw and pivot compensation on the same node.
