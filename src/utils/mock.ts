const CHARACTORS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

const createMocks = <U>(size: number, generator: (index?: number) => U): U[] => {
  const mockDatas = [];
  for (let i = 0; i < size; i++) {
    mockDatas.push(generator(i));
  }
  return mockDatas;
};

export { createMocks };
