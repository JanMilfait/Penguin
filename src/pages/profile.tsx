import type {NextPage} from 'next';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import {AppState, wrapper} from '../app/store';
import {authenticate} from '../app/helpers/initialFunctionProps';

const Profile: NextPage = () => {
  const {token} = useSelector((state: AppState) => state.auth);

  return (
    <div className="container">
      <h1 className="text-center">
        Your Featuring Code, {token}
      </h1>
      <p>
        Go to <Link href="/">Home</Link>
      </p>

      <p>
        Hello, {token}!
      </p>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticate(store, ctx);

  return {props: {}};
});

export default Profile;
