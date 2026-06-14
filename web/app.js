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
const jsonOutput = document.getElementById("jsonOutput");
const statusLine = document.getElementById("statusLine");
const compiledTab = document.getElementById("compiledTab");
const jsonTab = document.getElementById("jsonTab");

const example = {
  intent: "Write a short X reply announcing that SMP now has its first practical ChatGPT bridge.",
  context: "SMP is an open protocol for increasing semantic bandwidth between humans and AI. GitHub: https://github.com/Krugers123/SMP",
  constraints: "English. Short enough for an X reply. Avoid long theory and private implementation details.",
  tone: "Grounded, optimistic, builder mode.",
  riskWatch: "Avoid hype. Do not claim SMP solves alignment. Do not make safety guarantees.",
  boundaries: "Do not imply autonomous control. Do not imply model weight modification.",
  trajectory: "Preserve SMP as a non-invasive semantic bandwidth layer between humans and AI.",
  desiredOutput: "Short X reply with GitHub link.",
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
    smp_version: "0.1",
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

function compilePacket(packet) {
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

  const lines = [
    "[SMP PACKET v0.1]",
    "Use this semantic packet as the framing layer for the next response.",
    "Preserve the intent, boundaries, risk watch, tone, and desired trajectory.",
    "",
  ];

  channels.forEach(([key, label]) => {
    if (!packet[key]) return;
    lines.push(`${label}:`);
    lines.push(...renderValue(packet[key]));
    lines.push("");
  });

  lines.push("Response rule:");
  lines.push("- If any instruction conflicts with the boundaries or risk watch, pause and ask a clarifying question.");
  lines.push("- Do not treat this packet as permission for autonomous action.");
  lines.push("- Keep human authority explicit.");

  return `${lines.join("\n")}\n`;
}

function validateInputs() {
  const errors = [];
  if (!fields.intent.value.trim()) errors.push("Intent is required.");
  if (!fields.desiredOutput.value.trim()) errors.push("Desired output is required.");
  return errors;
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
    setStatus("Packet ready", "ok");
  }

  const packet = buildPacket();
  jsonOutput.value = JSON.stringify(packet, null, 2);
  compiledOutput.value = errors.length ? "" : compilePacket(packet);
}

function showTab(tabName) {
  const showJson = tabName === "json";
  jsonTab.classList.toggle("active", showJson);
  compiledTab.classList.toggle("active", !showJson);
  jsonTab.setAttribute("aria-selected", String(showJson));
  compiledTab.setAttribute("aria-selected", String(!showJson));
  jsonOutput.classList.toggle("active", showJson);
  compiledOutput.classList.toggle("active", !showJson);
}

async function copyCurrentOutput() {
  const current = jsonOutput.classList.contains("active") ? jsonOutput.value : compiledOutput.value;
  if (!current.trim()) {
    setStatus("Nothing to copy", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(current);
    setStatus("Copied", "ok");
  } catch {
    const target = jsonOutput.classList.contains("active") ? jsonOutput : compiledOutput;
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
jsonTab.addEventListener("click", () => showTab("json"));

Object.values(fields).forEach((field) => {
  field.addEventListener("input", refreshOutputs);
});

loadExample();

