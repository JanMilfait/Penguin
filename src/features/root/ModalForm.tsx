import React, { FormEvent, useState } from 'react';
import s from '../../styles/6_components/Modal.module.scss';
import { AppDispatch, AppState} from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setCloseModal } from './rootSlice';
import { sanitize } from 'dompurify';
import dynamic from 'next/dynamic';
import { StylesConfig } from 'react-select';

const ModalForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [clicked, setClicked] = useState(false);

  const tag = useSelector((state: AppState) => state.root.modal.request!.tag);
  const data = useSelector((state: AppState) => state.root.modal.request!.data);
  const title = useSelector((state: AppState) => state.root.modal.props.title);
  const button = useSelector((state: AppState) => state.root.modal.props.button) ?? 'Confirm';
  const select = useSelector((state: AppState) => state.root.modal.props.select);


  //////////////////////////
  // IF PROPS SELECT IS NOT UNDEFINED
  //////////////////////////
  const [selectedOptions, setSelectedOptions] = useState<{label: string|number, value: string|number}|null>(null);

  const handleChangeSelect = (selectedOptions: any) => {
    setSelectedOptions(selectedOptions);
  };
  const Select = dynamic(() => import('react-select'), { ssr: false });
  const selectStyles: StylesConfig = {
    control: (base, state) => {
      let style = {
        ...base,
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '10px',
        outline: 'none',
        background: '#f3f3f3',
        boxShadow: '0 2px 2px rgb(0 0 0 / 15%)',
        fontSize: '18px',
        lineHeight: '21px'
      };

      if (state.isFocused) {
        style = {
          ...style,
          borderColor: '#dc3545',
          boxShadow: 'none'
        };
      } else if (state.isDisabled) {
        style = {
          ...style,
          background: '#e9ecef'
        };
      }
      return style;
    }
  };


  //////////////////////////
  // FORM SUBMIT
  //////////////////////////
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClicked(true);

    if (select) {
      await dispatch(setCloseModal({tag, data: {...data, selected: selectedOptions}}));
    }

    setClicked(false);
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2 className={s.modal__title} dangerouslySetInnerHTML={{__html: sanitize(title ?? '')}}></h2>
      {select &&
        <div className="py-3">
          <label className="f--x-small text-capitalize fw-bold ml-2">{select.name}</label>
          <Select
            isMulti
            name={select.name}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={selectStyles}
            options={select.options.map((option) => ({value: option[0], label: `${option[1]} - #${option[0]}`}))}
            onChange={handleChangeSelect}
            value={selectedOptions}
          />
        </div>}
      <div className="row mt-4">
        <div className="col">
          <button className="button--small button--grayed" onClick={() => dispatch(setCloseModal(null))}>Cancel</button>
        </div>
        <div className="col-auto">
          <button type="submit" className='button--small' disabled={clicked}>{button}</button>
        </div>
      </div>
    </form>
  );
};

export default ModalForm;