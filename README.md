# Graffiti 2027

A professional Flask coming-soon page with original branding, graffiti lettering, a detailed kinetic titanium sculpture, responsive layouts, theme/team teaser dialogs, a confidential reveal teaser. It opens directly without a loading screen. No build tools required.

## Run

Install Python 3.10 or newer, then open a terminal in this folder:

```sh
python -m venv .venv
```

Windows:

```powershell
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

macOS/Linux:

```sh
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000. Use a production WSGI server when deploying publicly.

## Details

- The event date is confidential. No countdown, calendar file or event timestamp is included in the frontend. The teaser and dialogs preserve that confidentiality.
- The page opens directly. Graffiti lettering and a restrained vermilion paint accent bring the street-art character into the main layout.
- The custom procedural 3D sculpture uses beveled titanium surfaces, fine grooves, fasteners, polished kinetic ribbons, an obsidian core, studio reflections and real shadows. It floats and turns gently with independently orbiting rings, frame-independent timing and damped drag interaction that settles naturally back into its resting pose. The sculpture has no visible labels or control bar. Reduced-motion preferences freeze ambient movement, and hidden tabs stop rendering.
- The blended **?** in the obsidian core is clickable and keyboard accessible. It triggers a smooth ring-speed burst, displays **Theme will be revealed soon** for three seconds, then triggers a second burst and eases back into the normal orbit. Repeated activation is blocked until the sequence completes. Reduced motion shows the message without rapid spinning. Camera framing explicitly includes the pedestal's front edge with a safety margin at every viewport size. A faint animated studio glow adds background depth.
- The original Graffiti and SCIT logos have matching optical widths and no backgrounds. Graffiti's previous embedded date is hidden with CSS clipping.
- Theme and team stay undisclosed. The sculpture is teaser art, not the official 2027 theme.
- WebGL2 is needed for the full sculpture. A static CSS illustration is displayed if graphics are unavailable.

Source logos: https://graffiti.scit.edu/ and its linked `scitgraffiti/graffiti26_assets` repository. Fonts: Manrope, Permanent Marker and Space Mono from Google Fonts, with system fallbacks. Three.js 0.170.0 is bundled locally under its MIT license in `static/vendor/`. There are no external model files or animation services.

`dist/` is a static copy of the same frontend for hosting without Python. Flask is the primary editable implementation. After editing the template or static files, refresh `dist/` if using that deployment option.
