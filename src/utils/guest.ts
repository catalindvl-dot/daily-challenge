const GUEST_ID_KEY = "kaxiroGuestId";

export function getGuestId(): string {
  const existingGuestId = localStorage.getItem(GUEST_ID_KEY);

  if (existingGuestId) {
    return existingGuestId;
  }

  const guestId = crypto.randomUUID();

  localStorage.setItem(GUEST_ID_KEY, guestId);

  return guestId;
}

export function getGuestStorageId(): string {
  return `guest:${getGuestId()}`;
}

export function getExistingGuestStorageId(): string | null {
  const guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    return null;
  }

  return `guest:${guestId}`;
}