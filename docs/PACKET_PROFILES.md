# Packet Profiles

SMP v0.2 introduces packet profiles.

Profiles help users choose how much semantic structure a request needs.

They are not safety guarantees and they are not permission systems. They are lightweight composition modes.

## minimal

Use `minimal` when the task is simple and low-risk.

Recommended channels:

- intent,
- desired_output.

Example:

```text
Intent:
- write a short reply

Desired Output:
- concise X post
```

## standard

Use `standard` for most creative, coding, writing, planning, and analysis tasks.

Recommended channels:

- intent,
- context,
- constraints,
- tone,
- trajectory,
- desired_output.

This profile reduces ordinary prompt friction without making the packet heavy.

## high_risk

Use `high_risk` when the task has meaningful uncertainty, public impact, safety concerns, governance constraints, or possible overclaiming risk.

Recommended channels:

- intent,
- context,
- constraints,
- tone,
- risk_watch,
- boundaries,
- trajectory,
- desired_output.

This profile should keep human authority explicit.

## Semantic Coverage Estimate

The SMP Composer may show a simple semantic coverage estimate:

```text
Low / Medium / High
```

This is not a scientific score.

It is a practical signal that helps the user notice whether important channels are missing for the selected profile.

