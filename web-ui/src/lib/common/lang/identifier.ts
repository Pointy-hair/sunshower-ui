import {UUID} from "./uuid";
import {Base58} from "lib/common/util/base58";

export class Identifier {
    constructor(public readonly value: string) {
    }
}
export module Identifier {
    export function isIdentifier(key: string): boolean {
        return key && /[0-9a-zA-Z]{22}/.test(key);
    }

    export function newId(): string {
        return Base58.encode(UUID.randomBytes());
    }

}


