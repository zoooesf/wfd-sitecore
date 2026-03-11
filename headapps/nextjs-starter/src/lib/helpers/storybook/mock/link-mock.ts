import { linkGQLArgs } from './field-mock';

export const mockLink = (text: string) => {
  return {
    link: linkGQLArgs(text),
  };
};
