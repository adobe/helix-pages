import { Date as WASIDate } from "as-wasi";
import { Date } from "as-date";

export function getISO8601Timestamp(): string {
  const now =  new Date(<i64>WASIDate.now());
  const year = now.getUTCFullYear().toString().padStart(4, '0');
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = now.getUTCDate().toString().padStart(2, '0');
  const hour = now.getUTCHours().toString().padStart(2, '0');
  const min = now.getUTCMinutes().toString().padStart(2, '0');
  const seconds = now.getUTCSeconds().toString().padStart(2, '0');
  
  return year + month + day + "T" + hour + min + seconds + "Z";
}

export function getyyyymmddTimestamp(): string {
  const now =  new Date(<i64>WASIDate.now());
  const year = now.getUTCFullYear().toString().padStart(4, '0');
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = now.getUTCDate().toString().padStart(2, '0');
  
  return year + month + day;
}