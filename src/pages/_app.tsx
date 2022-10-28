import '../styles/styles.scss';
import type {AppProps} from 'next/app';
import {wrapper} from '../app/store';
import {Provider} from 'react-redux';
import {setToken, AuthApi} from '../features/auth/authSlice';

function MyApp({ Component, ...rest }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
}

export default MyApp;

export const authenticate = async (store, {req, res}) => {
  const token = req?.cookies?.token;

  if (token) {
    const response = await store.dispatch(AuthApi.endpoints.fetchClient.initiate({}, {forceRefetch: true}));

    if (response.isError) {
      console.error(`Error: ${response.error.message || 'Couldn\'t log in'}`);

      res.writeHead(302, { Location: '/login' });
      res.end();
    }
  } else {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
};