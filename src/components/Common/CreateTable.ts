export const createTable = (rows: { [key: string]: string }): { title: string; value: string }[] => {
    return Object.entries(rows).map(([key, value]) => ({ title: key, value: value }));
};
