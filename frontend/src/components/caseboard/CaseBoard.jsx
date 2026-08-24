import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const CaseBoardCtx = createContext(null);

/**
 * CaseBoardProvider — wraps a run of sections and draws one continuous
 * red string connecting every <CasePin> mounted inside it, in `order`.
 * Positions are measured live (getBoundingClientRect), so it stays
 * correct across any responsive layout, grid reflow, or async content
 * (fonts, images, fetched data) that changes the page's height.
 */
export function CaseBoardProvider({ children }) {
  const containerRef = useRef(null);
  const pinsRef = useRef(new Map()); // id -> { order, node }
  const [path, setPath] = useState("");

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

    const points = Array.from(pinsRef.current.values())
      .sort((a, b) => a.order - b.order)
      .map(({ node }) => {
        const r = node.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        };
      });

    if (points.length < 2) {
      setPath("");
      return;
    }

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const midX = (prev.x + cur.x) / 2;
      const sag = Math.min(36, Math.abs(cur.x - prev.x) * 0.15 + 14);
      const midY = (prev.y + cur.y) / 2 + sag;
      d += ` Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${cur.x.toFixed(1)} ${cur.y.toFixed(1)}`;
    }
    setPath(d);
  }, []);

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
          <path
            d={path}
            stroke="var(--dossier-accent)"
            strokeWidth="2"
            fill="none"
            opacity="0.85"
            strokeLinecap="round"
          />
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
