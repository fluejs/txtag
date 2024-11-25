import { TxTagNodeTypes } from './constants.ts';

export interface TxTagNode {
    type: TxTagNodeTypes;
    exp: string;
    token?: string;
    body?: string;
    args?: string[];
    children?: TxTagNode[];
}

export type TxTagDataValue =
    string |
    number |
    ((node: TxTagNode) => string | number);

export type TxTagData = Record<string, TxTagDataValue>;

export type TxTagDataArg = TxTagData | TxTagDataValue[];

export type TxTagNodeCompiler = (
    node: TxTagNode,
    value?: string | number,
) => string | undefined | void;
