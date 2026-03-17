export const getApiErrorMessage = (error: any): string | null => {
  if (
    error &&
    "data" in error &&
    error.data &&
    typeof error.data === "object"
  ) {
    return (error.data as any).message?.toString() || "An error occurred";
  }
  return null;
};
