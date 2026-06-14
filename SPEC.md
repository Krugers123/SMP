# SMP v0.1 Draft Specification

Status: Draft

SMP - Semantic Multiplex Protocol is a protocol for carrying richer human intent to AI systems through structured semantic packets.

## 1. Purpose

SMP exists to reduce semantic loss in human-AI communication.

It does this by separating meaning into explicit channels instead of forcing every layer of intent into a single linear prompt.

## 2. Packet

An SMP packet is a structured object that may contain:

- intent,
- context,
- constraints,
- tone,
- risk watch,
- boundaries,
- trajectory,
- desired output,
- memory hooks,
- metadata.

The packet is not a command by itself. It is an inspectable frame of meaning that a human or AI interface can use to guide an interaction.

## 3. Required Fields

For SMP v0.1, the minimal required fields are:

- `smp_version`
- `intent`
- `desired_output`

All other fields are optional but recommended when the interaction carries high context, ambiguity, risk, or a strong desired trajectory.

## 4. Channel Semantics

### intent

Describes what the human is trying to accomplish.

### context

Provides background that changes how the request should be interpreted.

### constraints

Defines practical requirements, limits, forbidden approaches, compatibility needs, or fixed conditions.

### tone

Describes the desired interaction style or emotional texture.

### risk_watch

Lists known risks, failure modes, or areas where the AI should slow down and preserve uncertainty.

### boundaries

Defines what must not be done, assumed, exposed, claimed, or automated.

### trajectory

Describes the direction the interaction should preserve over time.

### desired_output

Defines the expected form, audience, depth, acceptance criteria, or artifact type.

### memory_hooks

Provides continuity anchors that may help future interactions preserve important meaning.

### metadata

Contains packet identifiers, timestamps, source information, and compatibility notes.

## 5. Consumer Responsibilities

An SMP consumer is any tool, assistant, agent, IDE, dashboard, or interface that reads an SMP packet.

Consumers should:

- preserve packet meaning where possible,
- avoid silently discarding risk and boundary fields,
- expose meaningful conflicts to the human,
- keep human authority explicit in consequential contexts,
- document any implementation-specific translation from SMP fields into prompts, tool calls, plans, or UI state.

## 6. Non-Goals

SMP does not:

- modify model weights,
- guarantee safety,
- guarantee truth,
- replace human review,
- define autonomous control behavior,
- require a specific model provider,
- require private infrastructure.

## 7. Safety Boundary

SMP can carry boundaries and risk information, but it does not enforce them by itself.

Any implementation that uses SMP in high-impact contexts must rely on additional governance, review, and domain-specific safety controls.

## 8. Compatibility

SMP v0.1 is intentionally small and human-readable.

Future versions may add:

- stricter field definitions,
- packet profiles,
- validators,
- UI bindings,
- multimodal input mappings,
- interoperability tests.

## 9. Reference Tools

The public repository includes two minimal reference tools:

- `tools/validate_packet.py` checks SMP v0.1 packet structure.
- `tools/compile_packet.py` compiles a packet into a ChatGPT-ready semantic frame.

These tools are reference implementations, not the full protocol.
