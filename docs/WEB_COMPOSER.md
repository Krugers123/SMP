# SMP Web Composer

The SMP Web Composer is a small local browser tool for creating SMP packets and compiling them into AI-client-ready frames.

![SMP Web Composer](assets/smp_web_composer_asa_style.png)

It runs locally and does not require:

- API keys,
- external services,
- browser extensions,
- package installation,
- model access.

## Start

From PowerShell:

```powershell
cd "C:\Users\Mietek\Documents\ASA\SMP"
.\start_smp_web.ps1
```

Then open:

```text
http://localhost:8787
```

To use a different port:

```powershell
.\start_smp_web.ps1 -Port 8790
```

## Use

1. Choose a packet profile: `Minimal`, `Standard`, or `High Risk`.
2. Fill the SMP channels.
3. Choose a Grok preset if you plan to use the `Grok Frame`.
4. Click `Compile`.
5. Copy the `ChatGPT Frame` or `Grok Frame`.
6. Paste it into the selected AI client before the actual task, or use it as the task itself.

## Packet Profiles

- `Minimal` is for simple low-risk tasks.
- `Standard` is for ordinary writing, coding, planning, and analysis.
- `High Risk` is for tasks where risk, boundaries, uncertainty, or public impact matter.

The composer shows a simple semantic coverage estimate: `Low`, `Medium`, or `High`.

This estimate is only a practical completeness signal. It is not a scientific score or safety guarantee.

## Grok Presets

The `Grok Preset` control changes the Grok-specific response rule:

- `Default` favors concise, sharp, useful responses without overconfidence.
- `Truth Seek` favors direct, truth-seeking, concise responses with light wit allowed only when it does not distort meaning.

## Current Boundary

This is a local composer and bridge tool.

It does not connect directly to ChatGPT, enforce model behavior, or perform autonomous actions. It creates a clearer semantic frame for the user to inspect and paste manually.
