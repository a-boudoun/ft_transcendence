let matchMakingQue: Map< string, Array<number>> = new Map<string, Array<number>>();

matchMakingQue.set('1', [1,2,3]);
matchMakingQue.set('2', [1,2,3]);
matchMakingQue.get('1')?.push(4);

console.log(matchMakingQue.get('1'));
console.log(matchMakingQue.get('2'));
