import * as React from 'react';
import { useRef } from 'react';
import { Map, Source, Layer } from 'react-map-gl';
import type { MapRef, GeoJSONSource } from 'react-map-gl';
import { City } from '@/types/map-types';
import {
  clusterCountLayer,
  clusterLayer,
  unclusteredPointLayer,
} from './layer-styles';

export default function MapboxMap({
  data,
  city,
}: {
  data: unknown;
  city: City;
}) {
  const mapRef = useRef<MapRef>(null);

  console.log(city);
  const [popupInfo, setPopupInfo] = React.useState(null);
  const onClick = (event) => {
    if (!event.features[0]) return;
    const isCluster = event.features[0].properties.cluster;
    if (isCluster) {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current.getSource(
        'earthquakes'
      ) as GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500,
        });
      });
    } else {
      event.originalEvent.stopPropagation();
      console.log(event.features[0].properties);
      setPopupInfo({
        mag: event.features[0].properties.id,
      });
    }
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      style={{ height: '100vh', width: '100vw' }}
      onKeyDown={(e) => (e.key === 'Escape' ? setPopupInfo(null) : null)}
      role='main'
    >
      <Map
        initialViewState={{
          latitude: city.latitude,
          longitude: city.longitude,
          zoom: 13,
        }}
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        mapStyle='mapbox://styles/udruga-liberato/clf49fagm009301mlwr20419k'
        mapboxAccessToken='pk.eyJ1IjoidWRydWdhLWxpYmVyYXRvIiwiYSI6ImNreHlpeGk2YjIxYWwybm96NHVuYzF6cWcifQ.cgnywBLz4RhAZRsGyq8XwQ'
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id='earthquakes'
          type='geojson'
          data={data}
          cluster
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
        {popupInfo && (
          <div
            style={{
              position: 'absolute',
              height: '80%',
              width: '80%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 999,
            }}
            className='rounded-lg bg-white/80 p-4 shadow-lg'
          >
            <div className='relative'>
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  cursor: 'pointer',
                  height: '2rem',
                  width: '2rem',
                  backgroundColor: 'red',
                }}
                onClick={() => setPopupInfo(null)}
                tabIndex={0}
                role='button'
                onKeyDown={({ key }) =>
                  key === 'Escape' || key === ' ' || key === 'Enter'
                    ? setPopupInfo(null)
                    : null
                }
              >
                Upri odi
              </div>
            </div>
            {popupInfo.mag}
          </div>
        )}
      </Map>
    </div>
  );
}
