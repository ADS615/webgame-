# Local development server handoff

When the task changes a browser game, finish by making the real app reachable in a local dev server and leaving it running when the environment permits. This is a development preview, not a production deployment.

## 1. Find the project's intended command

1. Inspect `package.json` scripts, project documentation, lockfiles, and framework configuration.
2. Use the repository's existing `dev`, `start`, or preview script and its matching package manager. Respect the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, etc.); do not silently switch package managers.
3. Install dependencies only if they are missing and the project instructions allow it. Prefer the existing lockfile's frozen/immutable install mode where practical.
4. For a simple static page with no app server, use an available static HTTP server, for example `python3 -m http.server 8000 --bind 0.0.0.0`. Do not add a full framework just to serve static files.
5. Never start a production server or deploy publicly unless the user asked for that.

## 2. Run it as a background service

A development server is expected to keep running after the coding task returns. Use the current agent environment's supported background-process or terminal-task mode. Do not launch a long-running dev server as a foreground command that blocks all later work.

- When running inside a proxied sandbox preview, bind to `0.0.0.0` and use the framework's supported host option. For Vite this is commonly `--host 0.0.0.0`; use the project's actual framework command and verify its log.
- Use the port reported by the server. If occupied, use a supported alternative; do not kill an unrelated process to reclaim a port.
- If a preview proxy has an origin/host allowlist, allow only the exact preview host required. Do not turn off host checks globally or use an unsafe wildcard just to make the preview work.
- Keep browser-facing requests relative or use the project's configured proxy. The user's browser cannot reach a service on the agent machine's `localhost` unless that service is the page currently being previewed.
- Do not expose environment secrets in logs, URLs, or browser code.

If the agent environment cannot preserve background processes, tell the user and provide the exact command they can run. Never invent a server URL or say the server is running when it exited.

## 3. Confirm the preview

After launch:

1. Read the server's startup output and identify the actual address/port.
2. Make an HTTP request or open the page in a browser tool if available. Confirm it serves the game rather than a framework error page.
3. Inspect server/browser errors and fix startup or asset-path issues. If a browser is available, play through the first interaction and one end/restart path.
4. Leave the process running. Stop only a process started by this task, and only if the user asks for it or it must be restarted to apply a necessary configuration change.

## 4. Report useful handoff details

The final message should include:

- The exact URL that was observed to work (local or sandbox preview).
- The command used to start it, if useful.
- Whether the server is still running.
- Checks actually performed and any checks that were unavailable.

Example: “Preview is running at [the actual URL reported by the dev server]. `npm run build` passed; I checked start, movement, game-over, and replay in the browser. The server is still running.” Replace every example with the real result; do not copy the claim if it was not verified.