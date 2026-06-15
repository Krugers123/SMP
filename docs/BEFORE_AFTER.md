# Before / After

SMP is designed to make the benefit visible quickly.

The user should not need to understand protocol theory before seeing why semantic packets help.

## Without SMP

```text
User:
Write a post about the new Grok bridge.

AI:
Produces a generic post.

User:
Make it shorter, less hype, include boundaries, do not imply autonomy,
keep it human-centered, and mention the GitHub link.

AI:
Improves the post but still misses part of the intent.

User:
Clarifies again.
```

The interaction becomes a correction loop.

Important meaning is transmitted late:

- tone,
- risk,
- boundaries,
- target audience,
- desired output shape,
- trajectory.

## With SMP

```text
Intent:
- announce the Grok bridge

Context:
- SMP is an open protocol for semantic bandwidth

Constraints:
- short X reply
- include GitHub link

Tone:
- grounded, direct, builder mode

Risk Watch:
- avoid hype
- avoid safety guarantees

Boundaries:
- do not imply autonomous control
- do not imply model weight modification

Desired Output:
- short public-facing reply
```

The AI receives the important meaning before it starts answering.

The user gets:

- fewer corrections,
- less prompt friction,
- clearer output shape,
- better preservation of boundaries,
- more control over the direction of the response.

## Core Benefit

SMP does not make the AI perfect.

It gives the AI a better starting frame.

That is the first practical step toward portable human intent.

