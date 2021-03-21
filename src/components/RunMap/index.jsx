import React from 'react';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import {
  MAPBOX_TOKEN,
  IS_CHINESE,
  MAIN_COLOR,
  PROVINCE_FILL_COLOR,
} from 'src/utils/const';
import { geoJsonForMap } from 'src/utils/utils';
import useActivities from 'src/hooks/useActivities';
import RunMapButtons from './RunMapButtons';
import RunMarker from './RunMaker';
import styles from './style.module.scss';

const RunMap = ({
  // eslint-disable-next-line react/prop-types
  title,
  // eslint-disable-next-line react/prop-types
  viewport,
  // eslint-disable-next-line react/prop-types
  setViewport,
  // eslint-disable-next-line react/prop-types
  changeYear,
  // eslint-disable-next-line react/prop-types
  geoData,
  // eslint-disable-next-line react/prop-types
  thisYear,
}) => {
  const { provinces } = useActivities();
  const addControlHandler = (event) => {
    const map = event && event.target;
    // set lauguage to Chinese if you use English please comment it
    if (map && IS_CHINESE) {
      map.addControl(
        new MapboxLanguage({
          defaultLanguage: 'zh',
        }),
      );
      map.setLayoutProperty('country-label-lg', 'text-field', [
        'get',
        'name_zh',
      ]);
    }
  };
  const filterProvinces = provinces.slice();
  // for geojson format
  filterProvinces.unshift('in', 'name');

  // eslint-disable-next-line react/prop-types
  const isBigMap = viewport.zoom <= 3;
  if (isBigMap && IS_CHINESE) {
    // eslint-disable-next-line no-param-reassign
    geoData = geoJsonForMap();
  }

  // eslint-disable-next-line react/prop-types
  const isSingleRun = geoData.features.length === 1
    // eslint-disable-next-line react/prop-types
    && geoData.features[0].geometry.coordinates.length;
  let startLon;
  let startLat;
  let endLon;
  let endLat;
  if (isSingleRun) {
    // eslint-disable-next-line react/prop-types
    const points = geoData.features[0].geometry.coordinates;
    // eslint-disable-next-line prefer-destructuring
    [startLon, startLat] = points[0];
    // eslint-disable-next-line react/prop-types
    [endLon, endLat] = points[points.length - 1];
  }

  return (
    <ReactMapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      onLoad={addControlHandler}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <RunMapButtons changeYear={changeYear} thisYear={thisYear} />
      <Source id="data" type="geojson" data={geoData}>
        <Layer
          id="prvince"
          type="fill"
          paint={{
            'fill-color': PROVINCE_FILL_COLOR,
          }}
          filter={filterProvinces}
        />
        <Layer
          id="runs2"
          type="line"
          paint={{
            'line-color': MAIN_COLOR,
            'line-width': isBigMap ? 1 : 2,
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
        />
      </Source>
      {isSingleRun && (
        <RunMarker
          startLat={startLat}
          startLon={startLon}
          endLat={endLat}
          endLon={endLon}
        />
      )}
      <span className={styles.runTitle}>{title}</span>
    </ReactMapGL>
  );
};

export default RunMap;
