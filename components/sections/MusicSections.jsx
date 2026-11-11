"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/LanguageProvider";
import { shared } from "@/lib/content";
import { PageHeader, Section } from "./PageParts";

/** /music: header, the two sets, and credentials. */

export function MusicHeader() {
  const { t } = useLang();
  return <PageHeader title={t.music.title} lead={t.music.lead} />;
}

/* ------------------------------------------------------------------ sets -- */

export function Sets() {
  const { t } = useLang();
  const { sets } = t.music;
  const { soundcloud, youtubeId, youtubeStart } = shared.media;

  return (
    <Section id="sets" title={sets.title}>
      <div className="grid gap-10 lg:grid-cols-2">
        <figure className="m-0">
          <figcaption className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-crt-amber">
            {sets.dj}
          </figcaption>
          <iframe
            title="SoundCloud — Sasha Sutton"
            className="block aspect-video w-full border-0"
            loading="lazy"
            allow="autoplay"
            src={soundcloudSrc(soundcloud)}
          />
        </figure>

        <figure className="m-0">
          <figcaption className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-crt-amber">
            {sets.video}
          </figcaption>
          <YouTube id={youtubeId} start={youtubeStart} label={sets.video} />
        </figure>
      </div>
    </Section>
  );
}

/**
 * Click-to-load YouTube: shows the thumbnail and a play button, and only
 * swaps in the real player (and YouTube's ~1 MB of JS) when clicked.
 */
function YouTube({ id, start, label }) {
  const [on, setOn] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden bg-black">
      {on ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          // nocookie: no tracking cookies; rel=0: related videos from this channel only.
          src={`https://www.youtube-nocookie.com/embed/${id}?start=${start}&rel=0&autoplay=1`}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setOn(true)}
          aria-label={label}
          className="group absolute inset-0 block h-full w-full p-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="block h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-black/60 text-paper ring-1 ring-white/25 transition-colors group-hover:bg-crt-amber group-hover:text-ink group-focus-visible:bg-crt-amber group-focus-visible:text-ink">
            <svg width="18" height="20" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
              <path d="M1 1.2c0-.9 1-1.4 1.7-.9l10 6.3c.7.4.7 1.4 0 1.8l-10 6.3c-.7.5-1.7 0-1.7-.9V1.2z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/** SoundCloud's artwork player (visual=true), sized 16:9 to match the video. */
function soundcloudSrc(url) {
  const params = new URLSearchParams({
    url,
    color: "#ff8800",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

/* -------------------------------------------------------------- credits -- */

export function Credits() {
  const { t } = useLang();
  const { credits } = t.music;

  return (
    <Section id="credits" title={credits.title}>
      <ul className="m-0 list-none p-0">
        {credits.items.map((item) => (
          <li
            key={item.place}
            className="grid gap-2 border-t border-rule py-8 first:border-t-0 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-8"
          >
            <h3 className="m-0 text-lg font-medium text-paper">{item.place}</h3>
            <div>
              <p className="m-0 text-muted">{item.role}</p>
              <p className="mt-2 mb-0 font-mono text-xs text-subtle">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
