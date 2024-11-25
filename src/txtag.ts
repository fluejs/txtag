import type {
    TxTagData,
    TxTagDataArg,
    TxTagDataValue,
    TxTagNode,
    TxTagNodeCompiler,
} from './types.ts';
import {
    normalizeData,
    createSourceResolver,
    getBraceRe,
    getBraceTagRe,
    resolveValue,
} from './utils.ts';
import { TxTagNodeTypes } from './constants.ts';

export const createNodesFromSource = (source: string) => {
    const nodes: TxTagNode[] = [];

    const resolveTags = createSourceResolver({
        re: getBraceRe(),
        onMatch: (match, args) => {
            nodes.push({
                type: TxTagNodeTypes.VARIABLE,
                token: match[1],
                exp: match[0],
                args,
            });
        },
        handleLeftHandText: (text) => {
            nodes.push({
                type: TxTagNodeTypes.TEXT,
                exp: text,
            });
        },
        handleRightHandText: (text) => {
            nodes.push({
                type: TxTagNodeTypes.TEXT,
                exp: text,
            });
        },
    });

    const resolve = createSourceResolver({
        re: getBraceTagRe(),
        onMatch: (match, args) => {
            nodes.push({
                type: TxTagNodeTypes.TAG,
                token: match[1],
                exp: match[0],
                body: match[2],
                args,
                children: createNodesFromSource(match[2]),
            });
        },
        handleLeftHandText: resolveTags,
        handleRightHandText: resolveTags,
    });

    resolve(source);

    return nodes;
};

export const compileNode = (
    node: TxTagNode,
    value: TxTagDataValue,
    _compileNode?: TxTagNodeCompiler,
) => {
    const valueRes = resolveValue(value, node);

    if (_compileNode) {
        const customResult = _compileNode(node, valueRes);

        if (customResult !== undefined) {
            return customResult;
        }
    }

    if (valueRes !== undefined) {
        return valueRes;
    }

    let exp = node.exp;

    if (node.type === TxTagNodeTypes.TAG && node.body) {
        const tagMatch = exp.match(getBraceTagRe(node.token!));

        if (tagMatch && tagMatch[1]) {
            exp = exp.replace(tagMatch[1], node.body);
        }
    }

    return exp;
};

export const compileNodes = (
    nodes: TxTagNode[],
    data: TxTagData,
    _compileNode?: TxTagNodeCompiler,
): string => nodes.reduce((result, node) => {
    const value = data[node.token as keyof typeof data];
    let body = node.body;

    if (node.children) {
        body = compileNodes(node.children, data, _compileNode);
    }

    return result + compileNode(
        {
            ...node,
            body,
        },
        value,
        _compileNode,
    );
}, '');

export const compile = (
    source: string,
    data: TxTagDataArg,
    compileNode?: TxTagNodeCompiler,
) => compileNodes(
    createNodesFromSource(source),
    normalizeData(data),
    compileNode,
);
