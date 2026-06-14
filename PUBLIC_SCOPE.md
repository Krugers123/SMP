# Public Scope

This repository defines the public, open-source surface of SMP - Semantic Multiplex Protocol.

The public scope is intended to be understandable, inspectable, and safe to discuss openly.

## In Scope

- Public protocol framing.
- General semantic packet structure.
- Neutral example packets.
- Human-centered interaction principles.
- Governance and boundary documents.
- Public-safe architecture descriptions.
- Draft JSON schema for interoperable SMP packets.

## Out of Scope

- Private scoring methods.
- Sensitive evaluation datasets.
- Deployment-specific adapter logic.
- Security-sensitive prompts or control policies.
- Private ASA, ASC, or ASA7 implementation details.
- Any mechanism that claims to guarantee model alignment or autonomous safety.

## Public Safety Rule

Public SMP documents may describe the shape of semantic transmission, but must not expose private thresholds, internal risk scoring, protected workflows, or operational control logic.

## Relationship To The ASA Ecosystem

SMP can interoperate with the broader ASA ecosystem, but it has a distinct role:

```text
ASA observes trajectory state.
ASC recommends bounded stabilization paths.
SMP improves semantic bandwidth between human and AI.
Human authority remains explicit.
```

