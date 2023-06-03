interface TableFI {
  id: number;
  src: string;
  title: string;
  category: string;
  type: string;
  width: number;
  length: number;
  height: number;
}

interface TableI {
  id: number;
  src: string;
  title: string;
  category: string;
  type: string;
  width: number;
  length: number;
  height: number;
}

type TableArrayFI = Array<TableFI>;

export { TableFI, TableI, TableArrayFI };
