import type { NextPage } from 'next';
import Logo from '../components/Logo';

const Custom404: NextPage = () => {
  return (
    <div className="container">
      <style>
        {`
          nav {
            display: none;
          }
          .container {
            height: calc(100dvh - 3em);
           }
        `}
      </style>
      <div className="d-flex align-items-center justify-content-center flex-column h-100">
        <div className="pe-none mb-4">
          <Logo width={100} height={100} hardRefresh={true} />
        </div>
        <h1 className="fw-bold">404 <span className="fs-3">- Page Not Found</span></h1>
      </div>
    </div>
  );
};

export default Custom404;