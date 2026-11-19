# Lawson at Mount Fuji · Interactive 3D Store

A browser-based 3D store where you can walk around, open refrigerator doors, pick up products, and drag to inspect them. The project includes the complete store model, first-person navigation, and basket interactions.

Packaged models and product textures are included. This repository publishes the source code and runtime assets; a live website has not been deployed.

## Features

- 3,880 product instances, 1,724 shelf positions, and 846 product variants across 12 display zones.
- Pick up front-row products, rotate them freely by dragging, return them to the shelf, or add them to the basket.
- Inspected products use a separate depth layer to avoid shelf occlusion while preserving their own internal depth ordering.
- Short transitions for picking up, returning, and adding products to the basket, with simplified animations when reduced motion is enabled.
- Eight refrigerator doors in C1/C4 support clicking or pressing E when prompted. Closed doors block product selection through the glass, and door interactions account for player clearance and movement collisions.
- Products behind the front row become selectable as items are removed.
- Products are batched by material while retaining per-item raycasting and application data.
- Orbit around the store outside, then enter smoothly through the front door without removing the roof.
- Move with WASD or arrow keys and drag to look around, with collision boundaries for the store and six central shelf groups.
- The static store, roof, and shelf products load separately, totaling approximately 32 MiB of GLB assets.
- Shelves use shared 256px front/back texture atlases; higher-resolution front/back WebP textures load on demand for nearby and inspected products.

## Local Setup

Install Node.js and pnpm, then run:

```bash
git clone https://github.com/zherunliu/lawson.git
cd lawson
pnpm install
pnpm dev
```

Open `http://127.0.0.1:5173/`.

The packaged models and product textures are included in `public/`.

## Controls

- Enter the store: click the entry button.
- Move and look: use WASD or arrow keys to move; drag to look around.
- Inspect a product: pick up a front-row item and drag to rotate it; press Esc to return it.
- Basket: add a product to the basket while inspecting it.
- Refrigerator doors: click a door or press E when the open/close prompt appears.

On-screen hints use concise English. Product packaging and names retain their original language.

## Tests and Build

```bash
pnpm test
pnpm build
```

Build output is written to `dist/`. Run `pnpm preview` to preview the production build locally; this does not deploy it to the internet.

## Known Limitations

- Automated tests do not replace visual inspection of every product from all angles.
- GPU texture compression with KTX2/Basis and view- or zone-based asset unloading remain future work.
- Mobile performance and interaction testing are not yet complete.
