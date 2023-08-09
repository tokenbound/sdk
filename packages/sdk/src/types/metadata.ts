export type NFTMetadata = {
    name: string; // Name of the NFT
    description: string; // Description or details about the NFT
    image: string; // URL to the image representing the NFT
    attributes?: NFTAttribute[]; // Optional array of additional attributes
  }  

export type NFTAttribute = {
    trait_type: string; // The category or trait of the attribute
    value: string | number; // The value of the attribute, could be a string or number
}