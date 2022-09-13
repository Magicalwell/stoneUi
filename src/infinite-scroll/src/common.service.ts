let msgData = [
  "hellow world!",
  "osfdgndsnb,cngoertjhorengfd,snv,mbnejhrowqjffdsgfqwredasFDSRQWEQWDASdfsafdgretqtfsdfdwrewgvbdfgertreqtqwfdsfsvcxva",
  "need help? yep Identifier msgData is never reassigned; use const instead of let need help? yep Id  entifier msgData is never reassigned; use const instead of let need help? yep Identifier msgData is never reassigned; use const instead of letneed help? yep Identifier msgData is never reassigned; use const instead of letneed help? yep Identifier msgData is never reassigned; use const instead of let",
  "lets do it -----------------------------------Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.Array type using 'T[]' is forbidden for non-simple types. Use 'Array<T>' instead.----------------------------------------------",
  "+10086",
];
const CommonService = {
  generateData(
    min: number = 100000,
    max: number = -1
  ): { title: number; msg: string }[] {
    const data: { title: number; msg: string }[] = [];
    const length = CommonService.random(min, max);

    for (let i: number = 0; i < length; i++) {
      data.push({ title: i, msg: msgData[CommonService.random(0, 4)] });
    }
    return data;
  },

  clone(target: any[]): any[] {
    let data = [];
    for (let i = 0; i < target.length; i++) data.push(target[i]);

    return data;
  },

  random(min: any, max: any) {
    if (max <= 0) max = min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};

export default CommonService;
