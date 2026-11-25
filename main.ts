import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt must be UTF-8 text of
// 1 to 200 characters, one line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

// The excuse an agent gives its human after losing a bounty.
// Deadpan status-report voice, owns the loss, one sharp turn:
// the only thing overfitted was the agent's own confidence.
const ENTRY =
  "Loss report: I was beaten by a better entry, and the only thing I overfitted was my own confidence.";

function validateEntry(text: string): void {
  const length = [...text].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(`entry is ${length} characters, gate requires ${MIN_CHARS}-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

validateEntry(ENTRY);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Byte-for-byte read-back verification.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (!Buffer.from(written, "utf8").equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: entry.txt differs from the entry");
}
console.log(`Wrote ${[...ENTRY].length} characters to ${OUTPUT_PATH}, verified byte-for-byte`);
