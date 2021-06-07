import { Request } from "@fastly/as-compute";

export function contentBusPartition(req: Request) {
  let partition = "preview";
  let xfh = req.headers.get("x-forwarded-host");
  if (xfh != null && (xfh.endsWith(".live") || xfh.includes(".live,"))) {
    partition = "live";
  }

  return partition;
}