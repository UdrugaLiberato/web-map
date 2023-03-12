/* eslint-disable sonarjs/no-duplicate-string */
import cookieCutter from 'cookie-cutter';
import { Switch } from '@headlessui/react';
import { City, ICategory, ILocation } from '@/types/map-types';
import { baseApiUrl } from '@/utils/settings';
import { useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import { GetServerSideProps } from 'next';

export async function getServerSideProps(context: GetServerSideProps) {
  const categoryCookie = context.req.headers.cookie
    ?.split(';')
    .find((c) => c.includes('category'))
    .slice(10);
  const cityCookie = context.req.headers.cookie
    ?.split(';')
    .find((c) => c.includes('city'))
    .slice(5);
  const url = `${baseApiUrl}/locations?category.name=${categoryCookie}&city.name=${cityCookie}`;
  console.log(url)
  const locations = await (await fetch(encodeURI(url))).json();
  const cities = await (await fetch(`${baseApiUrl}/cities`)).json();
  const categories = await (await fetch(`${baseApiUrl}/categories`)).json();
  return {
    props: {
      locations: locations['hydra:member'],
      cities: cities['hydra:member'],
      categories: categories['hydra:member'],
      categoryCookie: categoryCookie ?? null,
      cityCookie: cityCookie ?? null,
    },
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Index({
  locations,
  categories,
  cities,
  categoryCookie,
  cityCookie,
}: {
  locations: ILocation[];
  categories: ICategory[];
  cities: City[];
  categoryCookie?: string;
  cityCookie?: string;
}) {
  const [settings, setSettings] = useState({
    city: cityCookie || '',
    category: categoryCookie || '',
    theme: 'light',
  });
  const [openMap] = useState<boolean>(
    categoryCookie !== null && cityCookie !== null
  );
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

  if (openMap && settings.city !== '' && settings.category !== '') {
    console.log(cities.find((c) => c.name === settings.city));
    return (
      <MapboxMap
        data={geoLocations}
        city={cities.find((c) => c.name === settings.city)!}
      />
    );
  }

  const saveSettingsToLocalStorage = () => {
    cookieCutter.set('city', settings.city);
    cookieCutter.set('category', settings.category);
    window.location.reload();
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <main className='flex w-full flex-1 flex-col items-center justify-center px-20 text-center'>
        <h1 className='text-6xl font-bold'>Welcome to LiberatoMap</h1>
        <div className='flex w-full flex-1 flex-row items-center justify-center px-20 text-center'>
          <div className='flex w-4 flex-1 flex-col items-center justify-center px-20 text-center'>
            <label htmlFor='city'>City</label>
            <select
              name='city'
              id='city'
              className='mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
              onChange={(e) => {
                setSettings({ ...settings, city: e.target.value });
              }}
            >
              <option value=''>All</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <label htmlFor='category'>Category</label>
            <select
              name='category'
              id='category'
              className='mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
              onChange={(e) => {
                setSettings({ ...settings, category: e.target.value });
              }}
            >
              <option value=''>All</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <label htmlFor='theme'>Theme</label>
            <Switch
              checked={settings.theme === 'dark'}
              onChange={() =>
                setSettings({
                  ...settings,
                  theme: settings.theme === 'dark' ? 'light' : 'dark',
                })
              }
              className={classNames(
                settings.theme === 'dark' ? 'bg-black' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
              )}
            >
              <span className='sr-only'>Use setting</span>
              <span
                aria-hidden='true'
                className={classNames(
                  settings.theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
            <div className='mt-4'>
              <button
                type='button'
                className='rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50'
                disabled={settings.city === '' || settings.category === ''}
                onClick={saveSettingsToLocalStorage}
              >
                Save my settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
