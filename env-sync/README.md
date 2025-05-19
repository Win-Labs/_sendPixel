## ⚙️ How to Use the Scripts

These scripts allow you to **push and pull `.env` files** to a centralized server. You can customize both the **input/output file locations** and the **server connection settings**.

---

### 🧾 1. `.curl.env` — Required Configuration

You **must create** a file called `.curl.env` in the same folder as the scripts. It defines how to connect to the remote server.

Example:

```env
SERVER_HOST=localhost
SERVER_PORT=3210
```

You can point this to any host/port where your environment-sync server is running.

---

### 📤 2. `push_env.sh` — Upload Environment File

This script **sends environment variables to the server**.

#### You Can:

- Set the **input file** path via `INPUT_FILE` (default: `./.dynamic.env`)
- Change the project name via `PROJECT_NAME`
- Edit the server target via `.curl.env`

#### How It Works:

- Reads the `.env`-style file (e.g., `.dynamic.env`)
- Converts it to JSON
- Sends it via HTTP `POST` to:

```
http://$SERVER_HOST:$SERVER_PORT/env/$PROJECT_NAME
```

Example usage:

```bash
./push_env.sh
```

---

### 📥 3. `pull_env.sh` — Download Environment File

This script **retrieves the latest `.env` version from the server**.

#### You Can:

- Set the **output file** path via `OUTPUT_FILE` (default: `./.dynamic.env`)
- Change the project name via `PROJECT_NAME`
- Edit the server target via `.curl.env`

#### How It Works:

- Requests from:

```
http://$SERVER_HOST:$SERVER_PORT/env/$PROJECT_NAME
```

- Converts the JSON into a `.env`-compatible format
- Saves it to the output file (default: `.dynamic.env`)

Example usage:

```bash
./pull_env.sh
```

---

### 📁 Example Directory Structure

```
.
├── .curl.env         # Required for server connection
├── .dynamic.env      # This is what you push/pull
├── push_env.sh       # Run to upload .env to server
├── pull_env.sh       # Run to fetch latest .env from server
```

---

### 🔄 How Data Is Transferred

- **Upload:**
  `.env` ➡️ `JSON { variables: { KEY=VALUE } }` ➡️ POST to `/env/:project`

- **Download:**
  GET from `/env/:project` ➡️ raw `{ KEY: VALUE }` ➡️ written into `.env` file

---

## 🖥️ What the Server Provides

This server exposes a simple REST API for storing and retrieving environment variable sets per project. It is backed by a MongoDB model (`Env`) and tracks the history of environment versions.

---

### 🔧 Endpoints

#### `GET /:project`

Returns the **latest saved environment variables** for the given project.

- **URL Example:** `/apt`
- **Response (200):**

```json
{
  "VITE_API_URL": "https://example.com",
  "SECRET_KEY": "s3cr3t"
}
```

- **Response (404):** if no environment is found for that project.

---

#### `POST /:project`

Saves a new environment variable set for the given project.

- **URL Example:** `/apt`
- **Request Body:**

```json
{
  "variables": {
    "VITE_API_URL": "https://example.com",
    "SECRET_KEY": "s3cr3t"
  }
}
```

- **Response (201):**

```json
{ "message": "Env saved" }
```

- **Response (400):** if `variables` is missing or not an object.

Each POST creates a new document, preserving version history.

---

#### `GET /:project/history`

Returns **all saved versions** of the environment variables for the given project, sorted by creation date (latest first).

- **Response:**

```json
[
  {
    "createdAt": "2024-05-15T08:22:13.123Z",
    "variables": {
      "VITE_API_URL": "https://v1.example.com",
      "SECRET_KEY": "abc123"
    }
  },
  {
    "createdAt": "2024-05-10T03:11:45.456Z",
    "variables": {
      "VITE_API_URL": "https://v0.example.com",
      "SECRET_KEY": "xyz789"
    }
  }
]
```

---

### 📦 Behind the Scenes

- `Env` is a MongoDB model with:

  - `project`: project name (string)
  - `variables`: stored as a `Map<String, String>`
  - `createdAt`: automatic timestamp for sorting and version tracking
