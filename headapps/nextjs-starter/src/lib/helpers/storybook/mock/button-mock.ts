import { linkFieldArgs, createMockComponent } from './field-mock';

export const mockButton = (text = 'Button', href = '/', target = '_self') => {
  return createMockComponent('Button', {
    link: linkFieldArgs(href, text, target),
  });
};
