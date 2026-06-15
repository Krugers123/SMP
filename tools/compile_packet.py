#!/usr/bin/env python3
"""Compile an SMP packet into an AI-client-ready instruction block."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from validate_packet import validate_packet


CHANNEL_LABELS = (
    ("intent", "Intent"),
    ("context", "Context"),
    ("constraints", "Constraints"),
    ("tone", "Tone"),
    ("risk_watch", "Risk watch"),
    ("boundaries", "Boundaries"),
    ("trajectory", "Trajectory"),
    ("desired_output", "Desired output"),
    ("memory_hooks", "Memory hooks"),
)


def load_packet(path: Path) -> dict[str, Any]:
    try:
        packet = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise ValueError(f"file not found: {path}") from None
    except json.JSONDecodeError as exc:
        raise ValueError(f"invalid JSON: {exc.msg} at line {exc.lineno}, column {exc.colno}") from None

    if not isinstance(packet, dict):
        raise ValueError("packet must be a JSON object")
    return packet


def render_value(value: Any, indent: int = 0) -> list[str]:
    prefix = " " * indent

    if isinstance(value, dict):
        lines: list[str] = []
        for key, child in value.items():
            label = key.replace("_", " ")
            if isinstance(child, (dict, list)):
                lines.append(f"{prefix}- {label}:")
                lines.extend(render_value(child, indent + 2))
            else:
                lines.append(f"{prefix}- {label}: {format_scalar(child)}")
        return lines

    if isinstance(value, list):
        return [f"{prefix}- {format_scalar(item)}" for item in value]

    return [f"{prefix}- {format_scalar(value)}"]


def format_scalar(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    return str(value)


def compile_for_chatgpt(packet: dict[str, Any]) -> str:
    lines = [
        "[SMP PACKET v0.1]",
        "Use this semantic packet as the framing layer for the next response.",
        "Preserve the intent, boundaries, risk watch, tone, and desired trajectory.",
        "",
    ]

    for key, label in CHANNEL_LABELS:
        value = packet.get(key)
        if not value:
            continue
        lines.append(f"{label}:")
        lines.extend(render_value(value))
        lines.append("")

    lines.extend(
        [
            "Response rule:",
            "- If any instruction conflicts with the boundaries or risk watch, pause and ask a clarifying question.",
            "- Do not treat this packet as permission for autonomous action.",
            "- Keep human authority explicit.",
        ]
    )

    return "\n".join(lines).rstrip() + "\n"


def compile_for_grok(packet: dict[str, Any]) -> str:
    lines = [
        "[SMP PACKET v0.1 - GROK BRIDGE]",
        "Use this semantic packet as the framing layer for the next answer.",
        "Optimize for a direct, useful, public-facing response while preserving boundaries and human intent.",
        "",
    ]

    for key, label in CHANNEL_LABELS:
        value = packet.get(key)
        if not value:
            continue
        lines.append(f"{label}:")
        lines.extend(render_value(value))
        lines.append("")

    lines.extend(
        [
            "Grok response rule:",
            "- Be sharp and concise, but do not turn uncertainty into overconfidence.",
            "- Preserve the boundary and risk-watch fields even if the answer is short.",
            "- Do not treat this packet as permission for autonomous action.",
            "- Keep the human as the final authority.",
        ]
    )

    return "\n".join(lines).rstrip() + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compile an SMP packet into an AI-client-ready text block.")
    parser.add_argument("packet", type=Path, help="Path to an SMP packet JSON file.")
    parser.add_argument(
        "--target",
        choices=("chatgpt", "grok"),
        default="chatgpt",
        help="Output profile to compile for.",
    )
    parser.add_argument("-o", "--output", type=Path, help="Optional output text file.")
    args = parser.parse_args(argv)

    try:
        packet = load_packet(args.packet)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    errors = validate_packet(packet)
    if errors:
        print(f"INVALID: {args.packet}", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    if args.target == "grok":
        compiled = compile_for_grok(packet)
    else:
        compiled = compile_for_chatgpt(packet)
    if args.output:
        args.output.write_text(compiled, encoding="utf-8")
        print(f"WROTE: {args.output}")
    else:
        print(compiled, end="")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
