export type RootState = {
  isMobile: boolean;
  modal: Modal;
}

export type Modal = {
  isOpen: boolean;
  response?: unknown | null;
  props: ModalProps;
}

export type ModalProps = {
  type: 'form' | 'confirm' | 'alert' | 'prompt' | null;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question' | null;
  title?: string;
  message?: string;
  inputs?: {
    name: string;
    type: 'text' | 'password' | 'email' | 'number';
    placeholder?: string;
    value?: string;
  }[];
  clickOutside?: boolean;
}
