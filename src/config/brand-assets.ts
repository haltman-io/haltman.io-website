import brandAssetsData from "@/data/brand-assets.json";

export type BrandAsset = {
  src: string;
  alt: string;
  kind: "approved-artifact";
};

export const brandAssets: BrandAsset[] = [
  ...(brandAssetsData as BrandAsset[]),
].reverse();
