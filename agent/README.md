# FairFlow Agent

LangGraph-powered AI assistant using **Qwen2.5-72B-Instruct** via `huggingface_hub.InferenceClient` directly.

## Why Qwen2.5-72B-Instruct?

| Property | Detail |
|---|---|
| Size | 72B (served remotely — no local GPU needed) |
| Tool use | Excellent structured JSON output |
| Access | Free via HF Inference Providers (Nebius provider) |
| API | `huggingface_hub.InferenceClient.chat_completion()` — native HF, no OpenAI SDK |

## Architecture

```
Browser
  └─ React ChatModal (floating button, bottom-right)
       └─ POST /api/agent/chat  (Express — Clerk auth)
            └─ Proxy → FastAPI agent  :8000
                 └─ LangGraph ReAct loop
                      ├─ LLM: Qwen2.5-72B via router.huggingface.co
                      └─ Tools → Express API endpoints (:3000)
```

## Setup

### 1. Add env vars to `fairflow_app/.env`

```env
HF_TOKEN=hf_your_token_here
AGENT_URL=http://localhost:8000
AGENT_PORT=8000
BACKEND_URL=http://localhost:3000
```

### 2. Install Python dependencies

```bash
cd fairflow_app/agent
pip install -r requirements.txt
```

### 3. Start the agent

```bash
cd fairflow_app/agent
python main.py
```

Runs on `http://localhost:8000`. Start this **before** the Express backend.

### 4. Start the Express backend (separate terminal)

```bash
cd fairflow_app
npm run dev
```

### 5. Start the React frontend (separate terminal)

```bash
cd fairflow_app/client
npm start
```

The chat button (✨) appears in the bottom-right corner of every authenticated page.

---

## Available Tools

| Tool | Description | Role |
|---|---|---|
| `get_tickets` | List tickets (filter by status/priority) | All |
| `get_ticket_by_id` | Get a single ticket | All |
| `get_ticket_journey` | Full audit trail of a ticket | All |
| `create_ticket` | Create a new ticket | All |
| `update_ticket` | Update ticket fields | All |
| `resolve_ticket` | Mark ticket as RESOLVED | All |
| `get_me` | Current user profile | All |
| `get_all_users` | List all users | Admin/HR |
| `get_my_performance` | Current user's performance stats | All |
| `get_all_performance` | All employees' performance | Admin/HR |
| `get_employee_performance` | Specific employee's stats | Admin/HR |
| `get_employee_dashboard` | Employee dashboard data | All |
| `get_admin_dashboard` | Admin dashboard overview | Admin/HR |

## Example Queries

- "Show my open tickets"
- "What are my performance stats?"
- "Show all high priority tickets"
- "Create a ticket titled 'Fix login bug' with high priority"
- "Resolve ticket `<id>`"
- "How many tickets are in progress?"
- "Show the admin dashboard summary"
- "Who has the most resolved tickets?"
