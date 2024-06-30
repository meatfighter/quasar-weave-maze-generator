export interface Hashable<T> {
    hashCode(): number;
    equals(other: T): boolean;
}