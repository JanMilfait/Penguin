export type MessageResponse = {
  message: string;
}

export type Modal = {
  isOpen: boolean;
  request?: null | {
    tag: string;
    data: any;
  }
  response?: null | {
    tag: string;
    data: any;
  }
  props: ModalProps;
}

export type ModalProps = {
  type: 'form' | 'confirm' | 'alert' | 'prompt' | 'reactions' | 'sharing' | null;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question' | null;
  title?: string;
  message?: string;
  button?: string;
  inputs?: {
    name: string;
    type: 'text' | 'password' | 'email' | 'number';
    placeholder?: string;
    value?: string;
  }[];
  select?: {
    name: string;
    options: [string|number, string|number][]
  }
  clickOutside?: boolean;
}

export type RootState = {
  appLoaded: number;
  routerPath: string;
  window: {
    width: number;
    height: number;
  }
  isMobile: boolean;
  modal: Modal;
  loader: {
    isOpen: boolean;
  }
}