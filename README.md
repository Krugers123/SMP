# SMP - Semantic Multiplex Protocol

SMP is an open-source protocol for increasing the bandwidth of meaning between humans and AI systems.

Human-AI interaction is still often compressed into a narrow, mostly linear text channel:

- one message,
- one response,
- one correction,
- one clarification.

But human intent rarely arrives as a single line of text. It often carries context, uncertainty, emotion, boundaries, risk, desired tone, memory, and a preferred trajectory at the same time.

SMP explores a structured way to transmit those layers as semantic packets.

## Core Idea

SMP is not just better prompting and not just longer context.

It is a protocol for carrying multiple channels of meaning in a clear, inspectable, and human-centered format:

- what the human wants,
- why it matters,
- what must not be lost,
- what tone is needed,
- what risks should be watched,
- what boundaries must remain active,
- what trajectory the interaction should preserve,
- what shape the output should take.

## Public Formula

```text
ASA observes.
ASC stabilizes.
SMP increases semantic bandwidth.
Human authority remains explicit.
```

## Project Status

SMP is currently in `v0` design stage.

This repository contains public-safe protocol documents, draft packet models, and neutral examples. It does not contain private scoring systems, hidden control logic, deployment details, or sensitive evaluation data.

## What SMP Is

- A protocol for structured human intent transmission.
- A semantic packet model for human-AI interaction.
- A public interface layer that can be used by agents, assistants, IDEs, dashboards, and decision-support tools.
- A way to reduce semantic loss between what a human means and what an AI system receives.

## What SMP Is Not

- SMP is not an AI model.
- SMP does not modify model weights.
- SMP is not an autonomous control system.
- SMP does not replace human authority.
- SMP is not a guarantee of alignment, truth, or safety.
- SMP is not a hidden backend or proprietary prompt wrapper.

## Repository Map

```text
.
├── README.md
├── PUBLIC_SCOPE.md
├── SMP_ARCHITECTURE.md
├── SMP_BOUNDARIES.md
├── SMP_PACKET_MODEL.md
├── SMP_EXAMPLES.md
├── GOVERNANCE.md
├── DISCLAIMER.md
├── LICENSE
├── schemas/
│   └── smp_packet.v0.json
└── examples/
    ├── minimal_packet.json
    ├── coding_task_packet.json
    ├── creative_direction_packet.json
    └── high_risk_decision_packet.json
```

## License

SMP is released under the Apache License 2.0.

