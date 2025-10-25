#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const NOTE_LOOKUP = new Map(
  Object.entries({
    "Wall Sit Test (Squat Isometric Endurance)":
      "Y nghia: danh gia suc ben co dui truoc (quadriceps), core ho tro, thang bang co ban.",
    "Plank Hold Test (Core Endurance)": "Y nghia: do suc ben core, kha nang kiem soat cot song.",
    "Sit-to-Stand Test (Lower Body Strength & Coordination)":
      "Y nghia: suc manh, toc do, kiem soat thang bang co ban.",
    "Push-up Modified Test (Upper Body Endurance)": "Y nghia: suc manh - suc ben co nguc, vai, tay sau.",
    "Dumbbell Goblet Squat Endurance Test":
      "Y nghia: danh gia suc ben co chan, kha nang kiem soat squat co tai.",
    "Dumbbell Step-Back Lunge Test":
      "Y nghia: do suc manh, thang bang, phoi hop lower body + core.",
    "Push up test": "Y nghia: suc manh - suc ben co nguc, vai, tay sau.",
    "Dumbbell Deadlift-to-Row": "Y nghia: suc manh + phoi hop (hip hinge + pull).",
    "Dumbbell Thruster Test": "Y nghia: do suc manh toan than + phoi hop + nhip tim.",
    "Dumbbell Step-Up Test": "Y nghia: suc manh chan + thang bang + cardio nhe.",
    "Modified Burpee Test": "Y nghia: do cong suat tim mach + phoi hop toan than.",
  }).map(([key, value]) => [key.toLowerCase(), value]),
);

const rawData = `Tuan,Ngay,Bai tap,So reps / sets,Video,Thoi luong 30p
19/11-25/11,19/11,,,Link,
,20/11,,,Link,
,21/11,,,Link,
,22/11,,,Link,
,23/11,,,Link,
,24/11,,,Link,
,25/11,Stretching,,Link,
,,
26/11-2/12,26/11,Glute Bridge,12 reps x 2 sets,Link,
,,Static Lunge,,Link,
,,Squat to Chair,,Link,
,,Incline Push-up,,Link,
,,
,27/11,Wall Sit,30s x 3 sets,Link,
,,Plank,30s x 3 sets,Link,
,,Bird Dog,12 reps x 2 sets,Link,
,,Reverse Lunge,,Link,
,,
,28/11,Single Leg Hip Bridge,12 reps x 2 sets,Link,
,,Superman,,Link,
,,Side Lunge,,Link,
,,Squat,,Link,
,,
,29/11,Prone Y Raise,12 reps x 2 sets,Link,
,,Deadbug,,Link,
,,Hip Hinge Reach,,Link,
,,Static Lunge,,Link,
,,
,30/11,Side Plank,30s x 2 sets,Link,
,,Forward Lunge,12 reps x 2 sets,Link,
,,Prone Lying Scap Retraction,,Link,
,,Wall Slide,,Link,
,,
,"01/12/2025
Test",Wall Sit Test (Squat Isometric Endurance),Form test,Link,"Y nghia: danh gia suc ben co dui truoc (quadriceps), core ho tro, thang bang co ban."
,,Plank Hold Test (Core Endurance),,Link,"Y nghia: do suc ben core, kha nang kiem soat cot song."
,,Sit-to-Stand Test (Lower Body Strength & Coordination),,Link,"Y nghia: suc manh, toc do, kiem soat thang bang co ban."
,,Push-up Modified Test (Upper Body Endurance),,Link,"Y nghia: suc manh - suc ben co nguc, vai, tay sau."
,,
,02/12,Stretching,,Link,
,,
3/12-9/12,3/12,Dumbbell Floor Press,12 reps x 2 sets,Link,
,,Dumbbell Romanian Deadlift,,Link,
,,Goblet Squat,,Link,
,,Dumbbell Static Lunge,,Link,
,,
,4/12,Wall Sit + Dumbbell Curl,12 reps x 2 sets,Link,
,,Dumbbell Reverse Lunge,,Link,
,,Dumbbell Single-Leg Deadlift,,Link,
,,Dumbbell Row,,Link,
,,
,4/12,Glute Bridge,12 reps x 2 sets,Link,
,,Dumbbell Lateral Lunge,,Link,
,,Shoulder Press,,Link,
,,Dumbbell Reverse Fly,,Link,
,,
,5/12,Bear Crawl Hold,30s x 2 sets,Link,
,,Dumbbell Front Squat,12 reps x 2 sets,Link,
,,Dumbbell Romanian Deadlift,,Link,
,,Renegade Row,,Link,
,,
,6/12,Shoulder Tap,12 reps x 2 sets,Link,
,,Thruster,,Link,
,,Dumbbell Forward Lunge,,Link,
,,Lateral Raise,,Link,
,,
,7/12,Deadbug,12 reps x 2 sets,Link,
,,Goblet Squat,,Link,
,,Dumbbell Reverse Lunge,,Link,
,,Dumbbell Front Raise,,Link,
,,
,8/12,Side Plank,30s x 2 sets,Link,
,,Dumbbell Romanian Deadlift,12 reps x 2 sets,Link,
,,Dumbbell Reverse Lunge,,Link,
,,Dumbbell Row,,Link,
,,
,9/12,Stretching,,Link,
,,
10/12-16/12,10/12,Single-Leg Glute Bridge Hold,12 reps x 2 sets,Link,
,,Staggered Stance Squat,,Link,
,,Dumbbell Split Squat,,Link,
,,Renegade Row,,Link,
,,
,11/12,Lateral Lunge to Balance,12 reps x 2 sets,Link,
,,Reverse Lunge + Dumbbell Bicep Curl,,Link,
,,Dumbbell Single-Leg Romanian Deadlift,,Link,
,,Dumbbell Single-Arm Row,,Link,
,,
,12/12,Russian Twist,,Link,
,,Lunge to Balance,,Link,
,,Thruster,,Link,
,,Plank + Dumbbell Pull Through,,Link,
,,
,13/12,Bird Dog,,Link,
,,Good Morning to Calf Raise,,Link,
,,Shoulder Press,,Link,
,,Dumbbell Floor Chest Fly,,Link,
,,
,14/12,Glute Bridge March,,Link,
,,Thruster,,Link,
,,Staggered Stance Deadlift,,Link,
,,Prone Y-T Raise,,Link,
,,
,"15/12/2025
Test",Wall Sit Test (Squat Isometric Endurance),Form test,Link,"Y nghia: danh gia suc ben co dui truoc (quadriceps), core ho tro, thang bang co ban."
,,Plank Hold Test (Core Endurance),,Link,"Y nghia: do suc ben core, kha nang kiem soat cot song."
,,Sit-to-Stand Test (Lower Body Strength & Coordination),,Link,"Y nghia: suc manh, toc do, kiem soat thang bang co ban."
,,Push-up Modified Test (Upper Body Endurance),,Link,"Y nghia: suc manh - suc ben co nguc, vai, tay sau."
,,
,16/12,Stretching,,,
,,
17/12-23/12,17/12,,,Link,
,18/12,,,Link,
,19/12,,,Link,
,20/12,,,Link,
,21/12,,,Link,
,22/12,,,Link,
,23/12,Stretching,,Link,
,,
,,
24/12-30/12,24/12,,,Link,
,25/12,,,Link,
,26/12,,,Link,
,27/12,,,Link,
,28/12,,,Link,
,"29/12/2025
Test",Dumbbell Goblet Squat Endurance Test,Form test,Link,"Y nghia: danh gia suc ben co chan, kha nang kiem soat squat co tai."
,,Dumbbell Step-Back Lunge Test,,Link,"Y nghia: do suc manh, thang bang, phoi hop lower body + core."
,,Push up test,,Link,"Y nghia: suc manh - suc ben co nguc, vai, tay sau."
,,Dumbbell Deadlift-to-Row,,Link,"Y nghia: suc manh + phoi hop (hip hinge + pull)."
,30/12,Stretching,,Link,
,,
31/12-06/01,31/12,,,Link,
,1/1,,,Link,
,2/1,,,Link,
,3/1,,,Link,
,4/1,,,Link,
,5/1,,,Link,
,6/1,Stretching,,Link,
,,
07/01-13/01,7/1,,,Link,
,8/1,,,Link,
,9/1,,,Link,
,10/1,,,Link,
,11/1,,,Link,
,"12/01/2026
Test",Dumbbell Goblet Squat Endurance Test,Form test,Link,"Y nghia: danh gia suc ben co chan, kha nang kiem soat squat co tai."
,,Dumbbell Step-Back Lunge Test,,Link,"Y nghia: do suc manh, thang bang, phoi hop lower body + core."
,,Push up test,,Link,"Y nghia: suc manh - suc ben co nguc, vai, tay sau."
,,Dumbbell Deadlift-to-Row,,Link,"Y nghia: suc manh + phoi hop (hip hinge + pull)."
,13/1,Stretching,,Link,
,,
14/01-20/01,14/1,,,Link,
,15/1,,,Link,
,16/1,,,Link,
,17/1,,,Link,
,18/1,,,Link,
,19/1,,,Link,
,20/1,Mobility,,Link,
,,
21/01-27/01,21/1,,,Link,
,22/1,,,Link,
,23/1,,,Link,
,24/1,,,Link,
,25/1,,,Link,
,"26/01/2026
Test",Dumbbell Thruster Test,Form test,Link,"Y nghia: do suc manh toan than + phoi hop + nhip tim."
,,Dumbbell Step-Up Test,,Link,"Y nghia: suc manh chan + thang bang + cardio nhe."
,,Dumbbell Deadlift-to-Row,,Link,"Y nghia: suc manh + phoi hop (hip hinge + pull)."
,,Modified Burpee Test,,Link,"Y nghia: do cong suat tim mach + phoi hop toan than."
,27/1,Mobility,,Link,
,,
28/01-03/02,28/1,,,Link,
,29/1,,,Link,
,30/1,,,Link,
,31/1,,,Link,
,1/2,,,Link,
,2/2,,,Link,
,3/2,Stretching,,Link,
,,
04/02-10/02,4/2,,,Link,
,5/2,,,Link,
,6/2,,,Link,
,7/2,,,Link,
,8/2,,,Link,
"09/02/2026
Test",Dumbbell Thruster Test,Form test,Link,"Y nghia: do suc manh toan than + phoi hop + nhip tim."
,,Dumbbell Step-Up Test,,Link,"Y nghia: suc manh chan + thang bang + cardio nhe."
,,Dumbbell Deadlift-to-Row,,Link,"Y nghia: suc manh + phoi hop (hip hinge + pull)."
,,Modified Burpee Test,,Link,"Y nghia: do cong suat tim mach + phoi hop toan than."
,10/2,Stretching,,Link,
,,
11/02-17/02,11/2,,,Link,
,12/2,,,Link,
,13/2,,,Link,
,14/2,,,Link,
,15/2,,,Link,
,16/2,,,Link,
,17/2,Stretching,,Link,
,,
18/02-24/02,18/2,,,Link,
,19/2,,,Link,
,20/2,,,Link,
,21/2,,,Link,
,22/2,,,Link,
,23/2,,,Link,
,24/2,Mobility,,Link,
,,
25/02 - Final day,25/02,Plank Hold,1 phut,"20 phut
Nam: Dumbbell 10 kg
Nu: Dumbbell 5 kg",,
, ,Push-up,20 reps,,,
, ,Dumbbell Thruster,,,,
, ,Dumbbell Romanian Deadlift,,,,
, ,Dumbbell Forward Lunge,,,,
, ,Dumbbell Shoulder Press,,,,
, ,Dumbbell Bent-Over Row,,,,
, ,Burpee,,,,`;

function splitLinesPreservingQuotes(data) {
  const lines = [];
  let buffer = "";
  let inQuotes = false;

  for (let i = 0; i < data.length; i += 1) {
    const char = data[i];
    const next = data[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        buffer += '""';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      buffer += '"';
      continue;
    }

    if (char === "\r") {
      continue;
    }

    if (char === "\n" && !inQuotes) {
      lines.push(buffer.trimEnd());
      buffer = "";
      continue;
    }

    buffer += char;
  }

  if (buffer) {
    lines.push(buffer.trimEnd());
  }

  return lines;
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

const rows = splitLinesPreservingQuotes(rawData)
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line) => parseCsvLine(line).map((cell) => cell.trim()));

const dayMap = new Map();

let currentWeek = "";
let currentYear = 2025;
let lastMonth = null;
let currentIsoDate = null;

const headerKeywords = new Set(["tuan", "ngay", "bai tap", "so reps / sets", "video", "thoi luong 30p"]);

for (const row of rows) {
  if (row.length === 0) {
    continue;
  }

  const weekRaw = row[0] ?? "";
  if (weekRaw && !headerKeywords.has(weekRaw.toLowerCase())) {
    currentWeek = weekRaw;
  }

  const dateRaw = row[1] ?? "";
  let isoDate = null;

  if (dateRaw) {
    const dateMatch = dateRaw.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?/);
    if (!dateMatch) {
      continue;
    }

    const dayNum = Number.parseInt(dateMatch[1], 10);
    const monthNum = Number.parseInt(dateMatch[2], 10);
    const explicitYear = dateMatch[3] ? Number.parseInt(dateMatch[3], 10) : null;

    if (!Number.isInteger(dayNum) || !Number.isInteger(monthNum)) {
      continue;
    }

    if (explicitYear) {
      currentYear = explicitYear;
    } else if (lastMonth !== null && monthNum < lastMonth) {
      if (lastMonth === 12) {
        currentYear += 1;
      } else if (lastMonth - monthNum > 6) {
        currentYear += 1;
      }
    }

    lastMonth = monthNum;

    const yearNum = explicitYear ?? currentYear;
    isoDate = `${String(yearNum).padStart(4, "0")}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    currentIsoDate = isoDate;
  } else {
    isoDate = currentIsoDate;
  }

  if (!isoDate) {
    continue;
  }

  let entry = dayMap.get(isoDate);
  if (!entry) {
    entry = {
      date: isoDate,
      weekRange: currentWeek || null,
      items: [],
    };
    dayMap.set(isoDate, entry);
  }

  const nameRaw = (row[2] ?? "").trim();
  const name = nameRaw.replace(/\s+/g, " ");
  const details = (row[3] ?? "").trim() || null;
  const videoField = (row[4] ?? "").trim();
  const noteRaw = (row[5] ?? "").trim();

  if (!name) {
    continue;
  }

  const typeSource = `${name} ${details ?? ""} ${dateRaw} ${currentWeek}`.toLowerCase();
  const type = typeSource.includes("test") || typeSource.includes("final") ? "test" : "exercise";
  const normalizedNameKey = name.toLowerCase();
  const noteFromLookup = NOTE_LOOKUP.get(normalizedNameKey);

  const cleanedVideoValue = videoField && videoField.toLowerCase() !== "link" ? videoField : "";
  const videoUrl = cleanedVideoValue && /^https?:\/\//i.test(cleanedVideoValue) ? cleanedVideoValue : null;

  let combinedNote = noteFromLookup ?? (noteRaw || null);
  if (!videoUrl && cleanedVideoValue) {
    combinedNote = combinedNote ? `${combinedNote} ${cleanedVideoValue}` : cleanedVideoValue;
  }

  entry.items.push({
    type,
    name,
    details,
    videoUrl,
    note: combinedNote,
  });
}

const schedule = Array.from(dayMap.values())
  .map((entry) => {
    if (!entry.weekRange) {
      const { weekRange, ...rest } = entry;
      return rest;
    }
    return entry;
  })
  .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const outputPath = resolve(projectRoot, "public", "data", "workout-schedule.json");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(schedule, null, 2)}\n`, "utf8");

console.log(`Workout schedule saved to ${outputPath}`);
