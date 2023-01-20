export type RootState = {
  routerPath: string;
  window: {
    width: number;
    height: number;
  }
  isMobile: boolean;
  modal: Modal;
}

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
    options: {
      value: string;
      text: string;
    }[]
  }
  clickOutside?: boolean;
}
