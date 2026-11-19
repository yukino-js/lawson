import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { FullStore } from "./scene/FullStore";
import { useGameStore } from "./state/game-store";

const buttonFocus =
  "focus-visible:[outline:3px_solid_var(--color-checkout)] focus-visible:outline-offset-[3px]";

const paperEdge =
  "after:absolute after:h-2 after:bg-[linear-gradient(135deg,var(--color-snow)_5px,transparent_0)] after:bg-size-[10px_10px] after:bg-repeat-x after:content-['']";

const peekPanel =
  "border-ink/13 bg-snow/92 absolute bottom-19 left-1/2 -translate-x-1/2 rounded-[14px] border px-4.5 py-4 shadow-[0_18px_50px_rgb(35_76_90/14%)]";

const label =
  "text-lawson text-[10px] font-extrabold tracking-[0.12em] uppercase";

function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active || progress >= 100) return null;
  return (
    <div
      className="bg-snow text-ink absolute top-1/2 left-1/2 z-3 grid min-w-40 -translate-x-1/2 -translate-y-1/2 rounded-[14px] px-5.5 py-4.5 text-center shadow-[0_18px_60px_rgb(35_76_90/16%)]"
      role="status"
      aria-live="polite"
    >
      <span className="text-lawson text-[11px] tracking-[0.14em]">Loading</span>
      <strong className="mt-1.5 font-mono text-[22px]">
        {Math.round(progress)}%
      </strong>
    </div>
  );
}

function Interface() {
  const hovered = useGameStore((state) => state.hovered);
  const viewMode = useGameStore((state) => state.viewMode);
  const selectedId = useGameStore((state) => state.selectedId);
  const selectedProduct = useGameStore((state) => state.selectedProduct);
  const cart = useGameStore((state) => state.cart);
  const telemetry = useGameStore((state) => state.telemetry);
  const requestInspectExit = useGameStore((state) => state.requestInspectExit);
  const inspectExit = useGameStore((state) => state.inspectExit);
  const doorHint = useGameStore((state) => state.doorHint);
  const toggleDoor = useGameStore((state) => state.toggleDoor);
  const enterStore = useGameStore((state) => state.enterStore);
  const returnOutside = useGameStore((state) => state.returnOutside);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="pointer-events-none absolute inset-0">
      <header className="text-ink absolute inset-x-0 top-0 flex items-start justify-end p-[clamp(20px,3vw,42px)]">
        <div
          className="flex gap-1.5 font-mono text-[10px]"
          aria-label="Render stats"
        >
          <span className="border-ink/14 bg-snow/72 rounded-full border px-2.25 py-1.75 backdrop-blur-[10px]">
            {telemetry.fps || "—"} FPS
          </span>
          <span className="border-ink/14 bg-snow/72 rounded-full border px-2.25 py-1.75 backdrop-blur-[10px] max-[720px]:hidden">
            {telemetry.calls} draws
          </span>
          <span className="border-ink/14 bg-snow/72 rounded-full border px-2.25 py-1.75 backdrop-blur-[10px] max-[720px]:hidden">
            {Math.round(telemetry.triangles / 1000)}k triangles
          </span>
        </div>
      </header>

      {viewMode === "exterior" ? (
        <section
          className={`border-lawson bg-snow/92 pointer-events-auto absolute bottom-[clamp(30px,7vh,72px)] left-[clamp(20px,4vw,58px)] grid w-[min(330px,calc(100vw-40px))] gap-3 border-t-4 p-4.5 shadow-[0_22px_60px_rgb(35_76_90/18%)] after:right-4.5 after:-bottom-2 after:left-4.5 ${paperEdge} max-[720px]:right-5`}
          aria-label="Store entrance"
        >
          <span className="text-lawson font-mono text-[10px] tracking-[0.12em]">
            24 HOURS · SELF SERVICE
          </span>
          <button
            type="button"
            className={`bg-lawson min-h-10.5 cursor-pointer rounded-lg text-white ${buttonFocus}`}
            onClick={enterStore}
          >
            Enter store
          </button>
        </section>
      ) : null}

      {viewMode === "entering" ? (
        <div
          className="border-ink/14 bg-snow/84 text-lawson absolute bottom-9.5 left-1/2 -translate-x-1/2 rounded-full border px-3.5 py-2.25 text-[11px] tracking-[0.08em]"
          role="status"
        >
          Entering…
        </div>
      ) : null}

      {viewMode === "interior" && !selectedId ? (
        <div
          className="border-ink/55 absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]"
          aria-hidden="true"
        />
      ) : null}

      {viewMode === "interior" && !selectedId && doorHint ? (
        <div className="absolute top-[56%] left-1/2 grid max-w-[calc(100vw-32px)] -translate-x-1/2 justify-items-center gap-1.75 text-center">
          <button
            type="button"
            className={`border-lawson/25 bg-snow text-lawson pointer-events-auto cursor-pointer rounded-3xl border py-2.5 pr-4.5 pl-2.5 shadow-[0_4px_14px_rgb(34_49_58/15%)] transition-transform duration-140 ease-[ease] hover:-translate-y-0.5 motion-reduce:transition-none ${buttonFocus}`}
            onClick={() => toggleDoor(doorHint.id)}
          >
            <kbd className="bg-lawson mr-1.5 inline-grid size-6.25 place-items-center rounded-full font-mono text-white">
              E
            </kbd>{" "}
            {doorHint.open ? "Close door" : "Open door"}
          </button>
          {doorHint.blocked ? (
            <span
              className="bg-snow/92 text-ink rounded-[10px] px-2.5 py-1 text-[11px]"
              role="status"
            >
              Step aside
            </span>
          ) : null}
        </div>
      ) : null}

      {viewMode === "interior" && hovered && !selectedId ? (
        <section
          className={`${peekPanel} grid min-w-[min(360px,calc(100vw-32px))]`}
          aria-live="polite"
        >
          <span className={label}>{hovered.brand || "LAWSON"}</span>
          <strong className="mt-1 text-base">{hovered.name}</strong>
          <small className="text-ink/66 mt-1.5">
            ¥{hovered.price} · Click to pick up
          </small>
        </section>
      ) : null}

      {selectedId && selectedProduct ? (
        <section
          className={`${peekPanel} pointer-events-auto grid w-[min(420px,calc(100vw-32px))] min-w-[min(360px,calc(100vw-32px))] gap-3.5`}
          aria-label="Inspect item"
        >
          <div className="grid">
            <span className={label}>{selectedProduct.brand || "LAWSON"}</span>
            <strong className="mt-1 text-base">{selectedProduct.name}</strong>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <small className="text-ink/66">
              {inspectExit === "return"
                ? "Returning…"
                : inspectExit === "cart"
                  ? "Adding…"
                  : "Drag to rotate · Esc to return"}
            </small>
            <b>¥{selectedProduct.price}</b>
          </div>
          <div className="flex items-center justify-between gap-2.5">
            <button
              type="button"
              className={`border-ink/18 text-ink min-h-10.5 flex-1 cursor-pointer rounded-[9px] border bg-transparent px-4 disabled:cursor-default disabled:opacity-[0.55] ${buttonFocus}`}
              disabled={!!inspectExit}
              onClick={() => requestInspectExit("return")}
            >
              Put back
            </button>
            <button
              type="button"
              className={`bg-lawson min-h-10.5 flex-1 cursor-pointer rounded-[9px] px-4 text-white disabled:cursor-default disabled:opacity-[0.55] ${buttonFocus}`}
              disabled={!!inspectExit}
              onClick={() => requestInspectExit("cart")}
            >
              Add to basket
            </button>
          </div>
        </section>
      ) : null}

      <aside
        className={`absolute top-[clamp(104px,15vh,150px)] right-[clamp(16px,3vw,42px)] w-[min(280px,calc(100vw-32px))] font-mono text-[11px] max-[720px]:top-24 ${
          viewMode === "exterior" ? "hidden" : ""
        }`}
        aria-label="Basket"
      >
        <div className="border-lawson bg-snow flex items-center justify-between border-t-4 px-3.5 py-3 shadow-[0_14px_35px_rgb(35_76_90/10%)]">
          <span>Basket</span>
          <b className="bg-lawson grid size-5.5 place-items-center rounded-full text-white">
            {cart.length}
          </b>
        </div>
        {cart.length ? (
          <div
            className={`bg-snow relative grid gap-2 px-3.5 pt-1.5 pb-4.5 shadow-[0_14px_35px_rgb(35_76_90/10%)] after:inset-x-0 after:-bottom-1.75 max-[720px]:hidden ${paperEdge}`}
          >
            {cart.slice(-3).map((item) => (
              <div key={item.instanceId} className="flex justify-between gap-3">
                <span>{item.name}</span>
                <b>¥{item.price}</b>
              </div>
            ))}
            <div className="border-ink/30 mt-1 flex justify-between gap-3 border-t border-dashed pt-2.5">
              <span>Total</span>
              <b>¥{total}</b>
            </div>
          </div>
        ) : null}
      </aside>

      {viewMode === "interior" ? (
        <footer className="text-ink/58 absolute inset-x-0 bottom-0 flex justify-center gap-4.5 p-5 text-[11px] tracking-[0.04em]">
          {!selectedId ? (
            <span className="max-[720px]:hidden">
              WASD to move · Drag to look
            </span>
          ) : null}
          <button
            type="button"
            className={`bg-lawson pointer-events-auto min-h-7.5 cursor-pointer rounded-lg px-3 text-[10px] text-white ${buttonFocus}`}
            onClick={returnOutside}
          >
            Leave store
          </button>
        </footer>
      ) : null}
    </div>
  );
}

export function App() {
  const selectedId = useGameStore((state) => state.selectedId);

  return (
    <main className="relative h-full w-full [&_canvas]:touch-none">
      <Canvas
        className="cursor-grab"
        dpr={selectedId ? 2 : [1.5, 2]}
        camera={{ position: [12.5, 7.2, 15.5], fov: 68, near: 0.05, far: 300 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <FullStore />
        </Suspense>
      </Canvas>
      <LoadingOverlay />
      <Interface />
    </main>
  );
}
