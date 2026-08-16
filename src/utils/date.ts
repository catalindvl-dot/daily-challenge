export function getKaxiroDate(): string {
  return new Date().toISOString().split("T")[0];
}