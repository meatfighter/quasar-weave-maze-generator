export function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function generatePermutations(arr: number[]): number[][] {
    const result: number[][] = [];

    function permute(n: number) {
        if (n === 1) {
            result.push(arr.slice());
        } else {
            for (let i = 0; i < n; i++) {
                permute(n - 1);
                if ((n & 1) === 0) {
                    [ arr[i], arr[n - 1] ] = [ arr[n - 1], arr[i] ];
                } else {
                    [ arr[0], arr[n - 1] ] = [ arr[n - 1], arr[0] ];
                }
            }
        }
    }

    permute(arr.length);

    return result;
}

export const permutations = generatePermutations([ 0, 1, 2, 3 ]);