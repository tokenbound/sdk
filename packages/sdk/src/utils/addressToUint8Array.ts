export function addressToUint8Array(address: `0x${string}`): Uint8Array {
  
  // Remove the '0x' prefix
  const cleanAddress = address.slice(2);
  
  // Convert hexadecimal string to Uint8Array
  const array = new Uint8Array(cleanAddress.length / 2);

  for (let i = 0; i < cleanAddress.length; i += 2) {
    array[i / 2] = parseInt(cleanAddress.substr(i, 2), 16)
  }

  return array
}