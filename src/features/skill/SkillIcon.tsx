import React from 'react';
import {Skill} from '../auth/authSlice.types';
import Image from 'next/image';
import s from 'styles/6_components/Profile.module.scss';
import HoverModal from '../../components/HoverModal';

const SkillIcon = ({name, icon_url, description, tag, created_by}: Skill) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  return (
    <HoverModal
      hover={
        <div className={s.profile__skillIcon}>
          {icon_url
            ? <Image src={icon_url} alt={name} width={80} height={80} quality={100} />
            : <div className={s.profile__skillNoImg}><h3 className="f--x-small fw-bold">{name}</h3></div>
          }
        </div>
      }
      modal={
        <div ref={modalRef} className={s.profile__skillModal}>
          <p className="position-absolute top-0 end-0 f--xx-small text-uppercase text-truncate fw-bold mb-0 p-2">#{tag}</p>
          <div className="row align-items-center" style={{width: 'max-content'}}>
            <div className="col-auto">
              <div className={s.profile__skillIcon}>
                {icon_url
                  ? <Image src={icon_url} alt={name} width={80} height={80} quality={100} />
                  : <div className={s.profile__skillNoImg}><h3 className="f--x-small fw-bold">{name}</h3></div>
                }
              </div>
            </div>
            <div className="col">
              <h3 className="f--medium fw-bold mb-0">{name}</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className={s.profile__skillDescription + ' f--small p-0 p-md-2 mt-3'}>{description}</p>
            </div>
          </div>
          <p className="position-absolute bottom-0 end-0 f--xx-small text-truncate mb-0 p-2">by {created_by.name}</p>
        </div>
      }
      attachToCursor
      autoOrientation
    />
  );
};

export default React.memo(SkillIcon);