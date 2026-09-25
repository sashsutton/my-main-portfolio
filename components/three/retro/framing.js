/**
 * Hero framing, shared by the camera (HeroScene → CameraRig) and the CRT's DOM
 * overlay (ScreenUI), which needs to know how big the screen will end up on
 * the page before it picks a layout.
 *
 * Portrait width has to clear the whole *machine*, with a margin, not just the
 * screen: the shell is 3.34 wide and its bezel protrudes to z = 1.39. Framing
 * the shell exactly (the old 3.3 at z = 1.21 was tighter still) cropped both
 * side bezels on every phone. 3.74 is the shell plus ~6% air each side.
 *
 * The keyboard (2.95 wide, front corners at z ≈ 2.65) is narrower but nearer,
 * so on less-tall portrait screens — an iPad, where the camera sits closer —
 * perspective makes it the widest thing in frame. It gets the same margin.
 */
export const HERO_FIT = {
  landscape: 5,
  portrait: 3.74,
  subjectZ: 1.39,
  baseZ: 7.4,
  nearer: [{ width: 3.3, z: 2.65 }],
};
