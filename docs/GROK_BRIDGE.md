# Grok Bridge

The SMP Grok Bridge compiles an SMP packet into a compact frame that can be pasted into Grok or used for Grok/X-facing writing.

It uses the same SMP packet model as the ChatGPT bridge. The difference is the output profile: the Grok bridge favors directness, public readability, and short-form response control.

## Validate A Packet

```powershell
python tools/validate_packet.py examples/grok_bridge_packet.json
```

## Compile A Packet For Grok

```powershell
python tools/compile_packet.py examples/grok_bridge_packet.json --target grok
```

Optional truth-seeking preset:

```powershell
python tools/compile_packet.py examples/grok_bridge_packet.json --target grok --grok-preset truth_seek
```

The output begins with:

```text
[SMP PACKET v0.1 - GROK BRIDGE]
Use this semantic packet as the framing layer for the next answer.
```

Paste the compiled frame into Grok before the actual request, or use it as the full request when the packet already contains the task.

## Current Boundary

This bridge does not connect directly to Grok, enforce model behavior, or automate posting on X.

It only gives Grok a clearer semantic frame: intent, context, constraints, tone, risks, boundaries, trajectory, profile, and desired output.
