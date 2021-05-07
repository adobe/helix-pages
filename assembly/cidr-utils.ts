export function isInIPv4Range(cidrrange: string, ipaddr: string): boolean {
  const cidrbase = cidrrange.split('/')[0];
  const cidrprefixlen = U32.parseInt(cidrrange.split('/')[1]);

  if (cidrprefixlen == 0) {
    return true;
  }

  const cidroctets = new Array<u32>(4);
  const ipoctets = new Array<u32>(4);

  for (let i = 0;i < 4; i++) {
    cidroctets[i] = U32.parseInt(cidrbase.split('.')[i]);
    ipoctets[i] = U32.parseInt(ipaddr.split('.')[i]);
  }


  const cidrsuffixlen = 32 - cidrprefixlen;
  let cidr = 0 as u32;
  let ip = 0 as u32;

  for (let i = 0; i < 4; i++) {
    const shift = (24 - (8 * i)) as u32;
    
    const cidroctet = cidroctets[i];
    const ipoctet = ipoctets[i];

    cidr = cidr + ((cidroctet << shift) >>> 0);
    ip = ip + ((ipoctet << shift) >>> 0);
  }
  const cidrmasked = ((cidr >>> cidrsuffixlen) >>> 0);
  const ipmasked = ((ip >>> cidrsuffixlen) >>> 0);
  return (cidrmasked == ipmasked);
}