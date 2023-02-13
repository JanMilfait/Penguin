import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Posts.module.scss';
import {AppDispatch, AppState} from '../../app/store';
import {isEdited, setStopEditingPosts, useUpdatePostMutation} from './postSlice';
import {Post} from './postSlice.types';
import TextareaAutosize from 'react-textarea-autosize';
import { useRouter } from 'next/router';

const PostBody = ({id, slug, body}: {id: Post['id'], slug: Post['slug'] | null, body: Post['body']}) => {
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);
  const edit = useSelector((state: AppState) => isEdited(state, id)) as string|false;

  const router = useRouter();
  const [updatePost] = useUpdatePostMutation();

  const handleEdit = () => {
    const el = textareaRef.current;
    const oldText = edit;
    dispatch(setStopEditingPosts());
    if (!el) return;
    if (el.value === oldText || el.value === '') return;

    const formData = new FormData();
    formData.append('body', el.value);
    updatePost({id, formData});
  };

  return (
    <div onDoubleClick={() => router.push('/post/' + slug)}>
      {edit === false
        ? <h3 className={s.posts__body + ' f--small mt-4 mb-3 py-2'}>{body}</h3>
        : <TextareaAutosize
          ref={(el) => textareaRef.current = el}
          className={s.posts__editBody + ' f--small mt-4 mb-3 py-2 px-0'}
          defaultValue={body || ''}
          autoFocus
          onBlur={handleEdit}
          onFocus={e => e.target.selectionStart = e.target.selectionEnd = e.target.value.length}
          onKeyDown={e => e.key === 'Enter' && handleEdit()} />
      }
    </div>
  );
};

export default PostBody;