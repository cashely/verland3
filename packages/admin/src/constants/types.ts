interface IOptionItem {
  label: string;
  value: number | string;
  tag?: string;
}

type Option = IOptionItem[];

export type { Option, IOptionItem };
