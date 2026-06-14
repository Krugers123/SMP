#!/usr/bin/env python3
"""Validate an SMP packet v0.1 file.

This validator intentionally uses only the Python standard library. It performs
the protocol checks needed by the public v0.1 draft without requiring a JSON
Schema dependency.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


REQUIRED_FIELDS = ("smp_version", "intent", "desired_output")
OPTIONAL_OBJECT_FIELDS = (
    "context",
    "constraints",
    "tone",
    "risk_watch",
    "boundaries",
    "trajectory",
    "memory_hooks",
    "metadata",
)
ALLOWED_FIELDS = set(REQUIRED_FIELDS) | set(OPTIONAL_OBJECT_FIELDS)
SUPPORTED_VERSION = "0.1"


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}") from None
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc.msg} at line {exc.lineno}, column {exc.colno}") from None


def validate_packet(packet: Any) -> list[str]:
    errors: list[str] = []

    if not isinstance(packet, dict):
        return ["packet must be a JSON object"]

    for field in REQUIRED_FIELDS:
        if field not in packet:
            errors.append(f"missing required field: {field}")

    version = packet.get("smp_version")
    if version != SUPPORTED_VERSION:
        errors.append(f"smp_version must be {SUPPORTED_VERSION!r}")

    extra_fields = sorted(set(packet) - ALLOWED_FIELDS)
    for field in extra_fields:
        errors.append(f"unknown field: {field}")

    for field in ("intent", "desired_output", *OPTIONAL_OBJECT_FIELDS):
        if field in packet and not isinstance(packet[field], dict):
            errors.append(f"{field} must be an object")

    intent = packet.get("intent")
    if isinstance(intent, dict) and not intent.get("summary"):
        errors.append("intent.summary is recommended and required by this validator")

    desired_output = packet.get("desired_output")
    if isinstance(desired_output, dict) and not desired_output.get("format"):
        errors.append("desired_output.format is recommended and required by this validator")

    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate an SMP packet v0.1 JSON file.")
    parser.add_argument("packet", type=Path, help="Path to an SMP packet JSON file.")
    args = parser.parse_args(argv)

    try:
        packet = load_json(args.packet)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    errors = validate_packet(packet)
    if errors:
        print(f"INVALID: {args.packet}")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"VALID: {args.packet}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

