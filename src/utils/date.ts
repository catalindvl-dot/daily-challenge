const DEV_TEST_DATE: string | null = null;

export function getKaxiroDate(): string {
  if (
    process.env.NODE_ENV === "development" &&
    DEV_TEST_DATE
  ) {
    return DEV_TEST_DATE;
  }

  return new Date().toISOString().split("T")[0];
}