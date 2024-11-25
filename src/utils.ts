import type {
    TxTagData,
    TxTagDataArg,
    TxTagDataValue,
    TxTagNode,
} from './types.ts';

const ARGS_RE = /\[([^\]]+)]/;

export const getBraceRe = (matcher = '[^}]+') => new RegExp(`{(${matcher})}`, 'gm');

export const getBraceTagRe = (matcher = '[^}]+') => new RegExp(`{(${matcher})}(.*?){\\/\\1}`, 'gm');

export const resolveValue = (
    value: TxTagDataValue,
    node: TxTagNode,
) => (typeof value === 'function' ? value(node) : value);

export const normalizeData = (data: TxTagDataArg): TxTagData => (
    Array.isArray(data)
        ? data.reduce((res, value, index) => ({
            ...res,
            [index]: value,
        }), {})
        : data
);

export const createSourceResolver = ({
    re,
    handleLeftHandText,
    onMatch,
    handleRightHandText,
}: {
    re: RegExp;
    handleLeftHandText: (text: string) => void;
    onMatch: (match: RegExpExecArray, args?: string[]) => void;
    handleRightHandText: (text: string) => void;
}) => {
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    return (source: string) => {
        while ((match = re.exec(source)) !== null) {
            if (match.index > lastIndex) {
                handleLeftHandText(source.slice(lastIndex, match.index));
            }

            lastIndex = re.lastIndex;

            const restSource = source.slice(lastIndex);
            let matchedArgs: string[] | undefined;

            if (restSource.startsWith('[')) {
                const argsMatch = restSource.match(ARGS_RE);

                if (argsMatch && argsMatch.index === 0) {
                    matchedArgs = argsMatch[1].split('|');
                    lastIndex += argsMatch[0].length;
                }
            }

            onMatch(match, matchedArgs);
        }

        if (lastIndex < source.length) {
            handleRightHandText(source.slice(lastIndex));
        }
    };
};
