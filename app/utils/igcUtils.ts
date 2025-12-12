import type { IGCFile } from "igc-parser";
// import * as math from "mathjs";

// function calculateGradient(arr: number[], axis: []) {}

export function parse(flight: IGCFile) {
  const time = <any>[];
  const minutes = <any>[];
  const pilot_msl = <any>[];
  const fixes = flight.fixes;
  const startTimestamp = fixes[0].timestamp;
  const endTimestamp = fixes[fixes.length - 1].timestamp;

  // Access individual fixes
  for (let fix of fixes) {
    fix.gpsAltitude && pilot_msl.push(fix.gpsAltitude * 3.28084);
    let curTime = fix.timestamp;
    time.push(curTime);
    let minute = (fix.timestamp - startTimestamp) / 60000;
    minutes.push(minute);
  }

  const valleyFloorMSL = Math.min.apply(Math, pilot_msl);
  const ground_msl = pilot_msl.map((i: number) => i - valleyFloorMSL);
  const xAxis = time;

  return { time, minutes, pilot_msl, ground_msl };
}
