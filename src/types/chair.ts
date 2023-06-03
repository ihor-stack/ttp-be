interface ChairFI {
  id: number;
  src: string;
  title: string;
  type: string;
  category: string;
  width: number;
  depth: number;
  height: number;
}

interface ChairI {
  id: number;
  src: string;
  title: string;
  type: string;
  category: string;
  width: number;
  depth: number;
  height: number;
}

type ChairArrayFI = Array<ChairFI>;

export { ChairFI, ChairI, ChairArrayFI };
