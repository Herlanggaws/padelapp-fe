"use client";

import { useCallback, useRef, useState } from "react";

export interface PhotoTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const INITIAL_TRANSFORM: PhotoTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

const MIN_SCALE = 1;
const MAX_SCALE = 3;

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

function distanceBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function formatTransform(t: PhotoTransform) {
  return `translate3d(${t.offsetX}px, ${t.offsetY}px, 0) scale(${t.scale})`;
}

export function usePhotoTransform() {
  const [photoTransform, setPhotoTransform] =
    useState<PhotoTransform>(INITIAL_TRANSFORM);

  const transformRef = useRef<PhotoTransform>(INITIAL_TRANSFORM);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const panStartRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const pinchStartRef = useRef<{
    distance: number;
    scale: number;
  } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const gesturingRef = useRef(false);

  const applyTransformToDom = useCallback((transform: PhotoTransform) => {
    const img = photoImgRef.current;
    if (!img) return;
    img.style.transform = formatTransform(transform);
  }, []);

  const scheduleApplyTransform = useCallback(() => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      applyTransformToDom(transformRef.current);
    });
  }, [applyTransformToDom]);

  const flushPendingFrame = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    applyTransformToDom(transformRef.current);
  }, [applyTransformToDom]);

  const setGesturing = useCallback((active: boolean) => {
    gesturingRef.current = active;
    const img = photoImgRef.current;
    if (!img) return;
    img.style.willChange = active ? "transform" : "";
  }, []);

  const commitTransform = useCallback(() => {
    flushPendingFrame();
    setPhotoTransform({ ...transformRef.current });
    setGesturing(false);
  }, [flushPendingFrame, setGesturing]);

  const resetPhotoTransform = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pointersRef.current.clear();
    panStartRef.current = null;
    pinchStartRef.current = null;
    transformRef.current = { ...INITIAL_TRANSFORM };
    setPhotoTransform({ ...INITIAL_TRANSFORM });
    applyTransformToDom(INITIAL_TRANSFORM);
    setGesturing(false);
  }, [applyTransformToDom, setGesturing]);

  const getPhotoTransform = useCallback(() => transformRef.current, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!photoImgRef.current) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 1) {
        setGesturing(true);
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          offsetX: transformRef.current.offsetX,
          offsetY: transformRef.current.offsetY,
        };
        pinchStartRef.current = null;
      } else if (pointersRef.current.size === 2) {
        setGesturing(true);
        panStartRef.current = null;
        const points = Array.from(pointersRef.current.values());
        pinchStartRef.current = {
          distance: distanceBetween(points[0], points[1]),
          scale: transformRef.current.scale,
        };
      }
    },
    [setGesturing],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size >= 2 && pinchStartRef.current) {
        const points = Array.from(pointersRef.current.values());
        const distance = distanceBetween(points[0], points[1]);
        if (distance <= 0 || pinchStartRef.current.distance <= 0) return;

        const nextScale = clampScale(
          pinchStartRef.current.scale *
            (distance / pinchStartRef.current.distance),
        );
        transformRef.current = {
          ...transformRef.current,
          scale: nextScale,
        };
        scheduleApplyTransform();
        return;
      }

      if (pointersRef.current.size === 1 && panStartRef.current) {
        transformRef.current = {
          ...transformRef.current,
          offsetX:
            panStartRef.current.offsetX +
            (e.clientX - panStartRef.current.x),
          offsetY:
            panStartRef.current.offsetY +
            (e.clientY - panStartRef.current.y),
        };
        scheduleApplyTransform();
      }
    },
    [scheduleApplyTransform],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointersRef.current.has(e.pointerId)) return;

      pointersRef.current.delete(e.pointerId);

      if (pointersRef.current.size === 0) {
        panStartRef.current = null;
        pinchStartRef.current = null;
        if (gesturingRef.current) {
          commitTransform();
        }
        return;
      }

      if (pointersRef.current.size === 1) {
        // Transition from pinch back to pan with the remaining finger.
        pinchStartRef.current = null;
        const remaining = Array.from(pointersRef.current.entries())[0];
        panStartRef.current = {
          x: remaining[1].x,
          y: remaining[1].y,
          offsetX: transformRef.current.offsetX,
          offsetY: transformRef.current.offsetY,
        };
      }
    },
    [commitTransform],
  );

  const previewGestureProps = {
    className: "absolute inset-0 touch-none overflow-hidden",
    style: { touchAction: "none" as const },
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
  };

  return {
    photoTransform,
    photoImgRef,
    previewGestureProps,
    resetPhotoTransform,
    getPhotoTransform,
  };
}
