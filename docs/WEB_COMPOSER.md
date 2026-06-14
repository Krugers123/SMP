# SMP Web Composer

The SMP Web Composer is a small local browser tool for creating SMP packets and compiling them into ChatGPT-ready frames.

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

1. Fill the SMP channels.
2. Click `Compile`.
3. Copy the `ChatGPT Frame`.
4. Paste it into ChatGPT before the actual task, or use it as the task itself.

## Current Boundary

This is a local composer and bridge tool.

It does not connect directly to ChatGPT, enforce model behavior, or perform autonomous actions. It creates a clearer semantic frame for the user to inspect and paste manually.

