# Student Project Tracker

A hands-on web development workshop project for managing engineering project ideas. Users can add, view, edit, and delete projects. Project data is stored in a local SQLite database.

## Requirements

- Node.js 22.18 or later in the Node 22 series
- npm
- Visual Studio Code

## Run Locally

Open a PowerShell terminal in the project folder and run:

```powershell
npm.cmd ci
npm.cmd start
```

Open http://localhost:3000 in your browser.

Keep the terminal running while using the application. Press Ctrl+C in the terminal to stop the server.

## How It Works

The browser sends HTTP requests to an Express API. The API validates requests and uses SQLite to store project data.

- `public/index.html`: Page structure and project form.
- `public/script.js`: Form handling, API requests, project rendering, and feedback.
- `server.js`: Starts the web server and serves the frontend.
- `app.js`: API routes and request validation.
- `database.js`: SQLite database operations.
- `data/projects.db`: Local SQLite database file, created when the application runs.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server health |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create a project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

## Verification Results

- Automated API test: PASS — one test passed, zero failures.
- Project creation in the browser: Previously observed to work.
- Project editing: Not yet verified.
- Cancel editing: Not yet verified.
- Project deletion: Not yet verified.
- Persistence after browser refresh and server restart: Not yet fully verified.
- Blank and whitespace-only input: Not yet verified through the browser.
- Failure and retry behaviour: Not yet fully verified.
- Narrow-screen layout: Not yet verified.

The automated test uses a temporary database and checks API behaviour. It does not prove that every browser interaction works correctly.

## Workshop Limitations

This local teaching application has no sign-in or per-user permissions. Users accessing the same server share the project collection.

The SQLite database and `node_modules` should not be uploaded to GitHub. Hosting the application online requires separate server and database configuration.