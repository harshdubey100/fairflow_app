"""
FairFlow Agent Tools
Each tool calls the FairFlow Express API on behalf of the authenticated user.
The token is passed in at call time so the agent acts as the real user.
"""

import httpx
import os
from typing import Optional

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000")


def _headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ─────────────────────────────────────────────
# Ticket tools
# ─────────────────────────────────────────────

def get_tickets(token: str, status: Optional[str] = None, priority: Optional[str] = None) -> dict:
    """
    Fetch tickets visible to the current user.
    status: OPEN | IN_PROGRESS | RESOLVED
    priority: LOW | MEDIUM | HIGH | CRITICAL
    """
    params = {}
    if status:
        params["status"] = status
    if priority:
        params["priority"] = priority

    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/tickets", params=params, headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_ticket_by_id(token: str, ticket_id: str) -> dict:
    """Fetch a single ticket by its ID."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/tickets/{ticket_id}", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_ticket_journey(token: str, ticket_id: str) -> dict:
    """Get the full history / audit trail of a ticket."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/tickets/{ticket_id}/journey", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def create_ticket(
    token: str,
    title: str,
    description: str,
    priority: str = "MEDIUM",
    story_points: int = 0,
    assigned_to_id: Optional[str] = None,
) -> dict:
    """Create a new ticket. priority: LOW | MEDIUM | HIGH | CRITICAL"""
    payload = {
        "title": title,
        "description": description,
        "priority": priority,
        "storyPoints": story_points,
    }
    if assigned_to_id:
        payload["assignedToId"] = assigned_to_id

    with httpx.Client(timeout=10) as client:
        r = client.post(f"{BACKEND_URL}/api/tickets", json=payload, headers=_headers(token))
        r.raise_for_status()
        return r.json()


def update_ticket(token: str, ticket_id: str, **fields) -> dict:
    """
    Update ticket fields.
    Allowed fields: title, description, status, priority, storyPoints, assignedToId
    """
    with httpx.Client(timeout=10) as client:
        r = client.patch(
            f"{BACKEND_URL}/api/tickets/{ticket_id}",
            json=fields,
            headers=_headers(token),
        )
        r.raise_for_status()
        return r.json()


def resolve_ticket(token: str, ticket_id: str) -> dict:
    """Mark a ticket as RESOLVED."""
    with httpx.Client(timeout=10) as client:
        r = client.patch(
            f"{BACKEND_URL}/api/tickets/{ticket_id}/resolve",
            headers=_headers(token),
        )
        r.raise_for_status()
        return r.json()


# ─────────────────────────────────────────────
# User tools
# ─────────────────────────────────────────────

def get_me(token: str) -> dict:
    """Get the current authenticated user's profile."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/users/me", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_all_users(token: str) -> dict:
    """Get all users (Admin/HR only)."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/users", headers=_headers(token))
        r.raise_for_status()
        return r.json()


# ─────────────────────────────────────────────
# Performance tools
# ─────────────────────────────────────────────

def get_my_performance(token: str) -> dict:
    """Get the current user's performance stats."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/performance/me", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_all_performance(token: str) -> dict:
    """Get all employees' performance stats (Admin/HR only)."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/performance", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_employee_performance(token: str, employee_id: str) -> dict:
    """Get a specific employee's performance stats (Admin/HR only)."""
    with httpx.Client(timeout=10) as client:
        r = client.get(
            f"{BACKEND_URL}/api/performance/{employee_id}", headers=_headers(token)
        )
        r.raise_for_status()
        return r.json()


# ─────────────────────────────────────────────
# Dashboard tools
# ─────────────────────────────────────────────

def get_employee_dashboard(token: str) -> dict:
    """Get the employee dashboard: assigned tickets + personal stats."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/dashboard/employee", headers=_headers(token))
        r.raise_for_status()
        return r.json()


def get_admin_dashboard(token: str) -> dict:
    """Get the admin dashboard: system overview + all employee performance (Admin/HR only)."""
    with httpx.Client(timeout=10) as client:
        r = client.get(f"{BACKEND_URL}/api/dashboard/admin", headers=_headers(token))
        r.raise_for_status()
        return r.json()


# ─────────────────────────────────────────────
# Tool registry — maps name → callable
# ─────────────────────────────────────────────

TOOL_REGISTRY = {
    "get_tickets": get_tickets,
    "get_ticket_by_id": get_ticket_by_id,
    "get_ticket_journey": get_ticket_journey,
    "create_ticket": create_ticket,
    "update_ticket": update_ticket,
    "resolve_ticket": resolve_ticket,
    "get_me": get_me,
    "get_all_users": get_all_users,
    "get_my_performance": get_my_performance,
    "get_all_performance": get_all_performance,
    "get_employee_performance": get_employee_performance,
    "get_employee_dashboard": get_employee_dashboard,
    "get_admin_dashboard": get_admin_dashboard,
}

TOOL_DESCRIPTIONS = """
Available tools (call them by returning JSON with "tool" and "args"):

1. get_tickets(status?, priority?) — List tickets. status: OPEN|IN_PROGRESS|RESOLVED. priority: LOW|MEDIUM|HIGH|CRITICAL
2. get_ticket_by_id(ticket_id) — Get a single ticket by ID
3. get_ticket_journey(ticket_id) — Get full history/audit trail of a ticket
4. create_ticket(title, description, priority?, story_points?, assigned_to_id?) — Create a new ticket
5. update_ticket(ticket_id, ...fields) — Update ticket fields (title, description, status, priority, storyPoints, assignedToId)
6. resolve_ticket(ticket_id) — Mark a ticket as RESOLVED
7. get_me() — Get current user profile
8. get_all_users() — Get all users (Admin/HR only)
9. get_my_performance() — Get current user's performance stats
10. get_all_performance() — Get all employees' performance (Admin/HR only)
11. get_employee_performance(employee_id) — Get specific employee's performance (Admin/HR only)
12. get_employee_dashboard() — Get employee dashboard data
13. get_admin_dashboard() — Get admin dashboard data (Admin/HR only)
"""
