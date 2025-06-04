export const normalizeNames = (input?: string[] | string): string[] => {
    if (!input) return [];
    return (Array.isArray(input) ? input : input.split(","))
        .filter((val): val is string => typeof val === "string")
        .map((val) => val.trim().toLowerCase())
        .filter((val) => val.length > 0);
};
