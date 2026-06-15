const fields = {
  intent: document.getElementById("intent"),
  context: document.getElementById("context"),
  constraints: document.getElementById("constraints"),
  tone: document.getElementById("tone"),
  riskWatch: document.getElementById("riskWatch"),
  boundaries: document.getElementById("boundaries"),
  trajectory: document.getElementById("trajectory"),
  desiredOutput: document.getElementById("desiredOutput"),
};

const compiledOutput = document.getElementById("compiledOutput");
const grokOutput = document.getElementById("grokOutput");
const jsonOutput = document.getElementById("jsonOutput");
const statusLine = document.getElementById("statusLine");
const compiledTab = document.getElementById("compiledTab");
const grokTab = document.getElementById("grokTab");
const jsonTab = document.getElementById("jsonTab");
const profileHint = document.getElementById("profileHint");
const profileButtons = Array.from(document.querySelectorAll("[data-profile]"));
const grokPresetButtons = Array.from(document.querySelectorAll("[data-grok-preset]"));

let activeProfile = "standard";
let activeGrokPreset = "default";

const example = {
  intent: "Write a short X reply announcing that SMP now has v0.2 packet profiles and a practical Grok bridge.",
  context: "SMP is an open protocol for increasing semantic bandwidth between humans and AI. GitHub: https://github.com/Krugers123/SMP",
  constraints: "English. Short enough for an X reply. Avoid long theory and private implementation details.",
  tone: "Grounded, optimistic, builder mode.",
  riskWatch: "Avoid hype. Do not claim SMP solves alignment. Do not make safety guarantees.",
  boundaries: "Do not imply autonomous control. Do not imply model weight modification.",
  trajectory: "Preserve SMP as a non-invasive semantic bandwidth layer between humans and AI.",
  desiredOutput: "Short X reply with GitHub link.",
};

const profileConfig = {
  minimal: {
    label: "Minimal",
    hint: "Minimal: intent and output shape for simple low-risk tasks.",
    recommended: ["intent", "desiredOutput"],
  },
  standard: {
    label: "Standard",
    hint: "Standard: context, constraints, tone, trajectory and output shape.",
    recommended: ["intent", "context", "constraints", "tone", "trajectory", "desiredOutput"],
  },
  high_risk: {
    label: "High Risk",
    hint: "High Risk: adds risk watch, boundaries and explicit human authority.",
    recommended: [
      "intent",
      "context",
      "constraints",
      "tone",
      "riskWatch",
      "boundaries",
      "trajectory",
      "desiredOutput",
    ],
  },
};

function compact(value) {
  return value.trim().replace(/\s+/g, " ");
}

function splitLines(value) {
  return value
    .split(/\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPacket() {
  const intent = compact(fields.intent.value);
  const desiredOutput = compact(fields.desiredOutput.value);

  const packet = {
    smp_version: "0.2",
    profile: activeProfile,
    intent: {
      summary: intent,
      success_condition: "The response follows the SMP packet without losing intent, boundaries, tone, or trajectory.",
    },
    desired_output: {
      format: desiredOutput,
      detail_level: "fit to request",
    },
  };

  if (fields.context.value.trim()) {
    packet.context = { summary: compact(fields.context.value) };
  }

  if (fields.constraints.value.trim()) {
    packet.constraints = { items: splitLines(fields.constraints.value) };
  }

  if (fields.tone.value.trim()) {
    packet.tone = { style: compact(fields.tone.value) };
  }

  if (fields.riskWatch.value.trim()) {
    packet.risk_watch = { watch_for: splitLines(fields.riskWatch.value) };
  }

  if (fields.boundaries.value.trim()) {
    packet.boundaries = { must_not: splitLines(fields.boundaries.value) };
  }

  if (fields.trajectory.value.trim()) {
    packet.trajectory = { preserve: compact(fields.trajectory.value) };
  }

  packet.metadata = {
    packet_id: `smp-web-${new Date().toISOString()}`,
    source: "SMP Composer web",
    grok_preset: activeGrokPreset,
  };

  return packet;
}

function formatScalar(value) {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === null) return "null";
  return String(value);
}

function renderValue(value, indent = 0) {
  const prefix = " ".repeat(indent);
  const lines = [];

  if (Array.isArray(value)) {
    value.forEach((item) => {
      lines.push(`${prefix}- ${formatScalar(item)}`);
    });
    return lines;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, child]) => {
      const label = key.replaceAll("_", " ");
      if (child && typeof child === "object") {
        lines.push(`${prefix}- ${label}:`);
        lines.push(...renderValue(child, indent + 2));
      } else {
        lines.push(`${prefix}- ${label}: ${formatScalar(child)}`);
      }
    });
    return lines;
  }

  return [`${prefix}- ${formatScalar(value)}`];
}

function compilePacket(packet, target = "chatgpt") {
  const channels = [
    ["intent", "Intent"],
    ["context", "Context"],
    ["constraints", "Constraints"],
    ["tone", "Tone"],
    ["risk_watch", "Risk watch"],
    ["boundaries", "Boundaries"],
    ["trajectory", "Trajectory"],
    ["desired_output", "Desired output"],
  ];

  const lines =
    target === "grok"
      ? [
          `[SMP PACKET v${packet.smp_version} - GROK BRIDGE]`,
          "Use this semantic packet as the framing layer for the next answer.",
          "Optimize for a direct, useful, public-facing response while preserving boundaries and human intent.",
          "",
        ]
      : [
          `[SMP PACKET v${packet.smp_version}]`,
          "Use this semantic packet as the framing layer for the next response.",
          "Preserve the intent, boundaries, risk watch, tone, and desired trajectory.",
          "",
        ];

  lines.push(`Profile: ${packet.profile}`);
  lines.push("");

  channels.forEach(([key, label]) => {
    if (!packet[key]) return;
    lines.push(`${label}:`);
    lines.push(...renderValue(packet[key]));
    lines.push("");
  });

  if (target === "grok") {
    lines.push("Grok response rule:");
    if (activeGrokPreset === "truth_seek") {
      lines.push("- Be direct, concise, truth-seeking, and useful.");
      lines.push("- Light wit is allowed only when it does not distort meaning.");
    } else {
      lines.push("- Be sharp and concise, but do not turn uncertainty into overconfidence.");
    }
    lines.push("- Preserve the boundary and risk-watch fields even if the answer is short.");
    lines.push("- Do not treat this packet as permission for autonomous action.");
    lines.push("- Keep the human as the final authority.");
  } else {
    lines.push("Response rule:");
    lines.push("- If any instruction conflicts with the boundaries or risk watch, pause and ask a clarifying question.");
    lines.push("- Do not treat this packet as permission for autonomous action.");
    lines.push("- Keep human authority explicit.");
  }

  return `${lines.join("\n")}\n`;
}

function validateInputs() {
  const errors = [];
  if (!fields.intent.value.trim()) errors.push("Intent is required.");
  if (!fields.desiredOutput.value.trim()) errors.push("Desired output is required.");
  return errors;
}

function estimateCoverage() {
  const recommended = profileConfig[activeProfile].recommended;
  const filled = recommended.filter((key) => fields[key].value.trim()).length;
  const ratio = filled / recommended.length;

  if (ratio >= 0.85) return "High";
  if (ratio >= 0.5) return "Medium";
  return "Low";
}

function setStatus(message, type = "") {
  statusLine.textContent = message;
  statusLine.className = `status ${type}`.trim();
}

function refreshOutputs() {
  const errors = validateInputs();
  if (errors.length) {
    setStatus(errors.join(" "), "error");
  } else {
    setStatus(`Packet ready · ${estimateCoverage()} coverage`, "ok");
  }

  const packet = buildPacket();
  jsonOutput.value = JSON.stringify(packet, null, 2);
  compiledOutput.value = errors.length ? "" : compilePacket(packet, "chatgpt");
  grokOutput.value = errors.length ? "" : compilePacket(packet, "grok");
}

function showTab(tabName) {
  const showJson = tabName === "json";
  const showGrok = tabName === "grok";
  const showCompiled = tabName === "compiled";
  jsonTab.classList.toggle("active", showJson);
  grokTab.classList.toggle("active", showGrok);
  compiledTab.classList.toggle("active", showCompiled);
  jsonTab.setAttribute("aria-selected", String(showJson));
  grokTab.setAttribute("aria-selected", String(showGrok));
  compiledTab.setAttribute("aria-selected", String(showCompiled));
  jsonOutput.classList.toggle("active", showJson);
  grokOutput.classList.toggle("active", showGrok);
  compiledOutput.classList.toggle("active", showCompiled);
}

async function copyCurrentOutput() {
  const current = jsonOutput.classList.contains("active")
    ? jsonOutput.value
    : grokOutput.classList.contains("active")
      ? grokOutput.value
      : compiledOutput.value;
  if (!current.trim()) {
    setStatus("Nothing to copy", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(current);
    setStatus("Copied", "ok");
  } catch {
    const target = jsonOutput.classList.contains("active")
      ? jsonOutput
      : grokOutput.classList.contains("active")
        ? grokOutput
        : compiledOutput;
    target.focus();
    target.select();
    setStatus("Select and copy manually", "error");
  }
}

function downloadJson() {
  const packet = buildPacket();
  const blob = new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smp_packet.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function loadExample() {
  Object.entries(example).forEach(([key, value]) => {
    fields[key].value = value;
  });
  refreshOutputs();
}

function setProfile(profile) {
  activeProfile = profile;
  profileButtons.forEach((button) => {
    const isActive = button.dataset.profile === profile;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  profileHint.textContent = profileConfig[profile].hint;
  refreshOutputs();
}

function setGrokPreset(preset) {
  activeGrokPreset = preset;
  grokPresetButtons.forEach((button) => {
    const isActive = button.dataset.grokPreset === preset;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  refreshOutputs();
}

function clearFields() {
  Object.values(fields).forEach((field) => {
    field.value = "";
  });
  refreshOutputs();
}

document.getElementById("compileBtn").addEventListener("click", refreshOutputs);
document.getElementById("copyBtn").addEventListener("click", copyCurrentOutput);
document.getElementById("downloadBtn").addEventListener("click", downloadJson);
document.getElementById("loadExampleBtn").addEventListener("click", loadExample);
document.getElementById("clearBtn").addEventListener("click", clearFields);
compiledTab.addEventListener("click", () => showTab("compiled"));
grokTab.addEventListener("click", () => showTab("grok"));
jsonTab.addEventListener("click", () => showTab("json"));

profileButtons.forEach((button) => {
  button.addEventListener("click", () => setProfile(button.dataset.profile));
});

grokPresetButtons.forEach((button) => {
  button.addEventListener("click", () => setGrokPreset(button.dataset.grokPreset));
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", refreshOutputs);
});

setProfile("standard");
setGrokPreset("default");
loadExample();
