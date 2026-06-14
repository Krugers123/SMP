# SMP Examples

This document explains the neutral examples included in `examples/`.

## Minimal Packet

`examples/minimal_packet.json` shows the smallest useful SMP packet. It carries intent and desired output shape without requiring detailed context.

## Coding Task Packet

`examples/coding_task_packet.json` shows how SMP can carry implementation intent, repository constraints, risk watch items, and verification expectations.

## ChatGPT Bridge Packet

`examples/chatgpt_bridge_packet.json` shows how SMP can frame a real ChatGPT interaction before native client integration exists.

It can be compiled with:

```powershell
python tools/compile_packet.py examples/chatgpt_bridge_packet.json
```

## Creative Direction Packet

`examples/creative_direction_packet.json` shows how SMP can carry style, emotional tone, audience, and trajectory without over-constraining the output.

## High-Risk Decision Packet

`examples/high_risk_decision_packet.json` shows how SMP can keep boundaries and human review explicit in consequential contexts.

This example is not a safety guarantee. It is a demonstration of how risk and authority information can travel with a request.
