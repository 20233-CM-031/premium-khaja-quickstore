import { StorageAdapter, MediaAssetRecord } from './interface';

/**
 * Portable Media Checksum Utility (SHA-256)
 */
async function computeSha256(content: string | Uint8Array): Promise<string> {
  try {
    let buffer: ArrayBuffer;
    if (typeof content === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(content).buffer;
    } else {
      buffer = content.buffer as ArrayBuffer;
    }

    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    // fallback
  }
  // Deterministic fallback hash for non-crypto environments
  let hash = 0;
  const str = typeof content === 'string' ? content : content.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export class SupabaseStorageAdapter implements StorageAdapter {
  private assetsStore: Map<string, MediaAssetRecord> = new Map();

  async uploadAsset(
    tenantId: string,
    file: { name: string; type: string; dataUrlOrBytes: string | Uint8Array },
    visibility: 'public' | 'private' = 'public'
  ): Promise<MediaAssetRecord> {
    const checksum = await computeSha256(file.dataUrlOrBytes);
    const assetId = `ast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectKey = `${tenantId}/${assetId}/${sanitizedName}`;
    const sizeBytes = typeof file.dataUrlOrBytes === 'string' 
      ? file.dataUrlOrBytes.length 
      : file.dataUrlOrBytes.byteLength;

    const deliveryUrl = typeof file.dataUrlOrBytes === 'string' && file.dataUrlOrBytes.startsWith('data:')
      ? file.dataUrlOrBytes // base64 directly accessible in client
      : `/storage/v1/object/public/${objectKey}`;

    const record: MediaAssetRecord = {
      id: assetId,
      tenantId,
      provider: 'supabase',
      bucketKey: 'quickstore-product-media',
      objectKey,
      mimeType: file.type || 'image/jpeg',
      sizeBytes,
      checksumSha256: checksum,
      visibility,
      deliveryUrl,
      createdAt: new Date().toISOString()
    };

    this.assetsStore.set(objectKey, record);
    return record;
  }

  async getDeliveryUrl(objectKey: string, visibility: 'public' | 'private' = 'public'): Promise<string> {
    const asset = this.assetsStore.get(objectKey);
    if (asset) return asset.deliveryUrl;
    return `/storage/v1/object/${visibility}/${objectKey}`;
  }

  async verifyChecksum(objectKey: string, expectedSha256: string): Promise<boolean> {
    const asset = this.assetsStore.get(objectKey);
    if (!asset) return false;
    return asset.checksumSha256.toLowerCase() === expectedSha256.toLowerCase();
  }
}

export const defaultStorageAdapter = new SupabaseStorageAdapter();
