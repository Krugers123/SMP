# ChatGPT Bridge

The SMP ChatGPT Bridge is the first practical use of SMP.

It converts an SMP semantic packet into a compact instruction block that can be pasted into ChatGPT or a compatible AI assistant.

This is intentionally non-invasive:

- no browser extension,
- no API key,
- no model modification,
- no autonomous action,
- no hidden prompt layer.

## Flow

```text
rough human thought
      |
      v
SMP packet JSON
      |
      v
validate_packet.py
      |
      v
compile_packet.py
      |
      v
ChatGPT-ready semantic frame
```

## Validate A Packet

```powershell
python tools/validate_packet.py examples/chatgpt_bridge_packet.json
```

Expected result:

```text
VALID: examples/chatgpt_bridge_packet.json
```

## Compile A Packet For ChatGPT

```powershell
python tools/compile_packet.py examples/chatgpt_bridge_packet.json
```

The output is a structured text block:

```text
[SMP PACKET v0.2]
Use this semantic packet as the framing layer for the next response.
Preserve the intent, boundaries, risk watch, tone, and desired trajectory.

Profile: standard

Intent:
- summary: ...

Response rule:
- If any instruction conflicts with the boundaries or risk watch, pause and ask a clarifying question.
- Do not treat this packet as permission for autonomous action.
- Keep human authority explicit.
```

Paste that block into ChatGPT before the actual task or use it as the task itself.

## Why This Matters

The bridge makes SMP useful before native client integration exists.

It lets humans transmit:

- intent,
- context,
- tone,
- risk,
- boundaries,
- trajectory,
- desired output,

as one compact semantic frame.

## Current Boundary

This bridge does not make ChatGPT enforce SMP fields.

It only gives the model a clearer, denser, more inspectable framing layer. Human review remains necessary, especially in consequential contexts.
