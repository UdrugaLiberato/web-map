import Link from 'next/link';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export default function MobileVisitor() {
  return (
    <div className='relative isolate h-screen overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16'>
      <h2 className='mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl'>
        You can download the app on your mobile device for better experience.
      </h2>
      <div className='mt-10 flex items-center justify-center gap-x-6'>
        <Link
          href='https://apps.apple.com/app/liberatomap/id6445823976?platform=iphone'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
        >
          <FaApple size={30} className='mr-2' /> Download on the App Store
        </Link>
        <Link
          href='https://play.google.com/store/apps/details?id=com.liberato.map'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center rounded-sm bg-[#3bccff] px-3.5 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm'
        >
          <FaGooglePlay size={30} className='mr-2' /> Download on Google Play
        </Link>
      </div>
      <svg
        viewBox='0 0 1024 1024'
        className='absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]'
        aria-hidden='true'
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill='url(#827591b1-ce8c-4110-b064-7cb85a0b1217)'
          fillOpacity='0.7'
        />
        <defs>
          <radialGradient id='827591b1-ce8c-4110-b064-7cb85a0b1217'>
            <stop stopColor='#7775D6' />
            <stop offset={1} stopColor='#E935C1' />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
