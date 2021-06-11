import { Request } from "@fastly/as-compute";

export function contentBusPartition(req: Request): string {
  let partition = "preview";
  let xfh = req.headers.get("x-forwarded-host");
  if (xfh != null && ((xfh as string).endsWith(".live") || (xfh as string).includes(".live,"))) {
    partition = "live";
  }

  return partition;
}