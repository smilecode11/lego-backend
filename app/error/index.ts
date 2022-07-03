import { userErrorMessages } from './user';
import { workErrorMessages } from './work';
import { utilErrorMessages } from './util';

export type GlobalErrorTypes = keyof (typeof userErrorMessages & typeof workErrorMessages & typeof utilErrorMessages);
export const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
  ...utilErrorMessages,
};
