import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const CaseBoardCtx = createContext(null);

// A tiny deterministic "hash" so each string segment gets a fixed, repeatable
// amount of taut-but-not-perfectly-straight give, instead of a random wobble
// that would change on every re-render.
function jitterFor(key, max) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return ((h % 200) / 100 - 1) * max; // -max..max
}

function segmentPath(a, b, key) {
  const midX = (a.x + b.x) / 2 + jitterFor(key + "x", 10);
  const midY = (a.y + b.y) / 2 + jitterFor(key + "y", 10);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/**
 * CaseBoardProvider — wraps a run of sections and draws real, taut red
 * string between every <CasePin> mounted inside it: one line threading
 * through all of them in `order`, plus bold diagonal "cross-ties"
 * connecting specific far-apart pins, the way a detective's board has
 * string crossing the whole surface, not just linking neighbors.
 * Positions are measured live (getBoundingClientRect), so it stays
 * correct across any responsive layout, grid reflow, or async content
 * (fonts, images, fetched data) that changes the page's height.
 */
export function CaseBoardProvider({ crossTies = [], children }) {
  const containerRef = useRef(null);
  const pinsRef = useRef(new Map()); // id -> { order, node }
  const [segments, setSegments] = useState([]);

  const registerPin = useCallback((id, order, node) => {
    if (node) {
      pinsRef.current.set(id, { order, node });
    } else {
      pinsRef.current.delete(id);
    }
  }, []);

  const recompute = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const centerOf = (node) => {
      const r = node.getBoundingClientRect();
      return { x: r.left + r.width / 2 - containerRect.left, y: r.top + r.height / 2 - containerRect.top };
    };

    const ordered = Array.from(pinsRef.current.entries()).sort((a, b) => a[1].order - b[1].order);

    const next = [];
    for (let i = 1; i < ordered.length; i++) {
      const [prevId, prevPin] = ordered[i - 1];
      const [curId, curPin] = ordered[i];
      next.push(segmentPath(centerOf(prevPin.node), centerOf(curPin.node), `${prevId}-${curId}`));
    }

    crossTies.forEach(([idA, idB]) => {
      const a = pinsRef.current.get(idA);
      const b = pinsRef.current.get(idB);
      if (a && b) next.push(segmentPath(centerOf(a.node), centerOf(b.node), `${idA}~${idB}`));
    });

    setSegments(next);
  }, [crossTies]);

  useEffect(() => {
    const raf = requestAnimationFrame(recompute);
    const t1 = setTimeout(recompute, 450);
    const t2 = setTimeout(recompute, 1400);

    window.addEventListener("resize", recompute);

    let ro;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      ro = new ResizeObserver(recompute);
      ro.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", recompute);
      if (ro) ro.disconnect();
    };
  }, [recompute]);

  return (
    <CaseBoardCtx.Provider value={{ registerPin, recompute }}>
      <div ref={containerRef} style={{ position: "relative" }}>
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 5,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          {segments.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="var(--dossier-accent)"
              strokeWidth="1.8"
              fill="none"
              opacity="0.8"
              strokeLinecap="round"
            />
          ))}
        </svg>
        {children}
      </div>
    </CaseBoardCtx.Provider>
  );
}

/**
 * CasePin — a small anchor point that registers itself with the nearest
 * CaseBoardProvider so the string routes through it. `className`/`style`
 * control its own visual look and position (usually a red pin dot
 * positioned relative to its own parent card).
 */
export function CasePin({ id, order, className, style }) {
  const ctx = useContext(CaseBoardCtx);
  const ref = useRef(null);

  useEffect(() => {
    if (!ctx) return undefined;
    ctx.registerPin(id, order, ref.current);
    ctx.recompute();
    return () => ctx.registerPin(id, order, null);
  }, [ctx, id, order]);

  return <span ref={ref} className={className} style={style} />;
}
