const dateSwap = (date: string | undefined, split: string, join: string): string | undefined => {
    if (date === undefined) {
        return undefined;
    }

    try {
        let splt = date.split(split);
        [splt[0], splt[2]] = [splt[2], splt[0]];
        return splt.join(join);
    } catch {
        return undefined;
    }
};

export const dateToServer = (date: string | undefined): string | undefined => {
    if (date === "--") {
        return;
    }

    return dateSwap(date, "-", ".");
};

export const dateFromServer = (date: string | undefined): string | undefined => {
    return dateSwap(date, ".", "-");
};
