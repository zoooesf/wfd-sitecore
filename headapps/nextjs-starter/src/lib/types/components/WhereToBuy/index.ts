import { Field, RichTextField, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

// ============================================================================
// GOOGLE MAPS API TYPES
// ============================================================================
export interface GoogleMapsLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

export interface GoogleMapsSize {
  width: number;
  height: number;
}

export interface GoogleMapsPoint {
  x: number;
  y: number;
}

export interface GoogleMapsBounds {
  contains(latLng: GoogleMapsLatLng): boolean;
  getCenter(): GoogleMapsLatLng;
  getNorthEast(): GoogleMapsLatLng;
  getSouthWest(): GoogleMapsLatLng;
}

export interface GoogleMapsMarkerIcon {
  url: string;
  scaledSize?: GoogleMapsSize;
  anchor?: GoogleMapsPoint;
}

export interface GoogleMapsMarker {
  getPosition(): GoogleMapsLatLng | null;
  getTitle(): string;
  setMap(map: GoogleMapsMap | null): void;
  addListener(eventName: string, handler: () => void): void;
  groupData?: LocationDataWithPosition[];
}

export interface GoogleMapsInfoWindow {
  setContent(content: string): void;
  open(map: GoogleMapsMap, anchor: GoogleMapsMarker): void;
  close(): void;
  addListener(eventName: string, handler: () => void): void;
}

export interface GoogleMapsCircle {
  setMap(map: GoogleMapsMap | null): void;
  setCenter(center: GoogleMapsLatLngLiteral | GoogleMapsLatLng): void;
  setRadius(radius: number): void;
}

export interface GoogleMapsMap {
  setCenter(latlng: GoogleMapsLatLngLiteral | GoogleMapsLatLng): void;
  setZoom(zoom: number): void;
  getZoom(): number;
  getBounds(): GoogleMapsBounds | undefined;
  getCenter(): GoogleMapsLatLng;
  addListener(eventName: string, handler: () => void): void;
}

export interface GoogleMapsGeometrySpherical {
  computeDistanceBetween(from: GoogleMapsLatLng, to: GoogleMapsLatLng): number;
}

export interface GoogleMapsAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleMapsGeocoderResult {
  formatted_address: string;
  geometry: {
    location: GoogleMapsLatLng;
    location_type: string;
  };
  place_id: string;
  types: string[];
  address_components?: GoogleMapsAddressComponent[];
}

export interface GoogleMapsGeocoder {
  geocode(
    request: { address?: string; location?: GoogleMapsLatLng },
    callback: (results: GoogleMapsGeocoderResult[] | null, status: string) => void
  ): void;
}

// ============================================================================
// GLOBAL WINDOW INTERFACE - Google Maps API Declaration
// ============================================================================
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (mapDiv: HTMLElement, opts: Record<string, unknown>) => GoogleMapsMap;
        Marker: new (opts: {
          position: GoogleMapsLatLng;
          map: GoogleMapsMap;
          title: string;
          icon?: GoogleMapsMarkerIcon;
          zIndex?: number;
        }) => GoogleMapsMarker;
        InfoWindow: new () => GoogleMapsInfoWindow;
        LatLng: new (lat: number, lng: number) => GoogleMapsLatLng;
        Circle: new (opts: {
          center: GoogleMapsLatLng;
          radius: number;
          strokeColor: string;
          strokeOpacity: number;
          strokeWeight: number;
          fillColor: string;
          fillOpacity: number;
          map: GoogleMapsMap;
        }) => GoogleMapsCircle;
        Size: new (
          width: number,
          height: number,
          widthUnit?: string,
          heightUnit?: string
        ) => GoogleMapsSize;
        Point: new (x: number, y: number) => GoogleMapsPoint;
        Geocoder: new () => GoogleMapsGeocoder;
        GeocoderStatus: {
          OK: string;
          ZERO_RESULTS: string;
          OVER_QUERY_LIMIT: string;
          REQUEST_DENIED: string;
          INVALID_REQUEST: string;
          UNKNOWN_ERROR: string;
        };
        event: {
          addListener(instance: unknown, eventName: string, handler: () => void): void;
          addListenerOnce(instance: unknown, eventName: string, handler: () => void): void;
          removeListener(listener: unknown): void;
        };
        geometry: {
          spherical: GoogleMapsGeometrySpherical;
        };
      };
    };
    initMap: () => void;
    storeLocatorInitialized: boolean;
  }
}

// ============================================================================
// COMPONENT TYPES - Data Models and Props
// ============================================================================
export type ServiceItem = {
  displayName?: string;
  name?: string;
};

export type WebsiteJsonValue = {
  value?: {
    href?: string;
    url?: string;
  };
};

export type BusinessProfileGQLResponse = {
  search: {
    total: number;
    pageInfo: {
      endCursor: string;
      hasNext: boolean;
    };
    results: Array<{
      id: string;
      contentName?: { value: string };
      address?: { value: string };
      email?: { value: string };
      phone?: { value: string };
      hours?: { value: string };
      lat?: { value: number };
      long?: { value: number };
      website?: { jsonValue: WebsiteJsonValue };
      services?: { jsonValue: ServiceItem[] };
    }>;
  };
};

export type WhereToBuyFields = {
  heading: Field<string>;
  subheading: RichTextField;
  defaultMapCenterLatitude: Field<number>;
  defaultMapCenterLongitude: Field<number>;
  defaultMapZoomLevel: Field<number>;
  userLocationZoomLevel: Field<number>;
  businessLocationZoomLevel: Field<number>;
  userLocationSearchRadius: Field<number>;
  locationsPerPage: Field<number>;
  userLocationIndicatorColor: Field<string>;
  individualLocationMarkerColor: Field<string>;
  clusterLocationMarkerBackgroundColor: Field<string>;
  clusterLocationMarkerTextAndBorderColor: Field<string>;
};

export type LocationData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  website: string;
  lat: number;
  lng: number;
  services: string[];
};

export type LocationDataWithPosition = LocationData & {
  position: GoogleMapsLatLng;
  distance?: number;
  distanceFromCenter?: number;
  originalIndex: number;
};

export type UserLocationInfo = {
  lat: number;
  lng: number;
};

export type MarkerGroup = {
  locations: LocationDataWithPosition[];
  position: GoogleMapsLatLng;
};

export type ClusterInfoWindow = {
  isCluster: true;
  locations: LocationDataWithPosition[];
};

export type SingleLocationInfoWindow = LocationDataWithPosition & {
  isCluster?: false;
};

export type InfoWindowData = ClusterInfoWindow | SingleLocationInfoWindow;

export type WhereToBuyRenderingType = {
  rendering: ComponentRendering & {
    data: LocationData[];
  };
};

export type WhereToBuyProps = ComponentProps &
  WhereToBuyRenderingType & {
    fields: WhereToBuyFields;
    isMapHidden?: boolean;
  };
