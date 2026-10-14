export interface MediaAssetRecord {
  id: string;
  tenantId: string;
  provider: string;
  bucketKey: string;
  objectKey: string;
  mimeType: string;
  sizeBytes: number;
  checksumSha256: string;
  visibility: 'public' | 'private';
  deliveryUrl: string;
  createdAt: string;
}

export interface StorageAdapter {
  uploadAsset(
    tenantId: string,
    file: { name: string; type: string; dataUrlOrBytes: string | Uint8Array },
    visibility?: 'public' | 'private'
  ): Promise<MediaAssetRecord>;

  getDeliveryUrl(objectKey: string, visibility?: 'public' | 'private'): Promise<string>;
  verifyChecksum(objectKey: string, expectedSha256: string): Promise<boolean>;
}
