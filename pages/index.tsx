/* eslint-disable sonarjs/no-duplicate-string */
import MapboxMap from '@/components/MapboxMap';
import { City, ICategory, ILocation } from '@/types/map-types';
import { baseApiUrl } from '@/utils/settings';

export async function getStaticProps() {
  const locations = await (await fetch(`${baseApiUrl}/locations`)).json();
  const cities = await (await fetch(`${baseApiUrl}/cities`)).json();
  const categories = await (await fetch(`${baseApiUrl}/categories`)).json();
  return {
    props: {
      locations: locations['hydra:member'],
      cities: cities['hydra:member'],
      categories: categories['hydra:member'],
    },
    revalidate: 120,
  };
}

export default function index({
  locations,
  categories,
  cities,
}: {
  locations: ILocation[];
  categories: ICategory[];
  cities: City[];
}) {
  const geoLocations = {
    type: 'FeatureCollection',
    features: locations.map((location) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        id: location.id,
        name: location.name,
        street: location.street,
        city: location.city,
        phone: location.phone,
        email: location.email,
        about: location.about,
        image: location.images,
      },
    })),
  };
  return <MapboxMap data={geoLocations} city={cities[0]} />;
}
