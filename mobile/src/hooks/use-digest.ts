import { useQuery } from "@tanstack/react-query";

import { getDigestDetail, getLatestDigest } from "@/api/digest";
import { MOCK_DIGEST, MOCK_DIGEST_DETAILS } from "@/api/mock";
import { devPreviewEnabled } from "@/lib/dev";
import { queryKeys } from "@/lib/query-keys";

export function useLatestDigest(devPreview = false) {
  return useQuery({
    queryKey: queryKeys.digest,
    queryFn: () =>
      devPreview && devPreviewEnabled
        ? Promise.resolve(MOCK_DIGEST)
        : getLatestDigest(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDigestDetail(id: string, devPreview = false) {
  return useQuery({
    queryKey: queryKeys.digestDetail(id),
    queryFn: () => {
      if (devPreview && devPreviewEnabled) {
        return Promise.resolve(
          MOCK_DIGEST_DETAILS[id] ?? MOCK_DIGEST_DETAILS["1"],
        );
      }
      return getDigestDetail(id);
    },
    enabled: Boolean(id),
    staleTime: 30 * 60 * 1000,
  });
}
