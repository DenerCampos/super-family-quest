export type ShareTextPayload = {
  title: string;
  text: string;
};

export type ShareTextResult = 'shared' | 'copied' | 'cancelled' | 'failed';

function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  );
}

function copyWithTextarea(text: string): boolean {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(el);
  return ok;
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback abaixo
    }
  }

  try {
    return copyWithTextarea(text);
  } catch {
    return false;
  }
}

export async function shareOrCopyText(
  payload: ShareTextPayload,
): Promise<ShareTextResult> {
  const data = { title: payload.title, text: payload.text };

  if (typeof navigator.share === 'function') {
    const canShare =
      typeof navigator.canShare !== 'function' || navigator.canShare(data);

    if (canShare) {
      try {
        await navigator.share(data);
        return 'shared';
      } catch (error) {
        if (isAbortError(error)) {
          return 'cancelled';
        }
      }
    }
  }

  const copied = await copyToClipboard(payload.text);
  return copied ? 'copied' : 'failed';
}
