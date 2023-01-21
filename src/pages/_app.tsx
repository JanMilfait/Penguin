import '../styles/styles.scss';
import type { AppProps } from 'next/app';
import { wrapper } from '../app/store';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { Roboto } from '@next/font/google';
import { useEffect } from 'react';
import { setAppLoaded, setIsMobile, setWindow } from '../features/root/rootSlice';
import debounce from 'lodash.debounce';
import ComponentShared from 'features/root/ComponentShared';
import {isSSR} from '../app/helpers/helpers';

const roboto = Roboto({weight: ['400', '500', '700']});

function MyApp({ Component, ...rest }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(rest);

  /**
   * 1. Dispatch appLoaded
   * 2. Calculate visual viewport for mobile devices
   * 3. Detect if the user is on a mobile device (first dispatch - ssr init)
   */
  useEffect(() => {
    store.dispatch(setAppLoaded(true));

    const calculateVisualViewport = () => {
      document.documentElement.style.setProperty('--visual100vh', `${visualViewport?.height}px`);
    };
    const handleResize = debounce(() => {
      store.dispatch(setWindow({width: window.innerWidth, height: window.innerHeight}));
      if (window.innerWidth < 768) {
        store.dispatch(setIsMobile(true));
      } else if (window.innerWidth >= 768) {
        store.dispatch(setIsMobile(false));
      }
    }, 500);

    !isSSR() && visualViewport?.addEventListener('resize', calculateVisualViewport);
    window.addEventListener('resize', handleResize);

    !isSSR() && calculateVisualViewport();
    handleResize(); // ssr already guessed the device type, but viewport width is not available on the server

    return () => {
      !isSSR() && visualViewport?.removeEventListener('resize', calculateVisualViewport);
      window.removeEventListener('resize', handleResize);
    };
  }, []);


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
      <div className={roboto.className}>
        <main className="pb-5">
          <Component {...props.pageProps} />
        </main>
        <ComponentShared />
      </div>
    </Provider>
  );
}

export default MyApp;
