# History of Graphic Design

A React + Vite recreation of [historyofgraphicdesign.com](https://historyofgraphicdesign.com/). Scroll vertically and the page moves horizontally through the movements that shaped graphic design, from Victorian to Flat Design.

Original design by [Florence Jeev](https://www.florencejeev.com/). Original development by [Moussa Mamadou](https://www.moussamamadou.com).

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://127.0.0.1:5173`.

```bash
npm run build    # typecheck and production build
npm run preview  # serve the production build
```

## How to use it

1. The loader counts to 100 and wipes away.
2. The hero title and posters settle into place. **Scroll** (wheel, trackpad, or touch) to move sideways.
3. The intro sentence reveals as you pass it, then each movement appears: a large title, dates, and a poster.
4. The dots along the bottom track your place. Hover a dot to see the name, or click it to jump there.
5. Click a poster to open that movement. Press **Escape** or the close button to return.
6. After **Flat Design**, **Thanks for visiting** wipes in.

## Stack

| Piece | Role |
| --- | --- |
| React 19 + TypeScript | Page structure |
| Vite | Dev server and production build |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth horizontal scroll. A vertical wheel gesture moves the page sideways. |
| [GSAP](https://gsap.com/) | Loader, split text, scroll triggers, and the poster move into the detail panel |
| [Three.js](https://threejs.org/) | Posters drawn on a fixed canvas so they bend while scrolling and ripple on hover |

If WebGL cannot start, the same images show in the page instead of on the canvas.

## Project layout

```
index.html                 Fonts, title, and the app mount
public/
  favicon.svg
  fonts/                   Author variable font
  images/                  Welcome posters and one image per movement
src/
  main.tsx                 React entry
  App.tsx                  Loader, hero, intro, timeline, detail panel, credits
  data/movements.ts        Names, dates, copy, colors, and image paths
  styles/global.css        Layout, type, and motion states
  experience/
    index.ts               Starts the page after the loader
    motion.ts              Scroll, loader, hero, intro, timeline, detail, credits
    canvas.ts              Full-screen WebGL scene
    media.ts               One plane per poster, following its DOM position
    shaders.ts             Bend, hover wave, and detail-open flip
```

## Page flow

The document is one horizontal row:

1. **Welcome** — title, short description, five scattered posters, and a scroll cue.
2. **Intro** — the sentence fades in word by word.
3. **Timeline** — twelve movements, each the same width, separated by fading vertical rules.
4. **Trailing space** — room to leave Flat Design before the ending.
5. **Thanks for visiting** — a fixed panel. It stays clipped off-screen until Flat Design reaches the center, then wipes in.

Slide widths are measured after fonts load and set to the widest title, so later titles are not clipped and the scroll distance includes every movement.

## Movements

Victorian, Art & Crafts, Art Nouveau, Art Deco, Constructivist, Heroic Realism, Pop Art, Swiss School, Psychedelic, Post Modern, Grunge, and Flat Design.

Copy, dates, and accent colors live in `src/data/movements.ts`. Each accent is applied to the detail panel when that poster opens.

## Type

- **Bebas Neue** — titles, from Google Fonts
- **Author** — body text, files in `public/fonts`
- **Chapman Test Extended** — dates, loaded from [Online Web Fonts](http://www.onlinewebfonts.com/fonts) and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## References

- [Graphic Design Styles — Online Design Teacher](https://www.onlinedesignteacher.com/2016/05/graphic-design-styles.html)
- DK, *Design: The Definitive Visual History*
