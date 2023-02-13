import {AppState, wrapper} from '../../app/store';
import {init, postPage} from '../../app/ssr/functions';
import type { NextPage } from 'next';
import {useGetPostQuery} from 'features/post/postSlice';
import { useSelector } from 'react-redux';
import PostForPageText from '../../features/post/PostForPageText';
import PostForPageContent from 'features/post/PostForPageContent';
import s from 'styles/6_components/PostPage.module.scss';

const Slug: NextPage = () => {
  const slug = useSelector((state: AppState) => state.post.post.slug);
  const {data: post, isSuccess, isLoading} = useGetPostQuery({slug: slug!}, {skip: typeof slug !== 'string'});

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

export default Slug;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  const error = await postPage(store, ctx);

  if (error?.status === 404) return { notFound: true };
  if (error) return { redirect: { destination: '/error', permanent: false } };

  return {props: {}};
});