import {AppState, wrapper} from '../../app/store';
import {authenticateUnprotected, getFriends, init, getPost, getComments} from '../../app/ssr/initialFunctions';
import type { NextPage } from 'next';
import {UserData} from '../../features/auth/authSlice.types';
import {expandComments, setPost, useGetPostQuery} from 'features/post/postSlice';
import { SerializedError } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import PostForPageText from '../../features/post/PostForPageText';
import PostForPageContent from 'features/post/PostForPageContent';
import s from 'styles/6_components/PostPage.module.scss';

const Post: NextPage = () => {
  const postId = useSelector((state: AppState) => state.post.post.id);
  const {data: post, isSuccess, isLoading} = useGetPostQuery({id: postId!}, {skip: !postId});

  if (isLoading || !isSuccess) return null;

  const onlyText = post.image === null && post.video === null;

  return (
    <div className={'container container-sidebar' + (onlyText ? ' container-1140' : '')}>
      <div className={s.postPage}>
        <div className="row mt-4 h-100">
          {onlyText ? <PostForPageText /> : <PostForPageContent />}
        </div>
      </div>
    </div>
  );
};

export default Post;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  const post = ctx.params?.post;
  if (!post) return { notFound: true };
  const postId = parseInt(post as string);
  await store.dispatch(setPost({id: postId}));

  await init(store, ctx);
  const auth = await authenticateUnprotected(store, ctx, false) as UserData|undefined;

  await Promise.all([
    store.dispatch(expandComments(postId)),
    auth && getFriends(store),
    getPost(store, postId)
      .then(() => { // post must be fetched first to exclude trending comment
        getComments(store, postId);
      })
  ]);

  const state = store.getState();
  const error = state.api.queries[`getPost({"id":${postId}})`]?.error as SerializedError & {status?: number};
  const error404 = error?.status === 404;
  if (error404) return { notFound: true };
  if (error) return { redirect: { destination: '/error', permanent: false } };

  return {props: {}};
});