#!/usr/bin/env python3
"""Fetch the upstream status snapshot and normalize it for Vexora's status page."""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "status.json"

PROJECT = "https://gorqunkfwiddhmihrkcv.supabase.co"

SNAPSHOT_URL = (
    PROJECT
    + "/rest/v1/status_snapshot?select=data%2Cupdated_at&id=eq.1"
)

LIVE_URL = PROJECT + "/functions/v1/status-live"


def request_json(url, key, method="GET", body=None):
    """Send an authenticated request and return decoded JSON."""

    payload = None if body is None else json.dumps(body).encode("utf-8")

    headers = {
        "Accept": "application/json",
        "apikey": key,
        "Authorization": "Bearer " + key,
        "User-Agent": "VexoraLabs-StatusSync/1.0",
    }

    if payload is not None:
        headers["Content-Type"] = "application/json"

    req = Request(
        url,
        data=payload,
        headers=headers,
        method=method,
    )

    try:
        with urlopen(req, timeout=30) as response:
            response_body = response.read().decode("utf-8")

            if not 200 <= response.status < 300:
                raise RuntimeError(
                    f"API returned HTTP {response.status}: {response_body[:500]}"
                )

            try:
                return json.loads(response_body)
            except json.JSONDecodeError as exc:
                raise RuntimeError(
                    f"API returned invalid JSON: {response_body[:500]}"
                ) from exc

    except HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"HTTP {exc.code} from API: {error_body[:1000]}"
        ) from exc

    except URLError as exc:
        raise RuntimeError(f"Could not connect to API: {exc.reason}") from exc


def main():
    # Read the API key from GitHub Actions secrets.
    key = os.environ.get("VEXORA_STATUS_API_KEY", "").strip()

    if not key:
        raise RuntimeError(
            "Missing VEXORA_STATUS_API_KEY GitHub Actions secret."
        )

    print("API key detected.")

    # Request an upstream live refresh.
    # The stored snapshot remains the authoritative data source.
    try:
        request_json(
            LIVE_URL,
            key,
            method="POST",
            body={},
        )
        print("Live refresh request completed.")

    except Exception as exc:
        print(
            "WARNING: Live refresh request failed. "
            f"Using the latest stored snapshot: {exc}"
        )

    # Fetch the latest stored snapshot.
    print("Fetching status snapshot...")

    payload = request_json(SNAPSHOT_URL, key)

    if (
        not isinstance(payload, list)
        or not payload
        or not isinstance(payload[0], dict)
        or not isinstance(payload[0].get("data"), dict)
    ):
        raise RuntimeError(
            "Status snapshot response did not contain valid data. "
            "Previous status.json file was preserved."
        )

    snap = payload[0]["data"]

    groups = snap.get("publicGroupList") or []
    heartbeats = snap.get("heartbeatList") or {}
    uptime = snap.get("uptimeList") or {}
    server_stats = snap.get("serverStats") or {}

    if not isinstance(groups, list):
        raise RuntimeError("Invalid monitor groups in snapshot.")

    services = []

    # Normalize monitors and their latest heartbeat information.
    for group in groups:
        if not isinstance(group, dict):
            continue

        monitors = group.get("monitorList") or []

        for monitor in monitors:
            if not isinstance(monitor, dict):
                continue

            mid = str(monitor.get("id"))

            history = heartbeats.get(mid) or []
            latest = history[-1] if history else {}

            if not isinstance(latest, dict):
                latest = {}

            code = latest.get("status")

            if code == 1:
                state = "up"
            elif code == 0:
                state = "down"
            else:
                state = "unknown"

            stats = server_stats.get(mid) or {}

            if not isinstance(stats, dict):
                stats = {}

            services.append({
                "id": mid,
                "name": monitor.get("name") or f"Monitor {mid}",
                "group": group.get("name") or "Services",
                "type": monitor.get("type") or "",
                "status": state,
                "ping": latest.get("ping"),
                "lastCheck": latest.get("time"),
                "message": ("TCP server monitor" if str(monitor.get("type", "")).lower() == "tcp" else "DNS monitor" if str(monitor.get("type", "")).lower() == "dns" else "Service monitor"),
                "uptime24h": uptime.get(f"{mid}_24"),
                "cpu": stats.get("cpu"),
                "memory": stats.get("memory"),
                "disk": stats.get("disk"),
                "reachable": stats.get("reachable"),
                "sampledAt": stats.get("sampledAt"),
            })

    if not services:
        raise RuntimeError(
            "The upstream snapshot returned zero monitors. "
            "Previous status.json file was preserved."
        )

    # Normalize incidents.
    incidents = []

    for item in snap.get("incident") or []:
        if not isinstance(item, dict):
            continue

        incidents.append({
            "id": item.get("id"),
            "title": item.get("title") or "Service incident",
            "description": item.get("content") or "",
            "status": (
                "Resolved"
                if item.get("style") == "info"
                else item.get("style") or ""
            ),
            "createdAt": item.get("createdDate"),
            "updatedAt": item.get("lastUpdatedDate"),
        })

    # Calculate overall status.
    states = [service["status"] for service in services]

    if "down" in states:
        overall = "down"
    elif states and all(state == "up" for state in states):
        overall = "up"
    else:
        overall = "unknown"

    # Build the Vexora status feed.
    result = {
        "provider": "Vexora Labs",
        "sourceTitle": "Vexora Labs Status",
        "updatedAt": (
            snap.get("polledAt")
            or datetime.now(timezone.utc).isoformat()
        ),
        "overallStatus": overall,
        "services": services,
        "incidents": incidents,
        "maintenance": snap.get("maintenanceList") or [],
        "rawFleetStats": snap.get("fleetStats"),
        "source": "Upstream public status snapshot",
    }

    # Write only after all validation succeeds.
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    temp_output = OUTPUT.with_suffix(".json.tmp")

    temp_output.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    temp_output.replace(OUTPUT)

    print("-----------------------------------")
    print("VEXORA STATUS SYNC SUCCESSFUL")
    print(f"Groups: {len(groups)}")
    print(f"Monitors: {len(services)}")
    print(f"Incidents: {len(incidents)}")
    print(f"Overall status: {overall}")
    print(f"Output: {OUTPUT}")
    print("-----------------------------------")


if __name__ == "__main__":
    try:
        main()

    except Exception as exc:
        print(
            f"STATUS SYNC FAILED: {exc}",
            file=sys.stderr,
        )
        sys.exit(1)
