import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Emoji from 'components/Emoji';
import s from 'styles/6_components/ModalReactionsSharing.module.scss';
import {filteredReactions} from './postSlice';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import {Reaction} from './postSlice.types';
import ModalUser from './ModalUser';

const ModalReactions = () => {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const {count, filtered} = useSelector(filteredReactions);

  const usersRef = React.useRef<HTMLDivElement>(null);
  const [items] = useInfiniteScroll(filtered[selectedFilter], usersRef, 50, selectedFilter);

  return (
    <div className={s.modalReactionsSharing}>
      <div className="row">
        <div className="col">
          <ul className={s.modalReactionsSharing__tabs}>
            {count[0] ? <li className={selectedFilter === 0 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(0)}><div><p className="f--small">{count[0]}</p><p className={'f--small ' + s.modalReactionsSharing__all}>All</p></div></li> : null}
            {count[1] ? <li className={selectedFilter === 1 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(1)}><div><p className="f--small">{count[1]}</p><Emoji id={1} size={20} /></div></li> : null}
            {count[2] ? <li className={selectedFilter === 2 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(2)}><div><p className="f--small">{count[2]}</p><Emoji id={2} size={20} /></div></li> : null}
            {count[3] ? <li className={selectedFilter === 3 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(3)}><div><p className="f--small">{count[3]}</p><Emoji id={3} size={20} /></div></li> : null}
            {count[4] ? <li className={selectedFilter === 4 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(4)}><div><p className="f--small">{count[4]}</p><Emoji id={4} size={20} /></div></li> : null}
            {count[5] ? <li className={selectedFilter === 5 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(5)}><div><p className="f--small">{count[5]}</p><Emoji id={5} size={20} /></div></li> : null}
            {count[6] ? <li className={selectedFilter === 6 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(6)}><div><p className="f--small">{count[6]}</p><Emoji id={6} size={20} /></div></li> : null}
            {count[7] ? <li className={selectedFilter === 7 ? s.modalReactionsSharing__tabsSelected : ''} onClick={()=>setSelectedFilter(7)}><div><p className="f--small">{count[7]}</p><Emoji id={7} size={20} /></div></li> : null}
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div ref={usersRef} className={s.modalReactionsSharing__users}>
            {items.map((reaction: Reaction) =>
              <ModalUser
                key={reaction.id}
                type={'reactions'}
                id={reaction.id}
                user={reaction.user}
                reaction={reaction.reaction}
              />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalReactions;