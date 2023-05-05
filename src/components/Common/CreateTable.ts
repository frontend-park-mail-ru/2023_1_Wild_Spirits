import { TableProp } from "./Table";

export type TableContents = { [key: string]: string | undefined };
export type TableContentsFiltered = { [key: string]: string };

export const createTable = (rows: TableContentsFiltered): TableProp[] => {
    return Object.entries(rows).map(([key, value]) => ({ title: key, value: value }));
};

export const filterTableContents = (content: TableContents): TableContentsFiltered => {
    return Object.fromEntries(
        Object.entries(content).filter(([_, value]) => value !== undefined)
    ) as TableContentsFiltered;
};
