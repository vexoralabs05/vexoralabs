#!/usr/bin/env python3
"""Fetch PXN's public status snapshot and normalize it for Vexora's GitHub Pages site."""
import json, os, sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "status.json"
PROJECT = "https://gorqunkfwiddhmihrkcv.supabase.co"
SNAPSHOT_URL = PROJECT + "/rest/v1/status_snapshot?select=data%2Cupdated_at&id=eq.1"
LIVE_URL = PROJECT + "/functions/v1/status-live"

def request_json(url, key, method="GET", body=None):
    payload = None if body is None else json.dumps(body).encode()
    headers = {"Accept": "application/json", "apikey": key,
               "Authorization": "Bearer " + key,
               "User-Agent": "VexoraLabs-StatusSync/1.0"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    req = Request(url, data=payload, headers=headers, method=method)
    with urlopen(req, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"PXN returned HTTP {response.status} for {url}")
        return json.loads(response.read().decode("utf-8"))

def main():
    key = os.environ.get("PXN_SUPABASE_PUBLISHABLE_KEY", "").strip()
    if not key:
        raise RuntimeError("Missing PXN_SUPABASE_PUBLISHABLE_KEY GitHub Actions secret.")
    # Ask the provider to refresh its live poll; snapshot remains the authoritative display payload.
    try:
        request_json(LIVE_URL, key, method="POST", body={})
    except Exception as exc:
        print(f"Live refresh request did not complete; using latest stored snapshot: {exc}")
    payload = request_json(SNAPSHOT_URL, key)
    if not isinstance(payload, list) or not payload or not isinstance(payload[0].get("data"), dict):
        raise RuntimeError("PXN status_snapshot response did not contain data; previous file preserved.")
    snap = payload[0]["data"]
    groups = snap.get("publicGroupList") or []
    heartbeats = snap.get("heartbeatList") or {}
    uptime = snap.get("uptimeList") or {}
    server_stats = snap.get("serverStats") or {}
    services = []
    for group in groups:
        for monitor in group.get("monitorList") or []:
            mid = str(monitor.get("id"))
            history = heartbeats.get(mid) or []
            latest = history[-1] if history else {}
            code = latest.get("status")
            state = "up" if code == 1 else "down" if code == 0 else "unknown"
            stats = server_stats.get(mid) or {}
            services.append({
                "id": mid, "name": monitor.get("name") or f"Monitor {mid}",
                "group": group.get("name") or "Services", "type": monitor.get("type") or "",
                "status": state, "ping": latest.get("ping"),
                "lastCheck": latest.get("time"), "message": latest.get("msg") or "",
                "uptime24h": uptime.get(f"{mid}_24"),
                "cpu": stats.get("cpu"), "memory": stats.get("memory"),
                "disk": stats.get("disk"), "reachable": stats.get("reachable"),
                "sampledAt": stats.get("sampledAt")
            })
    if not services:
        raise RuntimeError("PXN returned zero monitors; previous file preserved.")
    incidents = [{
        "id": item.get("id"), "title": item.get("title") or "Service incident",
        "description": item.get("content") or "",
        "status": "Resolved" if item.get("style") == "info" else item.get("style") or "",
        "createdAt": item.get("createdDate"), "updatedAt": item.get("lastUpdatedDate")
    } for item in (snap.get("incident") or [])]
    states = [s["status"] for s in services]
    overall = "down" if "down" in states else "up" if states and all(s == "up" for s in states) else "unknown"
    result = {
        "provider": "PXN Status", "sourceTitle": (snap.get("config") or {}).get("title", "PXN STORES LK"),
        "updatedAt": snap.get("polledAt") or datetime.now(timezone.utc).isoformat(),
        "overallStatus": overall, "services": services, "incidents": incidents,
        "maintenance": snap.get("maintenanceList") or [],
        "rawFleetStats": snap.get("fleetStats"), "source": "PXN public status snapshot"
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Synced {len(services)} monitors across {len(groups)} groups; overall={overall}")

if __name__ == "__main__":
    try: main()
    except Exception as exc:
        print(f"Status sync failed: {exc}", file=sys.stderr)
        sys.exit(1)
