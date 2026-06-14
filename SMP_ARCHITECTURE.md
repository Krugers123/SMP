# SMP Architecture

SMP is a protocol layer for structured semantic transmission between humans and AI systems.

It is designed to sit before or beside an AI interaction, not inside the model.

## Layer Model

```text
Human intention
      |
      v
SMP semantic packet
      |
      v
AI interface / agent / assistant / tool
      |
      v
Model or model-backed system
      |
      v
Response, action proposal, or artifact
```

## Design Principles

- Human authority remains explicit.
- Meaning should be inspectable before it is acted on.
- Ambiguity should be preserved when it matters, not silently flattened.
- Risk and boundary information should travel with the task.
- The protocol should be useful without requiring a specific model provider.
- The public protocol should remain simple enough for humans to read.

## Main Components

### Semantic Packet

A structured object that carries intent, context, constraints, tone, risks, boundaries, trajectory, memory hooks, and desired output shape.

### Channels

Named lanes of meaning inside the packet. Each channel represents a type of information that is often lost when ordinary language is compressed into a single prompt.

### Consumer

Any AI system, agent, interface, or tool that reads an SMP packet and uses it to shape an interaction.

### Validator

Optional software that checks whether a packet is well-formed, complete enough for a given task, and compatible with local policy.

## Non-Goals

SMP does not define model internals, autonomous execution logic, or hidden control systems. It is a protocol for carrying meaning, not a replacement for governance.

