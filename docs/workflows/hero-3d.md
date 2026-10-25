# Workflow: Hero / 3D Ghost

> **Obsolete:** the 3D ghost and parallax hero were removed in `31f3288` (editorial redesign). Kept for history only.

How the hero section renders the 3D ghost model, the parallax starry background, and the animated copy.

## Files involved

- `src/sections/Hero.jsx` — mounts the scene, camera, lights, controls
- `src/components/Ghost.jsx` — GLB model load + per-frame animation
- `src/components/ParallaxBackground.jsx` — 8-layer scroll parallax
- `src/components/HeroText.jsx` — hero copy (uses `FlipWords`)
- `src/components/Loader.jsx` — load progress overlay (`drei` `useProgress`)
- `src/components/FlipWords.jsx` — cycling word animation
- `public/models/big_boo_super_mario_world_custom.glb` — source model (Sketchfab, "Big Boo Super Mario World (Custom)" by StinkySkunk12)
- `public/assets/Starry_night_Layer_1..8.png` — background layers

## Data flow

1. **Scene setup (`Hero.jsx`)** — A `Canvas` is mounted full-viewport with `camera position [0,0,5]` and transparent alpha. Inside, a `Suspense` wrapper falls back to `Loader` (drei progress readout). Scene contents: `ambientLight` + `directionalLight`, the `<Ghost/>`, `OrbitControls` (zoom disabled), and `<Rig/>`. `isMobile` comes from `react-responsive` `useMediaQuery({ maxWidth: 853 })` and is passed into `Ghost`.

2. **Ghost model (`Ghost.jsx`)** — `useGLTF` loads `/models/big_boo_super_mario_world_custom.glb` (preloaded via `useGLTF.preload`). The first baked animation is played via `useAnimations`. The model starts off-screen (`yPosition = 12`) and drops to rest with a spring (`motion` `useSpring`, low damping/high bounce) after a 300ms timeout. A single `useFrame` then owns all transform updates each frame:
   - `position.y` = spring value + idle sine wobble
   - `position.x`/`scale`/`rotation.z` lerp toward per-viewport targets (mobile: center, scale 0.7, upright; desktop: x 2.5, scale 1, rotation -0.6), each modulated by a small sine
   - The group wrapper sets `rotation={[-PI/2, 0, 0]}` to stand the GLTF upright
   - Comment notes: this single-`useFrame` design is deliberate (a previous second hook fought the spring and pushed the model out of view).

3. **Camera rig (`Rig` in `Hero.jsx`)** — `useFrame` eases the camera position toward the mouse via `maath` `easing.damp3`, creating a subtle parallax-to-mouse effect. `OrbitControls` (no zoom) allows drag rotation.

4. **Background (`ParallaxBackground.jsx`)** — 8 absolutely-positioned PNG layers (Starry night). Each layer's vertical offset is a `useTransform` of `scrollYProgress` with increasing depth: layer 1 stays fixed (0%), layers 2–7 move progressively more (20% → 70%) — front layers scroll faster than far layers. Motion springs smooth the scroll value.

5. **Copy (`HeroText.jsx`)** — Staggered `motion` entrance animations reveal "Hi I'm Luis / A Developer Who Builds and Ships / {FlipWords} / From Scratch". `FlipWords` cycles through ["Web Platforms", "E-Commerce Sites", "Mobile Apps"] with per-letter blur/rise transitions and absolute-positioned exit. Two variants render: desktop (`md:` breakpoint) and mobile.

## Gotchas

- The GLB and PNGs are served from `public/`, so paths are root-relative (`/models/...`, `/assets/...`).
- `FlipWords`'s exit animation sets `position: absolute` — the hero copy must reserve space accordingly (staggered delays compensate).
- `Loader` shows inside the canvas via drei `<Html>`; it disappears once the GLB finishes loading.
- The ghost drop is timed (~300ms) to fire after scene mount; changing the suspense/load behavior affects the entrance timing.
