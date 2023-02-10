import React, { useRef } from 'react';
import {Skill} from '../auth/authSlice.types';
import s from 'styles/6_components/Profile.module.scss';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import SkillIcon from './SkillIcon';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';

const SkillBar = ({tag, skills: data}: {tag: string, skills: Skill[]}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  usePerfectScrollbar(contentRef);
  const [skills] = useInfiniteScroll(data, contentRef, 96, undefined, 'width');


  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className={s.profile__skillBar}>
          <h3 className="f--x-small text-uppercase text-truncate fw-bold mb-3 mt-2">#{tag}</h3>
          <div ref={contentRef} className={s.profile__skillBarContent}>
            <div className="d-flex">
              {skills.map((skill: Skill) => (
                <SkillIcon key={skill.id} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SkillBar);