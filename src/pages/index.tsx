import {AppState, wrapper} from '../app/store';
import {authenticate} from '../app/helpers/initialFunctionProps';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Home: NextPage = () => {
  const { token, data } = useSelector((state: AppState) => state.auth);


  return (
    <div className="container">
      <button>{data && data.name}</button>
      <p>
        Go to <Link href="/profile">Profile</Link> {token}
      </p>
      <img src="http://localhost:8000/chat/images/[1]lLP4SrXFmSN73EUSL0br76uINHHoRr0gTpSskNvc.jpg" />
    </div>
  );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticate(store, ctx);

  return {props: {}};
});
