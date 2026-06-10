import { useCallback, useState } from 'react';

export function useFinancialPhotoEdits() {
  const [pendingPhotos, setPendingPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [removedPhotoUrls, setRemovedPhotoUrls] = useState<string[]>([]);

  const hasPhotoChanges =
    pendingPhotos.length > 0 || removedPhotoUrls.length > 0;

  const addPending = useCallback((files: File[]) => {
    setPendingPhotos((prev) => [...prev, ...files]);
  }, []);

  const removePending = useCallback((index: number) => {
    setPendingPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const markExistingForRemoval = useCallback((url: string) => {
    setExistingPhotos((prev) => prev.filter((u) => u !== url));
    setRemovedPhotoUrls((prev) =>
      prev.includes(url) ? prev : [...prev, url],
    );
  }, []);

  const clearPhotoEdits = useCallback(() => {
    setPendingPhotos([]);
    setRemovedPhotoUrls([]);
  }, []);

  return {
    pendingPhotos,
    existingPhotos,
    removedPhotoUrls,
    hasPhotoChanges,
    setExistingPhotos,
    addPending,
    removePending,
    markExistingForRemoval,
    clearPhotoEdits,
  };
}
