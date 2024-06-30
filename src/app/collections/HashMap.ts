import { Hashable } from './Hashable';

export class HashMap<K extends Hashable<K>, V> {
    private map: Map<number, { key: K; value: V }[]> = new Map();

    set(key: K, value: V) {
        const hash = key.hashCode();
        let bucket = this.map.get(hash);
        if (!bucket) {
            bucket = [];
            this.map.set(hash, bucket);
        }
        const existing = bucket.find(entry => entry.key.equals(key));
        if (existing) {
            existing.value = value;
        } else {
            bucket.push({ key, value });
        }
    }

    get(key: K): V | undefined {
        const bucket = this.map.get(key.hashCode());
        if (!bucket) {
            return undefined;
        }
        const entry = bucket.find(entry => entry.key.equals(key));
        return entry ? entry.value : undefined;
    }

    has(key: K): boolean {
        return this.get(key) !== undefined;
    }

    delete(key: K): boolean {
        const hash = key.hashCode();
        const bucket = this.map.get(hash);
        if (!bucket) {
            return false;
        }
        const index = bucket.findIndex(entry => entry.key.equals(key));
        if (index !== -1) {
            bucket.splice(index, 1);
            if (bucket.length === 0) {
                this.map.delete(hash);
            }
            return true;
        }
        return false;
    }

    entries(): { key: K; value: V }[] {
        const allEntries: { key: K; value: V }[] = [];
        for (const bucket of this.map.values()) {
            allEntries.push(...bucket);
        }
        return allEntries;
    }

    values(): V[] {
        const allValues: V[] = [];
        for (const bucket of this.map.values()) {
            for (const entry of bucket) {
                allValues.push(entry.value);
            }
        }
        return allValues;
    }

    forEach(callback: (value: V, key: K) => void) {
        for (const bucket of this.map.values()) {
            for (const entry of bucket) {
                callback(entry.value, entry.key);
            }
        }
    }
}