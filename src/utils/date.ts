const DEV_TEST_DATE: string | null = "2026-08-12";

export function getKaxiroDate(): string {
  if (
    process.env.NODE_ENV === "development" &&
    DEV_TEST_DATE
  ) {
    return DEV_TEST_DATE;
  }

  return new Date().toISOString().split("T")[0];
}