export const normalizeNames = (input?: string[] | string): string[] => {
    if (!input) return [];

    const rawArray = Array.isArray(input) ? input : [input];

    const normalized = rawArray
        .flatMap((item) => item.split(","))
        .map((val) => val.trim())
        .filter((val) => val.length > 0);

    return Array.from(new Set(normalized));
};
