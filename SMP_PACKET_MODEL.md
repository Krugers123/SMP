# SMP Packet Model

The SMP packet is a structured container for multiple channels of meaning.

It is meant as a compact cognitive frame: a way to carry several layers of human intent without forcing everything through one long prompt.

The `v0` packet model is intentionally simple. It is designed to be readable by humans and portable across tools.

## Packet Shape

```json
{
  "smp_version": "0.1",
  "intent": {},
  "context": {},
  "constraints": {},
  "tone": {},
  "risk_watch": {},
  "boundaries": {},
  "trajectory": {},
  "desired_output": {},
  "memory_hooks": {},
  "metadata": {}
}
```

## Channels

### Intent

What the human wants to accomplish.

### Context

Relevant background that changes how the request should be understood.

### Constraints

Requirements, limits, formats, tools, deadlines, or non-negotiable conditions.

### Tone

The desired interaction style or emotional texture.

### Risk Watch

Known risks, failure modes, sensitive topics, or areas where extra care is needed.

### Boundaries

Actions, assumptions, claims, or outputs that must be avoided.

### Trajectory

The direction the interaction should preserve over time.

### Desired Output

Expected artifact shape, level of detail, audience, and acceptance criteria.

### Memory Hooks

Continuity markers that help future interactions preserve important meaning.

### Metadata

Protocol version, packet id, creation time, source, and optional compatibility information.

## Design Note

SMP should not force every interaction to become heavy or bureaucratic. A minimal packet can be small. A high-risk or high-context interaction can carry more channels.

The protocol should compress meaning, not personality. The goal is to help humans move faster with AI while preserving nuance, boundaries, and direction.
