/**
 * URI encode every byte except the unreserved characters: 'A'-'Z', 'a'-'z', '0'-'9', '-', '.', '_', and '~'.
  * The space character is a reserved character and must be encoded as "%20" (and not as "+").
  * Each URI encoded byte is formed by a '%' and the two-digit hexadecimal value of the byte.
  * Letters in the hexadecimal value must be uppercase, for example "%1A".
  * Encode the forward slash character, '/', everywhere except in the object key name. For example, if the object key name is photos/Jan/sample.jpg, the forward slash in the key name is not encoded.
 * @param value the string to encode
 */
export function uriencode(value: string, encodeSlash: boolean = false) {
  const encoded = new Array<string>();
  for (let i = 0; i< value.length; i++) {
    const char = value.charAt(i);
    const charcode = value.charCodeAt(i);
    if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9') || char == '_' || char == '-' || char == '~' || char == '.') {
      encoded[i] = char;
    } else if (char == '/') {
      encoded[i] = (encodeSlash ? "%2F" : char);
    } else {
      encoded[i] = "%" + charcode.toString(16).toUpperCase();
    }
  }
  return encoded.join("");
}