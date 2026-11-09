# Corpse

Exquisite corpse figures from public-domain museum artworks: three horizontal strips (top, middle,
bottom) from three different works, lined up where their annotated seams meet.

This is the from-scratch rewrite of the prototype in `../exquisite-corpse` (tagged `prototype` in its
git history), written step by step for learning.

- **Compositor** (`compositor.html`): the page that goes live.
- **Annotator** (`annotator.html`): stays local; it draws the seam lines the compositor uses.

## Run it

```
python3 server.py
```

Then open http://localhost:8001/annotator.html or http://localhost:8001/compositor.html.
The prototype keeps running separately at http://localhost:8000.

## Files

- `annotator.js`, `compositor.js`: yours to write. Each starts with its build steps.
- `given.js`, `server.py`: given code (loading data and images, saving annotations). Use them, don't rewrite them.
- `data/`: a link to the prototype's data folder, so both share one set of images and annotations.
  It isn't committed; the images are too big for git.
