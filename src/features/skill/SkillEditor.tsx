import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus, Dash } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Profile.module.scss';
import { AppDispatch, AppState } from '../../app/store';
import { addEditSkill, addSelected, removeSelected, setCreatingSkill, useGetSkillQuery, useSearchSkillsQuery } from './skillSlice';
import SkillPreview from './SkillPreview';
import debounce from 'lodash.debounce';
import { SearchSkill } from './skillSlice.types';
import SkillCreator from './SkillCreator';


const SkillEditor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: AppState) => state.skill.editList);
  const selected = useSelector((state: AppState) => state.skill.selected);
  const creating = useSelector((state: AppState) => state.skill.creating);
  const skillRef = useRef<HTMLInputElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const [showing, setShowing] = useState<number|null>(list[0]?.id ?? null);
  const [hovered, setHovered] = useState<number|null>(null);
  const [search, setSearch] = useState('');

  const {data: showedSkill} = useGetSkillQuery({id: showing!}, {skip: typeof showing !== 'number'});
  const {data: searchedSkills, refetch} = useSearchSkillsQuery({text: search}, {skip: !search});


  useEffect(() => {
    if (creating) {
      setShowing(null);
    } else {
      !showing && setShowing(selected[0] ?? list[0]?.id ?? null);
    }
  }, [creating]);


  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!creating || !skillRef.current) return;
      if (!skillRef.current.contains(e.target) && !buttonsRef.current?.contains(e.target)) {
        dispatch(setCreatingSkill(false));
      }
    };
    document.addEventListener('mouseup', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [creating]);


  const isSelected = (id: number) => selected.includes(id);
  const isShowing = (id: number) => showing === id;
  const isHovered = (id: number) => hovered === id;

  const addSearched = async (skill: SearchSkill) => {
    await dispatch(addEditSkill(skill));
    setShowing(skill.id);
    setSearch('');
    refetch();
  };

  return (
    <div className={s.profile__skillEditor}>
      <div className="row">
        <div className="col-12 col-xl-6 mb-3 mb-xl-0">
          <div className="mb-3">
            <div className={s.profile__skillEditorSearch}>
              <Search />
              <input
                placeholder="Search"
                onChange={debounce((e) => setSearch(e.target.value), 500)}
                onBlur={() => setTimeout(() => setSearch(''), 100)}
                onFocus={(e) => setSearch(e.target.value)}
              />
              {search && (
                searchedSkills && searchedSkills.length > 0
                  ? (
                    <ul className={s.profile__skillSearchResult}>
                      {searchedSkills.map((skill) => (
                        <li key={skill.id} onClick={() => addSearched(skill)}>
                          <h3 className="f--x-small mb-0 mr-2 text-truncate fw-bold">{skill.name}</h3>
                          <p className="f--xx-small mb-0 text-uppercase">#{skill.tag}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={s.profile__skillSearchResult}>
                      <p className="f--x-small text-center p-4 mb-0">Nothing found</p>
                    </div>
                  )
              )}
            </div>
          </div>
          <div className={s.profile__skillEditorList}>
            <ul>
              {list.map((skill) => (
                <li
                  key={skill.id}
                  className={(!isSelected(skill.id) && !isHovered(skill.id) ? 'opacity-25' : '') + (isShowing(skill.id) ? ' ' + s.profile__skillEditorShowing : '')}
                  onClick={() => setShowing(skill.id)}
                  onMouseEnter={() => setHovered(skill.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <h3 className="f--x-small mb-0 mr-2 text-truncate fw-bold">{skill.name}</h3>
                  <div className="d-flex align-items-center">
                    <p className="f--xx-small mb-0 text-uppercase">#{skill.tag}</p>
                    {isHovered(skill.id) ? (
                      isSelected(skill.id)
                        ? <button className="button--small p-1 ml-2" type="button" onClick={() => dispatch(removeSelected(skill.id))}><Dash /></button>
                        : <button className="button--small p-1 ml-2" type="button" onClick={() => dispatch(addSelected(skill.id))}><Plus /></button>
                    ) : (
                      <div className="ml-2" style={{width: '1.5rem'}}></div>
                    )
                    }
                  </div>
                </li>
              ))}
            </ul>
            <div ref={buttonsRef}>
              {!creating
                ? <button className="button--fluid button--small" type="button" onClick={()=>dispatch(setCreatingSkill(true))}>Create New</button>
                : <button className="button--fluid button--small" type="button" onClick={()=>dispatch(setCreatingSkill(false))}>Cancel</button>
              }
            </div>
          </div>
        </div>
        <div ref={skillRef} className="col-12 col-xl-6">
          {showedSkill && <SkillPreview {...showedSkill} />}
          {creating && <SkillCreator />}
        </div>
      </div>
      {selected.map((id) => (
        <input key={id} type="hidden" name="skills[]" value={id} />
      ))}
    </div>
  );
};

export default SkillEditor;