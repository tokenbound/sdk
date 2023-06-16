
// export function addressToUint8Array(address: `0x${string}`): Uint8Array {
//   // Remove the '0x' prefix from the address if present
//   const normalizedAddress = address.startsWith('0x') ? address.slice(2) : address

//   // Ensure the address is a valid hexadecimal string
//   if (!/^(0x)?[0-9a-fA-F]{40}$/.test(normalizedAddress)) {
//     throw new Error('Invalid Ethereum address')
//   }

//   // Convert the hexadecimal string to a Uint8Array
//   const byteLength = normalizedAddress.length / 2
//   const uint8Array = new Uint8Array(byteLength)

//   for (let i = 0; i < byteLength; i++) {
//     const byteString = normalizedAddress.substr(i * 2, 2)
//     const byteValue = parseInt(byteString, 16)
//     uint8Array[i] = byteValue
//   }

//   return uint8Array
// }

// export function addressToUint8Array(address: `0x${string}`): Uint8Array {
//   const cleanAddress = address.replace(/^0x/i, '');
//   // const bytes = new Uint8Array(20)
//   const bytes = new Uint8Array(183)
//   for (let i = 0; i < 183; i++) {
//     bytes[i] = parseInt(cleanAddress.substr(i * 2, 2), 16)
//   }
//   return bytes
// }

export function addressToUint8Array(address: `0x${string}`): Uint8Array {
  // Remove the '0x' prefix from the address
  const cleanAddress = address.slice(2);
  
  console.log(cleanAddress.length)

  // Convert hexadecimal string to Uint8Array
  const array = new Uint8Array(cleanAddress.length / 2);

  for (let i = 0; i < cleanAddress.length; i += 2) {
      array[i / 2] = parseInt(cleanAddress.substr(i, 2), 16);
  }

  return array;
}