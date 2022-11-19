import '../styles/styles.scss';
import type {AppProps} from 'next/app';
import {wrapper} from '../app/store';
import {Provider} from 'react-redux';
import Head from 'next/head';
import {Roboto_Flex} from '@next/font/google';

const roboto = Roboto_Flex();

function MyApp({ Component, ...rest }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <title>Penguin</title>
        <meta name="description" content="Penguion social app" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#06c0d9" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={roboto.className}>
        <Component {...props.pageProps} />
      </main>
    </Provider>
  );
}

export default MyApp;
