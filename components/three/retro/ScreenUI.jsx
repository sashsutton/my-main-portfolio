"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLang } from "@/components/providers/LanguageProvider";
import { useTypewriter } from "@/components/ui/useTypewriter";
import { scrollToId } from "@/components/providers/SmoothScroll";
import { scrollRef, useAppStore } from "@/lib/store";
import { shared } from "@/lib/content";
import { getFitDistance } from "../CameraRig";
import { HERO_FIT } from "./framing";
import styles from "./screen.module.css";

/**
 * The readable half of the CRT: a real DOM terminal projected onto the screen
 * plane by <Html transform>.
 *
 * Why DOM instead of drawing into the 3D scene:
 *  - type stays vector-crisp at any zoom, and inherits the site's real fonts
 *  - the program list is genuinely focusable/clickable/keyboard-navigable
 *  - the typing effect is trivial to drive from React state
 * The 3D CRTScreen behind it supplies the glow that Bloom can act on.
 *
 * The DOM is authored at a fixed pixel size and mapped onto the 2.56 x 1.92
 * screen plane (drei transform mode: worldUnits = px * distanceFactor / 400).
 *
 * That authoring size is the whole legibility story on phones. The screen
 * occupies a roughly fixed number of *device* pixels, so authoring at 640 wide
 * means every DOM pixel renders at ~0.58 device px and 15px type comes out at
 * ~8px — unreadable. Authoring at 380 instead makes it near 1:1. The trade is
 * that less text fits, hence the separate, shorter `introCompact` copy.
 */
/** World width of the tube opening — the plane this DOM is mapped onto. */
const SCREEN_W = 2.56;
/**
 * How much of that opening the terminal is allowed to fill.
 *
 * Mapping the box to the opening exactly (the obvious 640 @ df 1.6) leaves zero
 * margin: the rounded corners and the bottom scroll hint sit flush against the
 * curved glass, and since <Html transform> composites *above* the WebGL canvas
 * it can never be occluded by the bezel — so the terminal reads as spilling
 * outside the screen rather than living inside it. Holding it to ~93% keeps a
 * visible strip of phosphor all the way round.
 */
const FILL = 0.926;

/** Desktop: authored at VGA, scaled down as a whole to sit inside the opening. */
const FULL = { w: 640, h: 480, df: (400 * SCREEN_W * FILL) / 640 };
/**
 * Narrow viewports get the inset the other way round. The distanceFactor stays
 * the one that maps a 380px box to the *full* opening — that is what keeps type
 * near 1:1 with device pixels — and the authoring box is shrunk by FILL instead.
 * Same inset, without shrinking the text on the screens that can least afford it.
 */
const COMPACT = {
  w: Math.round(380 * FILL),
  h: Math.round(285 * FILL),
  df: (400 * SCREEN_W) / 380,
};

/**
 * Below this many CSS px of on-page screen width, the VGA layout's 15px type
 * would render under ~10px, so the compact one takes over.
 *
 * This is measured, not guessed from the viewport. Viewport width alone gets
 * it wrong both ways: a phone held landscape (844 x 390) is "wide", yet the
 * camera frames the machine by height there, so the tube is only ~240px across
 * and VGA type came out at ~5px; an iPad in portrait is "narrow", yet its tube
 * is ~600px across and has room for the full layout.
 */
const COMPACT_BELOW_PX = 420;

/** On-page width, in CSS px, of the tube at the hero camera pose. */
function projectedScreenWidth(width, height, fov, screenZ) {
  const cameraZ = HERO_FIT.baseZ + getFitDistance(HERO_FIT, width, height, fov);
  const vFov = (fov * Math.PI) / 180;
  const visibleW = 2 * Math.tan(vFov / 2) * (width / height) * (cameraZ - screenZ);
  return (SCREEN_W / visibleW) * width;
}

export default function ScreenUI({ booted, position }) {
  const { t } = useLang();
  const router = useRouter();
  const width = useThree((s) => s.size.width);
  const height = useThree((s) => s.size.height);
  const fov = useThree((s) => s.camera.fov);
  const compact = projectedScreenWidth(width, height, fov, position[2]) < COMPACT_BELOW_PX;
  const box = compact ? COMPACT : FULL;
  const hovered = useAppStore((s) => s.hoveredProgram);
  const setHovered = useAppStore((s) => s.setHoveredProgram);

  const wrapper = useRef(null);
  const [clock, setClock] = useState("--:--");

  // Boot log only starts typing once the tube has actually opened.
  const { lines, done, skip } = useTypewriter(compact ? t.introCompact : t.intro, {
    cps: 62,
    start: booted,
  });

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Paris",
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  // <Html> content isn't a <Link>, so nothing prefetches the routes for us.
  // This used to happen on hover, which never fires for touch — warm them as
  // soon as the menu appears instead, so a tap navigates immediately.
  useEffect(() => {
    if (!done) return;
    shared.programs.forEach((p) => p.href && router.prefetch(p.href));
  }, [done, router]);

  /**
   * Fade the overlay out as the camera leaves the hero. <Html transform> always
   * composites above the WebGL canvas, so without this the terminal would float
   * over the About section. Written straight to style — no re-render per frame.
   */
  useFrame(() => {
    const el = wrapper.current;
    if (!el) return;
    const o = 1 - Math.min(1, Math.max(0, (scrollRef.current - 0.04) / 0.06));
    if (el._o !== o) {
      el._o = o;
      el.style.opacity = o;
      el.style.pointerEvents = o < 0.4 ? "none" : "auto";
    }
  });

  const activeBlurb = hovered ? t.programs[hovered].blurb : "";

  return (
    <Html
      transform
      distanceFactor={box.df}
      position={position}
      zIndexRange={[12, 0]}
      // Let clicks through everywhere except the terminal box itself.
      style={{ pointerEvents: "none" }}
    >
      <div
        ref={wrapper}
        className={`${styles.screen} ${compact ? styles.compact : ""}`}
        style={{ width: box.w, height: box.h, pointerEvents: "auto" }}
        onClick={() => !done && skip()}
      >
        <div className={styles.status}>
          <span>SASHA-OS</span>
          {!compact && <span className={styles.dim}>{shared.name.toUpperCase()}</span>}
          <span>
            {clock} <i className={styles.led} />
          </span>
        </div>

        <div className={styles.boot} aria-live="polite">
          {lines.map((line, i) => (
            <span key={i} className={styles.bootLine}>
              {line}
              {i === lines.length - 1 && !done && <i className={styles.caret} />}
            </span>
          ))}
        </div>

        <div className={`${styles.menu} ${done ? styles.menuVisible : ""}`}>
          <div className={styles.menuLabel}>{t.hero.pick}</div>

          {shared.programs.map((p) => (
            <button
              key={p.id}
              className={`${styles.item} ${p.accent === "amber" ? styles.itemAmber : ""}`}
              // Hover is mouse-only. On iOS a tap first fires the hover
              // events, and if they change what is on screen (the blurb, the
              // arrow, the inverted row) Safari treats the tap as "reveal
              // hover content" and swallows the click — the program only
              // opened on a second tap, if at all.
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p.id)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(null)}
              onFocus={() => setHovered(p.id)}
              onBlur={() => setHovered(null)}
              // Programs with a page of their own navigate; the rest scroll to
              // their block on this page.
              onClick={() => (p.href ? router.push(p.href) : scrollToId(`lens-${p.id}`))}
            >
              <span className={styles.arrow}>▸</span>
              <span className={styles.file}>{p.file}</span>
              {!compact && <span className={styles.name}>{t.programs[p.id].label}</span>}
            </button>
          ))}

          <div className={styles.blurb}>{activeBlurb}</div>
        </div>

        <div className={styles.foot}>
          <span className={styles.scrollHint}>
            <span className={styles.chevron}>▼</span>
            {t.hero.hint}
          </span>
        </div>
      </div>
    </Html>
  );
}
