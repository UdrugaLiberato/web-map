import MobileVisitor from '@/components/MobileVisitor';
import MobileDetect from 'mobile-detect';
import { GetServerSidePropsContext } from 'next';
import Map, { Marker } from 'react-map-gl';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoidWRydWdhLWxpYmVyYXRvIiwiYSI6ImNreHlqMHUwMTRwMXEyeHFrdG5sOWJ5Z3EifQ.258kxbeyO1QwlNidVFTRNA';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const md = new MobileDetect(context.req.headers['user-agent'] as string);

  return {
    props: {
      isMobile: Boolean(md.mobile()),
    },
  };
}

export default function Home({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return <MobileVisitor />;
  }
  return (
    <div>
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14,
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Marker longitude={-122.4} latitude={37.8} color='red' />
      </Map>
    </div>
  );
}
