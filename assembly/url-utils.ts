export function queryparam(querystring: string, param: string, defaultValue: string): string {
  if (querystring.startsWith("?")) {
    querystring = querystring.substring(1);
  }
  const pairs = querystring.split("&");
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].indexOf(param + "=")==0) {
      return pairs[i].substr(param.length + 1);
    }
  }
  return defaultValue;
}

export function queryparamarray(querystring: string, param: string): string[] {
  if (querystring.startsWith("?")) {
    querystring = querystring.substring(1);
  }
  const pairs = querystring.split("&");
  const results = new Array<string>();
  for (let i = 0; i < pairs.length; i++) {
    if (pairs[i].indexOf(param + "=")==0) {
      results.push(pairs[i].substr(param.length + 1))
    }
  }
  return pairs;
}

export function queryparamint(querystring: string, param: string, defaultValue: i32): i32 {
  if (querystring.startsWith("?")) {
    querystring = querystring.substring(1);
  }
  const value = queryparam(querystring, param, defaultValue.toString());
  const parsed = I32.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
}