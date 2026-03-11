// ============================================================================
// IMPORTS
// ============================================================================
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Head from 'next/head';
import Script from 'next/script';
import Frame from 'component-children/Shared/Frame/Frame';
import { ContainedWrapper } from 'component-children/Shared/Containers/ContainedWrapper';
import {
  Text,
  RichText,
  GetComponentServerProps,
  withDatasourceCheck,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { useTranslation } from 'lib/hooks/useTranslation';
import { useFrame } from 'lib/hooks/useFrame';
import { getGraphQlClient } from 'lib/graphql-client';
import { BUSINESS_PROFILE_TEMPLATE_ID } from 'lib/graphql/id';
import { PRIMARY_THEME, TERTIARY_THEME } from 'lib/const';
import {
  getLayoutLanguage,
  getSiteName,
  fetchSiteRootInfo,
  contentRootIdNullChecker,
} from 'lib/helpers';
import { GetBusinessProfiles } from 'graphql/generated/graphql-documents';
import { StoreListItem } from 'component-children/WhereToBuy/StoreListItem';
import { LoadMoreButton } from 'component-children/WhereToBuy/LoadMoreButton';
import type {
  GoogleMapsLatLngLiteral,
  GoogleMapsLatLng,
  GoogleMapsMarker,
  GoogleMapsInfoWindow,
  GoogleMapsCircle,
  GoogleMapsMap,
  GoogleMapsBounds,
  GoogleMapsAddressComponent,
  GoogleMapsGeocoderResult,
  ServiceItem,
  BusinessProfileGQLResponse,
  LocationData,
  LocationDataWithPosition,
  UserLocationInfo,
  MarkerGroup,
  InfoWindowData,
  WhereToBuyProps,
} from 'lib/types/components/WhereToBuy';

// ============================================================================
// CONSTANTS
// ============================================================================
const MARKER_SIZE = 32;
const USER_LOCATION_MARKER_SIZE = 24;
const CLUSTER_BASE_WIDTH = 80;
const CLUSTER_MIN_WIDTH = 80;
const CLUSTER_TEXT_MULTIPLIER = 8;
const AUTO_ZOOM_DELAY = 100;
const INFO_WINDOW_DELAY = 200;
const SCROLL_OFFSET = 20;
const USER_LOCATION_RADIUS = 100; // meters
const MOBILE_BREAKPOINT = 768; // pixels
const GEOLOCATION_TIMEOUT = 3000; // milliseconds

// DOM element IDs
const MANUAL_LOCATION_INPUT_ID = 'manual-location-input';
const CLEAR_INPUT_BTN_ID = 'clear-input-btn';
const SUBMIT_LOCATION_BTN_ID = 'submit-location-btn';
const FIND_ME_BTN_ID = 'find-me-btn';
const FULLSCREEN_BTN_ID = 'fullscreen-btn';

// Zoom thresholds for marker clustering
const ZOOM_THRESHOLD_BASE = 0.0005;
const ZOOM_THRESHOLD_MULTIPLIER = 0.02;
const ZOOM_REFERENCE_LEVEL = 8;

// ============================================================================
// MAIN COMPONENT - WhereToBuy Store Locator
// ============================================================================
const WhereToBuy: React.FC<WhereToBuyProps> = (props) => {
  // Environment and Props Setup
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { params, fields, rendering, isMapHidden = false } = props;
  const { page } = useSitecore();

  // Get theme for smart button logic
  const { effectiveTheme } = useFrame();

  // Smart button color: light backgrounds get dark buttons, dark backgrounds get yellow buttons
  const buttonColorClass =
    effectiveTheme === PRIMARY_THEME || effectiveTheme === TERTIARY_THEME
      ? 'secondary'
      : 'tertiary';

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  // Check if we're in mobile view
  const isMobileView = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  };

  // Normalize hex color codes (handle with or without #)
  const normalizeHexColor = useCallback((color?: string): string => {
    if (!color) return '';
    const cleanColor = color.trim();
    return cleanColor.startsWith('#') ? cleanColor : `#${cleanColor}`;
  }, []);

  // ============================================================================
  // DATA AND TRANSLATION SETUP
  // ============================================================================
  const locations: LocationData[] = useMemo(
    () => (rendering?.data as LocationData[]) || [],
    [rendering?.data]
  );

  const { t } = useTranslation();
  const findByLocationLabel = t('Find by address, city, or postal/zip code');
  const manualLocationPlaceholder = t('Enter location...');
  const useMyLocationLabel = t('Use My Location');
  const usingMyLocationLabel = t('Using My Location');
  const gettingMyLocationLabel = t('Getting My Location...');
  const couldNotFindLocationLabel = t('Could not find that location');
  const geolocationServiceFailedLabel = t('Geolocation service failed');
  const geolocationNotSupportedLabel = t('Browser does not support geolocation');
  const noLocationsMatchYourCriteriaOrAreVisibleOnTheMapLabel = t(
    'No locations match your criteria or are visible on the map'
  );
  const noLocationsMatchYourCriteriaLabel = t('No locations match your criteria');
  const websiteLabel = t('Website');
  const getDirectionsLabel = t('Get Directions');
  const loadMoreLabel = t('Load more');
  const readMoreLabel = t('Read More');
  const readLessLabel = t('Read Less');
  const locationLabel = t('Location');
  const locationsLabel = t('Locations');
  const yourLocationLabel = t('Your Location');
  const mapCenterLabel = t('Map Center');

  // ============================================================================
  // BUSINESS PROFILES METADATA - For Search Indexing
  // ============================================================================
  const businessProfilesText = useMemo(() => {
    if (!locations || locations.length === 0) return '';
    return locations
      .map((location) => location.name)
      .filter(Boolean) // Remove any null/undefined/empty names
      .join(', ');
  }, [locations]);

  // ============================================================================
  // REFS - Map and UI Element References
  // ============================================================================
  const selectedLocationNameRef = useRef<string | null>(null);
  const isGoogleMapsLoaded = useRef(false);
  const mapRef = useRef<GoogleMapsMap | null>(null);
  const markersRef = useRef<GoogleMapsMarker[]>([]);
  const infoWindowRef = useRef<GoogleMapsInfoWindow | null>(null);
  const centerMarkerRef = useRef<(GoogleMapsMarker & { pulseCircle?: GoogleMapsCircle }) | null>(
    null
  );

  // ============================================================================
  // MAP INITIALIZATION - Main Map Setup Function
  // ============================================================================
  const initializeMap = useCallback(() => {
    // Prevent multiple initializations
    if (mapRef.current || isGoogleMapsLoaded.current) {
      return;
    }

    // Validate Google Maps API availability
    if (
      !window.google ||
      !window.google.maps ||
      !window.google.maps.geometry ||
      !window.google.maps.geometry.spherical ||
      typeof window.google.maps.geometry.spherical.computeDistanceBetween !== 'function'
    ) {
      console.warn('Google Maps geometry library not fully loaded, will retry...');
      return;
    }

    isGoogleMapsLoaded.current = true;

    // ============================================================================
    // HELPER FUNCTIONS - UI Updates
    // ============================================================================

    // Update status message in both desktop and mobile elements
    function updateStatusMessage(message: string): void {
      const statusElement = document.getElementById('status-message');
      if (statusElement) statusElement.textContent = message;
    }

    function clearStatusMessage(): void {
      updateStatusMessage('');
    }

    // Update "Find Me" button state for both desktop and mobile
    function updateFindMeButtonState(buttonText: string, iconName: string): void {
      const btn = document.getElementById(FIND_ME_BTN_ID);
      const text = btn?.querySelector('.btn-text') as HTMLElement;
      const icon = btn?.querySelector('.material-icons') as HTMLElement;

      if (text) text.textContent = buttonText;
      if (icon) icon.textContent = iconName;
    }

    // Restore an info window to its previous state
    function restoreInfoWindow(marker: GoogleMapsMarker, location: InfoWindowData): void {
      if (!infoWindowRef.current || !mapRef.current) return;

      const content =
        'isCluster' in location && location.isCluster
          ? getClusterInfoWindowContent(location.locations)
          : getInfoWindowContent(location);

      infoWindowRef.current.setContent(content);
      applyInfoWindowStyles();
      infoWindowRef.current.open(mapRef.current, marker);
      currentOpenInfoWindow = location;
    }

    // ============================================================================
    // MAP STATE VARIABLES - Internal State Management
    // ============================================================================
    let allLocations: LocationDataWithPosition[] = [];
    let userLocation: UserLocationInfo | null = null;
    let isUsingMyLocation: boolean = false; // Track if "Use My Location" is active
    let currentlyVisibleLocations: LocationDataWithPosition[] = [];
    let previouslyVisibleLocations: LocationDataWithPosition[] = [];
    let locationToOpenInfoWindow: LocationDataWithPosition | null = null;
    let currentOpenInfoWindow: InfoWindowData | null = null;
    let isAutoZooming: boolean = false; // Flag to prevent zoom_changed interference during auto-zoom
    let addressAutofill: boolean = false;
    let autoZoomTimeout: ReturnType<typeof setTimeout> | null = null;
    let userHasManualControl: boolean = false;
    let pendingAutoZoomTimeout: ReturnType<typeof setTimeout> | null = null;

    let locationsToShow = fields.locationsPerPage?.value;
    const DEFAULT_CENTER: GoogleMapsLatLngLiteral = {
      lat: fields.defaultMapCenterLatitude?.value,
      lng: fields.defaultMapCenterLongitude?.value,
    };

    // ============================================================================
    // MAP CREATION AND SETUP
    // ============================================================================
    try {
      // Only create map if not hidden
      if (!isMapHidden) {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
          console.error('Map element not found!');
          return;
        }

        // Initialize Google Maps instance
        mapRef.current = new window.google.maps.Map(mapElement, {
          center: DEFAULT_CENTER,
          zoom: fields.defaultMapZoomLevel?.value,
          gestureHandling: 'greedy',
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          scaleControl: false,
          rotateControl: true,
          rotateControlOptions: {
            position: 8, // RIGHT_CENTER position
          },
          panControl: true,
          panControlOptions: {
            position: 8, // RIGHT_CENTER position
          },
          disableDefaultUI: false,
        });

        // Intercept ALL map movement methods to prevent unwanted map movements
        const originalSetCenter = mapRef.current.setCenter.bind(mapRef.current);
        const mapAny = mapRef.current as GoogleMapsMap & {
          panTo?: (center: GoogleMapsLatLngLiteral | GoogleMapsLatLng) => void;
          panBy?: (x: number, y: number) => void;
          fitBounds?: (
            bounds: GoogleMapsBounds | { north: number; south: number; east: number; west: number },
            padding?: number | { top: number; right: number; bottom: number; left: number }
          ) => void;
        };
        const originalPanTo = mapAny.panTo && mapAny.panTo.bind(mapRef.current);
        const originalPanBy = mapAny.panBy && mapAny.panBy.bind(mapRef.current);
        const originalFitBounds = mapAny.fitBounds && mapAny.fitBounds.bind(mapRef.current);

        // Track if setCenter was called by Google Maps during manual control
        // We'll let it through so center_changed fires, then revert it there
        mapRef.current.setCenter = function (center: GoogleMapsLatLngLiteral | GoogleMapsLatLng) {
          return originalSetCenter(center);
        };

        // Let panTo, panBy, fitBounds through - we'll handle snapback in center_changed
        if (originalPanTo) {
          mapAny.panTo = function (center: GoogleMapsLatLngLiteral | GoogleMapsLatLng) {
            return originalPanTo(center);
          };
        }

        if (originalPanBy) {
          mapAny.panBy = function (x: number, y: number) {
            return originalPanBy(x, y);
          };
        }

        if (originalFitBounds) {
          mapAny.fitBounds = function (
            bounds: GoogleMapsBounds | { north: number; south: number; east: number; west: number },
            padding?: number | { top: number; right: number; bottom: number; left: number }
          ) {
            return originalFitBounds(bounds, padding);
          };
        }

        infoWindowRef.current = new window.google.maps.InfoWindow();

        // Add close listener to clear the tracked open info window
        infoWindowRef.current.addListener('closeclick', () => {
          currentOpenInfoWindow = null;
        });
      }

      // Transform location data to include Google Maps position objects and original index for sorting
      allLocations = locations.map((location, index) => ({
        ...location,
        position: new window.google.maps.LatLng(location.lat, location.lng),
        originalIndex: index, // Track original order for restoration
      }));

      onFilterChange();

      // ============================================================================
      // EVENT LISTENERS SETUP
      // ============================================================================

      // Helper function to setup location input event listeners
      const setupLocationInput = (
        inputId: string,
        clearBtnId: string,
        submitBtnId: string,
        findMeBtnId: string
      ) => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        const clearBtn = document.getElementById(clearBtnId);
        const submitBtn = document.getElementById(submitBtnId);
        const findMeBtn = document.getElementById(findMeBtnId);

        // Function to toggle clear button visibility
        const toggleClearButton = () => {
          if (clearBtn && input) {
            if (input.value.trim() === '') {
              clearBtn.style.display = 'none';
            } else {
              clearBtn.style.display = 'flex';
            }
          }
        };

        if (input) {
          input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleManualLocationSubmit();
            }
          });

          // Add input event listener to show/hide clear button
          input.addEventListener('input', toggleClearButton);

          // Initialize clear button visibility on setup
          toggleClearButton();

          // Handle input changes - deactivate "Use My Location" when user manually edits
          input.addEventListener('input', () => {
            // Skip reset logic if input is being set programmatically
            if (addressAutofill) {
              return;
            }

            const inputValue = input.value.trim();

            if (isUsingMyLocation) {
              // Preserve the input text after using "Use My Location"
              isUsingMyLocation = false;
              updateFindMeButtonState(useMyLocationLabel, 'my_location');
              clearStatusMessage();

              // Remove user location marker
              if (centerMarkerRef.current) {
                centerMarkerRef.current.setMap(null);
                if (centerMarkerRef.current.pulseCircle) {
                  centerMarkerRef.current.pulseCircle.setMap(null);
                }
                centerMarkerRef.current = null;
              }
            }

            // Reset map to default zoom when input is empty
            if (inputValue === '' && mapRef.current) {
              mapRef.current.setCenter(DEFAULT_CENTER);
              mapRef.current.setZoom(fields.defaultMapZoomLevel?.value);
            }
          });
        }

        if (clearBtn) {
          clearBtn.addEventListener('click', clearInputAndReset);
        }

        if (submitBtn) {
          submitBtn.addEventListener('click', handleManualLocationSubmit);
        }

        if (findMeBtn) {
          findMeBtn.addEventListener('click', toggleUseMyLocation);
        }
      };

      // Setup desktop inputs
      setupLocationInput(
        MANUAL_LOCATION_INPUT_ID,
        CLEAR_INPUT_BTN_ID,
        SUBMIT_LOCATION_BTN_ID,
        FIND_ME_BTN_ID
      );

      // Setup fullscreen control button
      const fullscreenBtn = document.getElementById(FULLSCREEN_BTN_ID);
      const mapContainer = document.getElementById('map-container');

      if (fullscreenBtn && mapContainer) {
        fullscreenBtn.addEventListener('click', () => {
          const isFullscreen = document.fullscreenElement === mapContainer;

          if (isFullscreen) {
            // Exit fullscreen
            document.exitFullscreen().catch((err) => {
              console.error('Error exiting fullscreen:', err);
            });
          } else {
            // Enter fullscreen
            mapContainer.requestFullscreen().catch((err) => {
              console.error('Error entering fullscreen:', err);
            });
          }
        });

        // Update button icon when fullscreen state changes
        document.addEventListener('fullscreenchange', () => {
          const icon = fullscreenBtn.querySelector('.material-icons');
          if (icon) {
            if (document.fullscreenElement === mapContainer) {
              icon.textContent = 'fullscreen_exit';
              fullscreenBtn.setAttribute('title', 'Exit fullscreen');
            } else {
              icon.textContent = 'fullscreen';
              fullscreenBtn.setAttribute('title', 'Enter fullscreen');
            }
          }
        });
      }

      // Only add map event listeners if map exists
      if (mapRef.current) {
        mapRef.current.addListener('idle', () => {
          // If we just finished zooming, re-render markers to update clustering
          // This happens AFTER the animation completes, preventing the blink
          if (isZooming && mapRef.current && currentlyVisibleLocations.length > 0) {
            renderMapMarkers(currentlyVisibleLocations);
          }

          // Clear dragging and zooming flags when map becomes idle
          isDragging = false;
          isZooming = false;

          // Handle opening info window after map animation completes
          // ONLY process if explicitly requested and no manual control
          if (locationToOpenInfoWindow && !userHasManualControl) {
            const location = locationToOpenInfoWindow;

            // Immediately clear to prevent re-processing
            locationToOpenInfoWindow = null;

            // Try to find as individual marker first
            const individualMarker = markersRef.current.find((m) => m.getTitle() === location.name);

            if (individualMarker && infoWindowRef.current) {
              // Found as individual marker
              infoWindowRef.current.setContent(getInfoWindowContent(location));
              applyInfoWindowStyles();
              infoWindowRef.current.open(mapRef.current!, individualMarker);
              currentOpenInfoWindow = location;
            } else {
              // Check if it's part of a cluster
              const clusterMarker = markersRef.current.find((m) =>
                m.groupData?.some((loc) => loc.name === location.name)
              );

              if (clusterMarker && infoWindowRef.current) {
                // Show only the nearest location's info, not the whole cluster
                infoWindowRef.current.setContent(getInfoWindowContent(location));
                applyInfoWindowStyles();
                infoWindowRef.current.open(mapRef.current!, clusterMarker);
                currentOpenInfoWindow = location;
              }
            }

            // Reset auto-zoom flag after info window is opened
            if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
            autoZoomTimeout = setTimeout(() => {
              isAutoZooming = false;
              autoZoomTimeout = null;
            }, INFO_WINDOW_DELAY);
          }
        });

        // Add dragstart listener to detect when user manually pans the map
        // This prevents snapback when user navigates away from selected location
        mapRef.current.addListener('dragstart', () => {
          // Set dragging flag to allow large movements during drag
          isDragging = true;

          // User has taken manual control
          userHasManualControl = true;

          // Clear any pending auto-zoom operations and timeouts
          if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
          if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);

          // Clear the auto-zooming flag to allow normal zoom behavior
          isAutoZooming = false;

          // Clear the location to open info window to prevent snapback
          locationToOpenInfoWindow = null;
          autoZoomTimeout = null;
          pendingAutoZoomTimeout = null;

          // End grace period - user is now in full manual control
          lastAutoZoomTime = 0;
        });

        // Add wheel event listener to detect manual zoom via mouse wheel
        const mapElement = document.getElementById('map');
        if (mapElement) {
          mapElement.addEventListener(
            'wheel',
            () => {
              // User has taken manual control via mouse wheel
              userHasManualControl = true;

              // Clear any pending auto-zoom operations and timeouts
              if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
              if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);
              isAutoZooming = false;
              locationToOpenInfoWindow = null;
              autoZoomTimeout = null;
              pendingAutoZoomTimeout = null;

              // End grace period - user is now in full manual control
              lastAutoZoomTime = 0;
            },
            { passive: true }
          );
        }

        // Track the previous zoom level to detect manual zoom changes
        let previousZoom = mapRef.current.getZoom() || 0;
        let isZooming = false; // Track active zoom operations

        // Add zoom change listener to detect zoom operations
        mapRef.current.addListener('zoom_changed', () => {
          const currentZoom = mapRef.current?.getZoom() || 0;

          // Always mark that we're zooming when zoom changes (for marker clustering updates)
          if (currentZoom !== previousZoom) {
            isZooming = true;
          }

          // If zoom changed while NOT auto-zooming, user is manually zooming
          // Clear auto-zoom state to prevent snapback
          if (!isAutoZooming && currentZoom !== previousZoom) {
            userHasManualControl = true;

            // Clear any pending auto-zoom operations and timeouts
            if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
            if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);
            locationToOpenInfoWindow = null;
            autoZoomTimeout = null;
            pendingAutoZoomTimeout = null;

            // End grace period - user is now in full manual control
            lastAutoZoomTime = 0;

            // Update lastAllowedCenter immediately during manual zoom
            // This prevents snapback from center adjustments during zoom
            const currentCenter = mapRef.current?.getCenter();
            if (currentCenter) {
              lastAllowedCenter = currentCenter;
            }
          }

          previousZoom = currentZoom;
        });

        // Track the last allowed center position to detect unwanted snapbacks
        let lastAllowedCenter: GoogleMapsLatLng | null = mapRef.current.getCenter() || null;
        let isReverting = false;
        let revertTimeout: NodeJS.Timeout | null = null;
        let isDragging = false; // Track active dragging to allow large manual movements
        let lastAutoZoomTime = 0; // Track when last auto-zoom completed
        const AUTO_ZOOM_GRACE_PERIOD = 500; // Grace period after auto-zoom (ms)

        // Add center_changed listener to actively prevent unwanted map movements
        mapRef.current.addListener('center_changed', () => {
          if (isReverting) {
            return;
          }

          const currentCenter = mapRef.current?.getCenter();
          if (!currentCenter) return;

          const currentLat = currentCenter.lat();
          const currentLng = currentCenter.lng();

          // If we're auto-zooming or user clicked a location, allow the change
          if (!userHasManualControl || isAutoZooming) {
            lastAllowedCenter = currentCenter;
            lastAutoZoomTime = Date.now(); // Record auto-zoom time
            return;
          }

          // If user is actively dragging, allow large movements without snapback detection
          if (isDragging) {
            lastAllowedCenter = currentCenter;
            return;
          }

          // If user is actively zooming, allow center adjustments without snapback detection
          if (isZooming) {
            lastAllowedCenter = currentCenter;
            return;
          }

          // Check if we're in the grace period after auto-zoom
          const timeSinceAutoZoom = Date.now() - lastAutoZoomTime;
          if (timeSinceAutoZoom < AUTO_ZOOM_GRACE_PERIOD) {
            lastAllowedCenter = currentCenter;
            return;
          }

          // User has manual control - check if this is a snapback
          if (lastAllowedCenter) {
            const lastLat = lastAllowedCenter.lat();
            const lastLng = lastAllowedCenter.lng();
            const distance = Math.sqrt(
              Math.pow(currentLat - lastLat, 2) + Math.pow(currentLng - lastLng, 2)
            );

            // If the map jumped more than 0.005 degrees (~500m), it's likely a snapback
            if (distance > 0.005) {
              // Clear any pending revert
              if (revertTimeout) clearTimeout(revertTimeout);

              // Revert after a tiny delay to let Google Maps finish its animation cycle
              revertTimeout = setTimeout(() => {
                isReverting = true;
                mapRef.current?.setCenter(lastAllowedCenter!);
                // Reset after a delay
                setTimeout(() => {
                  isReverting = false;
                }, 50);
              }, 10);
              return;
            }
          }

          // This is a small, legitimate movement - track it
          lastAllowedCenter = currentCenter;
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // ============================================================================
    // FILTER AND UPDATE FUNCTIONS
    // ============================================================================
    function onFilterChange(): void {
      updateAndRender();
    }

    function locationsHaveChanged(
      current: LocationDataWithPosition[],
      previous: LocationDataWithPosition[]
    ): boolean {
      if (current.length !== previous.length) return true;

      // Check if the same locations are present in the same order
      for (let i = 0; i < current.length; i++) {
        if (
          current[i].name !== previous[i].name ||
          current[i].lat !== previous[i].lat ||
          current[i].lng !== previous[i].lng
        ) {
          return true;
        }
      }
      return false;
    }

    function scrollStoreListToTop(): void {
      const storeListEl = document.getElementById('store-list');
      if (storeListEl) {
        storeListEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // ============================================================================
    // GEOLOCATION FUNCTIONS
    // ============================================================================
    function geocodeLocation(address: string): void {
      if (isUsingMyLocation) {
        toggleUseMyLocation();
      }

      // Reset manual control flag - we're initiating a new intentional auto-zoom
      userHasManualControl = false;

      // Clear any previous auto-zoom state and selected location to prevent snapback
      if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
      if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);
      isAutoZooming = false;
      locationToOpenInfoWindow = null;
      autoZoomTimeout = null;
      pendingAutoZoomTimeout = null;
      selectedLocationNameRef.current = null;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const result = results[0];
          const location = result.geometry.location;

          userLocation = {
            lat: location.lat(),
            lng: location.lng(),
          };

          // Calculate distances for all locations
          allLocations.forEach((loc) => {
            loc.distance =
              window.google.maps.geometry.spherical.computeDistanceBetween(
                new window.google.maps.LatLng(userLocation!.lat, userLocation!.lng),
                loc.position
              ) / 1000;
          });

          // Add user location marker WITHOUT zooming or centering the map
          const userLocationLatLng = new window.google.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          );
          addCenterMarker(userLocationLatLng, true);

          updateAndRender(true);
          scrollStoreListToTop();

          // Zoom to nearest location and open popup
          // Use setTimeout to ensure markers are fully rendered before opening popup
          pendingAutoZoomTimeout = setTimeout(() => {
            // Only proceed if user hasn't taken manual control
            if (!userHasManualControl && mapRef.current && currentlyVisibleLocations.length > 0) {
              const nearestLocation = currentlyVisibleLocations[0];

              // Set flag to prevent zoom_changed from interfering
              isAutoZooming = true;

              // Set the location to open - the idle event will handle it after zoom completes
              locationToOpenInfoWindow = nearestLocation;
              mapRef.current.setCenter(nearestLocation.position);
              mapRef.current.setZoom(fields.businessLocationZoomLevel?.value);
              highlightAndScrollToList(nearestLocation);
            }
            pendingAutoZoomTimeout = null;
          }, AUTO_ZOOM_DELAY);
        } else {
          handleLocationError(couldNotFindLocationLabel);
        }
      });
    }

    function reverseGeocodeLocation(lat: number, lng: number): void {
      const geocoder = new window.google.maps.Geocoder();
      const latLng = new window.google.maps.LatLng(lat, lng);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const result: GoogleMapsGeocoderResult = results[0];
          const addressComponents = result.address_components || [];

          // Extract address components
          let streetNumber = '';
          let route = '';
          let locality = '';
          let adminArea = '';

          addressComponents.forEach((component: GoogleMapsAddressComponent) => {
            if (component.types.includes('street_number')) {
              streetNumber = component.long_name;
            }
            if (component.types.includes('route')) {
              route = component.long_name;
            }
            if (component.types.includes('locality')) {
              locality = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              adminArea = component.short_name;
            }
          });

          // Format as "Street Address, City, State"
          const addressParts = [];
          if (streetNumber && route) {
            addressParts.push(`${streetNumber} ${route}`);
          } else if (route) {
            addressParts.push(route);
          }
          if (locality) {
            addressParts.push(locality);
          }
          if (adminArea) {
            addressParts.push(adminArea);
          }

          const formattedAddress = addressParts.join(', ');

          // Populate the manual location input field
          const manualLocationInput = document.getElementById(
            MANUAL_LOCATION_INPUT_ID
          ) as HTMLInputElement;
          if (manualLocationInput && formattedAddress) {
            // Set flag to prevent input event listener from resetting "Use My Location" state
            addressAutofill = true;
            manualLocationInput.value = formattedAddress;
            // Trigger input event to update button visibility (e.g., show clear button)
            manualLocationInput.dispatchEvent(new Event('input', { bubbles: true }));
            // Reset flag after event is processed
            addressAutofill = false;
          }
        }
        // Silently fail - location feature still works without the address
      });
    }

    function toggleUseMyLocation(): void {
      // If already using location, turn it off
      if (isUsingMyLocation) {
        // Deactivate
        isUsingMyLocation = false;
        userLocation = null;

        // Clear distances and restore original order
        allLocations.forEach((loc) => (loc.distance = undefined));
        allLocations.sort((a, b) => a.originalIndex - b.originalIndex);

        // Remove user location marker
        if (centerMarkerRef.current) {
          centerMarkerRef.current.setMap(null);
          if (centerMarkerRef.current.pulseCircle) {
            centerMarkerRef.current.pulseCircle.setMap(null);
          }
          centerMarkerRef.current = null;
        }

        // Clear input field
        const manualLocationInput = document.getElementById(
          MANUAL_LOCATION_INPUT_ID
        ) as HTMLInputElement;
        if (manualLocationInput) {
          manualLocationInput.value = '';
        }

        // Update button UI - inactive state
        updateFindMeButtonState(useMyLocationLabel, 'my_location');

        // Clear status messages
        clearStatusMessage();

        updateAndRender(true);
        scrollStoreListToTop();
        return;
      }

      // Activate "Use My Location"
      // Reset manual control flag - we're initiating a new intentional auto-zoom
      userHasManualControl = false;

      // Clear any previous auto-zoom state and selected location to prevent snapback
      if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
      if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);
      isAutoZooming = false;
      locationToOpenInfoWindow = null;
      autoZoomTimeout = null;
      pendingAutoZoomTimeout = null;
      selectedLocationNameRef.current = null;

      // Clear any existing error messages
      clearStatusMessage();

      // Set button to loading state
      updateFindMeButtonState(gettingMyLocationLabel, 'hourglass_empty');

      // Success callback for geolocation
      // NOTE: Location accuracy varies significantly by device and method:
      // - Mobile with GPS: 10-50 meters (high accuracy)
      // - Desktop with WiFi: 100-1000 meters (moderate accuracy)
      // - Desktop with IP only: 1-5 kilometers (low accuracy)
      // Browser's navigator.geolocation uses basic IP/WiFi positioning.
      // For better desktop accuracy, Google's proprietary Geolocation API would be needed,
      // but it has per-request costs. Current implementation prioritizes cost-free operation.
      const handleGeolocationSuccess = (position: GeolocationPosition) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        isUsingMyLocation = true;

        // Reverse geocode to get address and populate input field
        reverseGeocodeLocation(userLocation.lat, userLocation.lng);

        allLocations.forEach((loc) => {
          loc.distance =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(userLocation!.lat, userLocation!.lng),
              loc.position
            ) / 1000;
        });

        // Update button UI - active state
        updateFindMeButtonState(usingMyLocationLabel, 'location_on');

        // Add user location marker WITHOUT zooming or centering the map
        const userLocationLatLng = new window.google.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        );
        addCenterMarker(userLocationLatLng, true);

        updateAndRender(true); // Force marker update when user location is found
        scrollStoreListToTop();

        // Zoom to nearest location and open popup
        // Use setTimeout to ensure markers are fully rendered before opening popup
        pendingAutoZoomTimeout = setTimeout(() => {
          // Only proceed if user hasn't taken manual control
          if (!userHasManualControl && mapRef.current && currentlyVisibleLocations.length > 0) {
            const nearestLocation = currentlyVisibleLocations[0];

            // Set flag to prevent zoom_changed from interfering
            isAutoZooming = true;

            // Set the location to open - the idle event will handle it after zoom completes
            locationToOpenInfoWindow = nearestLocation;
            mapRef.current.setCenter(nearestLocation.position);
            mapRef.current.setZoom(fields.businessLocationZoomLevel?.value);
            highlightAndScrollToList(nearestLocation);
          }
          pendingAutoZoomTimeout = null;
        }, 100);
      };

      if (navigator.geolocation) {
        // Two-tier geolocation strategy:
        // 1. Try high accuracy first (uses GPS on mobile devices for 10-50m accuracy)
        // 2. If high accuracy fails/times out, fallback to standard accuracy
        //    (uses WiFi/IP positioning, works on desktop but less accurate: 1-5km range)
        // This ensures mobile users get precise location while desktop users still get a location.
        navigator.geolocation.getCurrentPosition(
          handleGeolocationSuccess,
          () => {
            // High accuracy failed (common on desktop without GPS), fallback to standard accuracy
            navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, () =>
              handleLocationError(geolocationServiceFailedLabel)
            );
          },
          {
            enableHighAccuracy: true, // Request GPS if available for better accuracy
            timeout: GEOLOCATION_TIMEOUT, // Wait for location before falling back
            maximumAge: 0, // Don't use cached positions
          }
        );
      } else {
        handleLocationError(geolocationNotSupportedLabel);
      }
    }

    function handleLocationError(errorMessage: string): void {
      updateStatusMessage(errorMessage);

      // Reset button state
      isUsingMyLocation = false;
      updateFindMeButtonState(useMyLocationLabel, 'my_location');

      userLocation = null;
      allLocations.forEach((loc) => (loc.distance = undefined));
      allLocations.sort((a, b) => a.originalIndex - b.originalIndex);
      updateAndRender(true); // Force marker update when handling location error
    }

    function clearInputAndReset(): void {
      const manualLocationInput = document.getElementById(
        MANUAL_LOCATION_INPUT_ID
      ) as HTMLInputElement;
      const clearBtn = document.getElementById(CLEAR_INPUT_BTN_ID);

      // Clear input field
      if (manualLocationInput) {
        manualLocationInput.value = '';
      }

      // Hide clear button
      if (clearBtn) {
        clearBtn.style.display = 'none';
      }

      // Clear status messages
      clearStatusMessage();

      // Reset "Use My Location" button state
      if (isUsingMyLocation) {
        isUsingMyLocation = false;
        updateFindMeButtonState(useMyLocationLabel, 'my_location');
      }

      // Clear location data and reset sorting to original order
      userLocation = null;
      allLocations.forEach((loc) => (loc.distance = undefined));
      allLocations.sort((a, b) => a.originalIndex - b.originalIndex);

      // Remove user location marker
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setMap(null);
        if (centerMarkerRef.current.pulseCircle) {
          centerMarkerRef.current.pulseCircle.setMap(null);
        }
        centerMarkerRef.current = null;
      }

      // Reset map to default position and zoom
      if (mapRef.current) {
        mapRef.current.setCenter(DEFAULT_CENTER);
        mapRef.current.setZoom(fields.defaultMapZoomLevel?.value);
      }

      updateAndRender(true);
      scrollStoreListToTop();
    }

    function handleManualLocationSubmit(): void {
      const manualLocationInput = document.getElementById(
        MANUAL_LOCATION_INPUT_ID
      ) as HTMLInputElement;

      const address = manualLocationInput?.value?.trim() || '';
      if (address) {
        geocodeLocation(address);
      }
    }

    // ============================================================================
    // UI UPDATE FUNCTIONS
    // ============================================================================
    function updateAndRender(forceMarkerUpdate: boolean = false): void {
      // Show ALL filtered locations (no map bounds filtering)
      const visibleLocationsInBounds: LocationDataWithPosition[] = allLocations;

      // Sort the visible locations based on user location
      if (userLocation) {
        // User location is set: sort by distance to user location
        visibleLocationsInBounds.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }
      // No user location: locations stay in original order (unsorted)

      currentlyVisibleLocations = visibleLocationsInBounds;

      // Only re-render markers if the visible locations have actually changed or if forced
      const shouldUpdateMarkers =
        forceMarkerUpdate ||
        locationsHaveChanged(currentlyVisibleLocations, previouslyVisibleLocations);

      if (mapRef.current && shouldUpdateMarkers) {
        renderMapMarkers(currentlyVisibleLocations);
        // Update the previous locations reference
        previouslyVisibleLocations = [...currentlyVisibleLocations];
      }

      // Always update the store list as it's less disruptive
      renderStoreList(currentlyVisibleLocations);
    }

    // ============================================================================
    // LOCATIONS LIST RENDERING
    // ============================================================================
    function renderStoreList(locations: LocationDataWithPosition[]): void {
      const storeListEl = document.getElementById('store-list');
      const paginationControlsEl = document.getElementById('pagination-controls');

      if (!storeListEl || !paginationControlsEl) return;

      // Clear existing content
      storeListEl.innerHTML = '';
      paginationControlsEl.innerHTML = '';

      if (locations.length === 0) {
        // Use shorter message for mobile view or no map variant, otherwise use full message
        const noLocationsMessage =
          isMapHidden || isMobileView()
            ? noLocationsMatchYourCriteriaLabel
            : noLocationsMatchYourCriteriaOrAreVisibleOnTheMapLabel;
        storeListEl.innerHTML = `<p class="text-center text-content/80">${noLocationsMessage}</p>`;
        return;
      }

      const locationsToDisplay = locations.slice(0, locationsToShow);

      // Handler for location card click
      const handleLocationCardClick = (location: LocationDataWithPosition) => {
        // Update selected location reference
        const previousSelected = selectedLocationNameRef.current;
        selectedLocationNameRef.current = location.name;

        // Reset manual control flag - user is intentionally selecting a location
        userHasManualControl = false;

        // Clear any pending auto-zoom operations
        if (pendingAutoZoomTimeout) clearTimeout(pendingAutoZoomTimeout);
        pendingAutoZoomTimeout = null;

        // Set flag to prevent zoom_changed listener from triggering re-render during zoom animation
        isAutoZooming = true;

        // Update map
        if (mapRef.current) {
          locationToOpenInfoWindow = location;
          mapRef.current?.setCenter(location.position);
          mapRef.current?.setZoom(fields.businessLocationZoomLevel?.value);
        }

        // Reset flag after zoom animation completes
        if (autoZoomTimeout) clearTimeout(autoZoomTimeout);
        autoZoomTimeout = setTimeout(() => {
          isAutoZooming = false;
          autoZoomTimeout = null;
        }, INFO_WINDOW_DELAY);

        // Remove the selection class and add the default class to the previous selected card
        if (previousSelected) {
          const prevCard = document.querySelector('[data-location-id="' + previousSelected + '"]');
          if (prevCard) {
            prevCard.classList.remove(
              'border-[rgb(var(--next-tertiary-bg))]',
              'bg-[rgb(var(--next-tertiary-bg)/0.2)]'
            );
            prevCard.classList.add('border-content/20', 'bg-surface');
          }
        }

        // Remove the default class and add the selection class to the current active clicked card
        const selectedCard = document.querySelector('[data-location-id="' + location.name + '"]');
        if (selectedCard) {
          selectedCard.classList.remove('border-content/20', 'bg-surface');
          selectedCard.classList.add(
            'border-[rgb(var(--next-tertiary-bg))]',
            'bg-[rgb(var(--next-tertiary-bg)/0.2)]'
          );
        }
      };

      // Create a temporary container to render React components
      const container = document.createElement('div');
      container.className = 'space-y-3';
      storeListEl.appendChild(container);
      const root = createRoot(container);

      // Render store list items
      root.render(
        <>
          {locationsToDisplay.map((location, index) => (
            <StoreListItem
              key={`${location.name}-${index}`}
              location={location}
              itemNumber={index + 1}
              isMapHidden={isMapHidden}
              isMobileView={isMobileView()}
              isSelected={selectedLocationNameRef.current === location.name}
              onTitleClick={!isMapHidden && !isMobileView() ? handleLocationCardClick : undefined}
              buttonColorClass={buttonColorClass}
              labels={{
                websiteLabel,
                getDirectionsLabel,
                readMoreLabel,
                readLessLabel,
              }}
            />
          ))}
        </>
      );

      // Add load more button as the last item if there are more locations
      if (locations.length > locationsToShow) {
        const loadMoreContainer = document.createElement('div');
        storeListEl.appendChild(loadMoreContainer);
        const loadMoreRoot = createRoot(loadMoreContainer);

        const handleLoadMore = () => {
          const previousCount = locationsToShow;
          locationsToShow += fields.locationsPerPage?.value;
          updateAndRender(true); // Force marker update when loading more

          // Scroll to the first newly loaded item within the store list container
          setTimeout(() => {
            const storeListEl = document.getElementById('store-list');
            if (storeListEl) {
              const storeItems = storeListEl.querySelectorAll('.store-item');
              if (storeItems.length > previousCount) {
                const firstNewItem = storeItems[previousCount] as HTMLElement;
                if (firstNewItem) {
                  // Calculate the position relative to the scrollable container
                  const containerRect = storeListEl.getBoundingClientRect();
                  const itemRect = firstNewItem.getBoundingClientRect();
                  const relativeTop = itemRect.top - containerRect.top + storeListEl.scrollTop;

                  // Scroll the container to show the new item
                  storeListEl.scrollTo({
                    top: relativeTop - SCROLL_OFFSET,
                    behavior: 'smooth',
                  });
                }
              }
            }
          }, 100);
        };

        loadMoreRoot.render(
          <LoadMoreButton
            onClick={handleLoadMore}
            label={loadMoreLabel}
            buttonColorClass="secondary"
          />
        );
      }
    }

    // ============================================================================
    // MARKER ICON CREATION FUNCTIONS
    // ============================================================================
    function createNumberedMarkerIcon(number: number): string {
      const svg = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="30" height="30" rx="0" ry="0" fill="${normalizeHexColor(
            fields.individualLocationMarkerColor?.value
          )}" stroke="#ffffff" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${number}</text>
        </svg>
      `;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function createClusterIcon(count: number): string {
      // Calculate width based on text length - wider for double digits
      const text = `${count} ${count === 1 ? locationLabel : locationsLabel}`;
      const baseWidth = Math.max(CLUSTER_MIN_WIDTH, text.length * CLUSTER_TEXT_MULTIPLIER);
      const height = 32;
      const rx = 0; // No rounded corners

      const svg = `
        <svg width="${baseWidth}" height="${height}" viewBox="0 0 ${baseWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="${baseWidth - 4}" height="${height - 4}" rx="${rx - 2}" ry="${
            rx - 2
          }" fill="${normalizeHexColor(
            fields.clusterLocationMarkerBackgroundColor?.value || '#fff'
          )}" stroke="${normalizeHexColor(
            fields.clusterLocationMarkerTextAndBorderColor?.value || '#000'
          )}" stroke-width="2"/>
          <text x="${baseWidth / 2}" y="${
            height / 2 + 5
          }" text-anchor="middle" fill="${normalizeHexColor(
            fields.clusterLocationMarkerTextAndBorderColor?.value || '#000'
          )}" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${text}</text>
        </svg>
      `;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function createCenterMarkerIcon(): string {
      const svg = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" fill="#ffffff"/>
        </svg>
      `;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function createUserLocationIcon(): string {
      const svg = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${normalizeHexColor(
            fields.userLocationIndicatorColor?.value
          )}" stroke="#ffffff" stroke-width="2"/>
          <circle cx="12" cy="12" r="6" fill="#ffffff"/>
          <circle cx="12" cy="12" r="2" fill="${normalizeHexColor(
            fields.userLocationIndicatorColor?.value
          )}"/>
        </svg>
      `;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    // ============================================================================
    // MARKER CLUSTERING AND GROUPING
    // ============================================================================
    function groupMarkersByLocation(locations: LocationDataWithPosition[]): MarkerGroup[] {
      // Dynamic threshold based on zoom level
      const zoom = mapRef.current?.getZoom() || 10;

      // At zoom 4: 0.01 (very generous, ~1km)
      // At zoom 8: 0.005 (moderate, ~500m)
      // At zoom 12: 0.002 (tight, ~200m)
      // At zoom 15+: 0.0005 (very tight, ~50m)
      const baseThreshold = Math.max(
        ZOOM_THRESHOLD_BASE,
        ZOOM_THRESHOLD_MULTIPLIER * Math.pow(2, ZOOM_REFERENCE_LEVEL - zoom)
      );
      const threshold = baseThreshold;

      const groups: MarkerGroup[] = [];

      locations.forEach((location) => {
        let addedToGroup = false;

        // Check if this location overlaps with any existing group
        for (const group of groups) {
          // Check if location is close to ANY location in the group, not just the representative
          const isCloseToGroup = group.locations.some((groupLocation) => {
            const latDiff = Math.abs(location.lat - groupLocation.lat);
            const lngDiff = Math.abs(location.lng - groupLocation.lng);
            return latDiff < threshold && lngDiff < threshold;
          });

          if (isCloseToGroup) {
            group.locations.push(location);
            addedToGroup = true;
            break;
          }
        }

        // If not added to any group, create a new group
        if (!addedToGroup) {
          groups.push({
            locations: [location],
            position: location.position,
          });
        }
      });

      return groups;
    }

    function addCenterMarker(position: GoogleMapsLatLng, isUserLocation: boolean = false): void {
      // Remove existing center marker if any
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setMap(null);
        // Also remove pulse circle if it exists
        if (centerMarkerRef.current.pulseCircle) {
          centerMarkerRef.current.pulseCircle.setMap(null);
        }
      }

      if (!mapRef.current || !position) return;

      const icon = isUserLocation ? createUserLocationIcon() : createCenterMarkerIcon();
      const title = isUserLocation ? yourLocationLabel : mapCenterLabel;

      centerMarkerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
        title: title,
        icon: {
          url: icon,
          scaledSize: new window.google.maps.Size(
            USER_LOCATION_MARKER_SIZE,
            USER_LOCATION_MARKER_SIZE
          ),
          anchor: new window.google.maps.Point(
            USER_LOCATION_MARKER_SIZE / 2,
            USER_LOCATION_MARKER_SIZE / 2
          ),
        },
        zIndex: 2000, // Higher than location markers to ensure visibility
      });

      if (isUserLocation) {
        // Add a pulsing circle animation for user location
        const pulseCircle = new window.google.maps.Circle({
          center: position,
          radius: USER_LOCATION_RADIUS,
          strokeColor: normalizeHexColor(fields.userLocationIndicatorColor?.value),
          strokeOpacity: 0.4,
          strokeWeight: 2,
          fillColor: normalizeHexColor(fields.userLocationIndicatorColor?.value),
          fillOpacity: 0.1,
          map: mapRef.current,
        });

        // Store reference to remove it later if needed
        (
          centerMarkerRef.current as GoogleMapsMarker & { pulseCircle: GoogleMapsCircle }
        ).pulseCircle = pulseCircle;
      }
    }

    // ============================================================================
    // MAP MARKERS RENDERING
    // ============================================================================
    function renderMapMarkers(locations: LocationDataWithPosition[]): void {
      // Only render markers if map exists
      if (!mapRef.current) return;

      // Check if there's currently an open info window and preserve its state
      let wasInfoWindowOpen = false;
      let openLocation: InfoWindowData | null = null;

      if (infoWindowRef.current && currentOpenInfoWindow) {
        wasInfoWindowOpen = true;
        openLocation = currentOpenInfoWindow;
      }

      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      if (locations.length === 0) return;

      // Group markers by proximity using ALL locations to get correct cluster counts
      const markerGroups = groupMarkersByLocation(locations);

      markerGroups.forEach((group) => {
        if (group.locations.length === 1) {
          // Single marker - always show on map
          const location = group.locations[0];
          const locationIndex = locations.indexOf(location);
          const itemNumber = locationIndex + 1;

          // Check if position exists, if not create it
          if (!location.position) {
            location.position = new window.google.maps.LatLng(location.lat, location.lng);
          }

          const marker = new window.google.maps.Marker({
            position: location.position,
            map: mapRef.current!,
            title: location.name,
            icon: {
              url: createNumberedMarkerIcon(itemNumber),
              scaledSize: new window.google.maps.Size(MARKER_SIZE, MARKER_SIZE),
              anchor: new window.google.maps.Point(MARKER_SIZE / 2, MARKER_SIZE / 2),
            },
            zIndex: 1000 + itemNumber,
          });

          marker.addListener('click', () => {
            showInfoWindow(marker, location);
          });

          markersRef.current.push(marker);

          // Immediately restore info window if this is the location that had it open
          if (
            wasInfoWindowOpen &&
            openLocation &&
            !('isCluster' in openLocation) &&
            openLocation.name === location.name
          ) {
            restoreInfoWindow(marker, openLocation);
            wasInfoWindowOpen = false; // Prevent restoration later
          }
        } else {
          // Multiple markers at same location - show cluster icon
          const clusterMarker = new window.google.maps.Marker({
            position: group.position,
            map: mapRef.current!,
            title: `${group.locations.length} ${
              group.locations.length === 1 ? locationLabel : locationsLabel
            }`,
            icon: {
              url: createClusterIcon(group.locations.length),
              scaledSize: new window.google.maps.Size(
                Math.max(
                  CLUSTER_BASE_WIDTH,
                  `${group.locations.length} ${
                    group.locations.length === 1 ? locationLabel : locationsLabel
                  }`.length * CLUSTER_TEXT_MULTIPLIER
                ),
                MARKER_SIZE
              ),
              anchor: new window.google.maps.Point(
                Math.max(
                  CLUSTER_BASE_WIDTH / 2,
                  `${group.locations.length} ${
                    group.locations.length === 1 ? locationLabel : locationsLabel
                  }`.length *
                    (CLUSTER_TEXT_MULTIPLIER / 2)
                ),
                MARKER_SIZE / 2
              ),
            },
            zIndex: 2000, // Higher than individual markers
          }) as GoogleMapsMarker & { groupData: LocationDataWithPosition[] };

          // Store group data with the marker for click handling
          clusterMarker.groupData = group.locations;

          clusterMarker.addListener('click', () => {
            showClusterInfoWindow(clusterMarker, group.locations);
          });

          markersRef.current.push(clusterMarker);

          // Immediately restore cluster info window if this matches the open one
          if (
            wasInfoWindowOpen &&
            openLocation &&
            'isCluster' in openLocation &&
            openLocation.isCluster &&
            openLocation.locations.length === group.locations.length
          ) {
            // More specific matching: compare the actual location names to ensure correct cluster
            const openLocationNames = openLocation.locations.map((loc) => loc.name).sort();
            const groupLocationNames = group.locations.map((loc) => loc.name).sort();
            const isMatchingCluster =
              openLocationNames.length === groupLocationNames.length &&
              openLocationNames.every((name, index) => name === groupLocationNames[index]);

            if (isMatchingCluster) {
              restoreInfoWindow(clusterMarker, openLocation);
              wasInfoWindowOpen = false; // Prevent restoration later
            }
          }
        }
      });

      // Fallback restoration if immediate restoration didn't work
      if (wasInfoWindowOpen && openLocation) {
        if ('isCluster' in openLocation && openLocation.isCluster) {
          // Restore cluster info window
          const openLocationNames = openLocation.locations.map((loc) => loc.name).sort();
          const clusterMarker = markersRef.current.find((m) => {
            if (!m.groupData || m.groupData.length !== openLocation.locations.length) {
              return false;
            }
            // Compare actual location names to ensure correct cluster
            const markerLocationNames = m.groupData.map((loc) => loc.name).sort();
            return (
              markerLocationNames.length === openLocationNames.length &&
              markerLocationNames.every((name, index) => name === openLocationNames[index])
            );
          }) as (GoogleMapsMarker & { groupData: LocationDataWithPosition[] }) | undefined;
          if (clusterMarker) {
            restoreInfoWindow(clusterMarker, openLocation);
          }
        } else {
          // Restore individual location info window
          const marker = markersRef.current.find((m) => m.getTitle() === openLocation.name);
          if (marker) {
            restoreInfoWindow(marker, openLocation);
          }
        }
      }
    }

    // ============================================================================
    // INFO WINDOW CONTENT GENERATION
    // ============================================================================
    function getInfoWindowContent(location: LocationDataWithPosition): string {
      return (
        '<div class="p-1 font-ppmori max-w-xs">' +
        '<p class="text-base mb-1 font-bold text-black break-words">' +
        location.name +
        '</p>' +
        (location.address
          ? '<p class="text-sm mb-1 text-gray-700 break-words">' + location.address + '</p>'
          : '') +
        (location.phone
          ? '<a href="tel:' +
            location.phone +
            '" class="text-sm font-normal mb-1 break-all text-black hover:underline block">' +
            location.phone +
            '</a>'
          : '') +
        (location.email
          ? '<a href="mailto:' +
            location.email +
            '" class="text-sm text-black break-all hover:underline">' +
            location.email +
            '</a>'
          : '') +
        '</div>'
      );
    }

    function getClusterInfoWindowContent(locations: LocationDataWithPosition[]): string {
      let content = '<div class="p-2 font-ppmori max-w-sm">';
      content +=
        '<p class="text-base mb-2 font-bold">' +
        locations.length +
        ` ${locations.length === 1 ? locationLabel : locationsLabel}</p>`;

      locations.forEach((location) => {
        content += '<div class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">';
        content += '<p class="text-sm font-semibold">' + location.name + '</p>';
        if (location.address) {
          content += '<p class="text-xs text-gray-600">' + location.address + '</p>';
        }
        if (location.phone) {
          content +=
            '<a href="tel:' +
            location.phone +
            '" class="text-xs text-gray-700 hover:underline">' +
            location.phone +
            '</a>';
        }
        content += '</div>';
      });

      content += '</div>';
      return content;
    }

    // ============================================================================
    // INFO WINDOW DISPLAY FUNCTIONS
    // ============================================================================
    function applyInfoWindowStyles(): void {
      // Use Google Maps' domready event to apply styles after InfoWindow DOM is fully rendered
      if (!infoWindowRef.current) return;

      window.google.maps.event.addListenerOnce(infoWindowRef.current, 'domready', () => {
        // Remove border radius from InfoWindow container
        const infoWindowElements = document.querySelectorAll('.gm-style-iw-c, .gm-style-iw-t');
        infoWindowElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.borderRadius = '0px';
          }
        });

        // Remove border radius from close button
        const closeButtons = document.querySelectorAll('.gm-ui-hover-effect');
        closeButtons.forEach((button) => {
          if (button instanceof HTMLElement) {
            button.style.borderRadius = '0px';
          }
        });

        // Remove blank space at top of InfoWindow by positioning header absolutely
        const headerContainer = document.querySelector('.gm-style-iw-chr');
        if (headerContainer instanceof HTMLElement) {
          headerContainer.classList.add('absolute', 'right-0', 'top-0', 'z-10');
        }
        // style the content container
        const infoWindowContent = document.querySelector('.gm-style .gm-style-iw-d');
        if (infoWindowContent instanceof HTMLElement) {
          infoWindowContent.classList.add('mr-8', 'pt-3');
        }
      });
    }

    function showClusterInfoWindow(
      marker: GoogleMapsMarker,
      locations: LocationDataWithPosition[]
    ): void {
      if (infoWindowRef.current && mapRef.current) {
        infoWindowRef.current.setContent(getClusterInfoWindowContent(locations));
        applyInfoWindowStyles();
        infoWindowRef.current.open(mapRef.current, marker);
        currentOpenInfoWindow = { isCluster: true, locations }; // Track cluster info window
      }
    }

    function highlightAndScrollToList(location: LocationDataWithPosition): void {
      // Update selected location ref
      selectedLocationNameRef.current = location.name;

      // Re-render the store list to reflect selection
      updateAndRender(false);

      // Scroll to the selected item
      setTimeout(() => {
        const storeItem = document.querySelector('[data-location-id="' + location.name + '"]');
        if (storeItem) {
          storeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }

    function showInfoWindow(marker: GoogleMapsMarker, location: LocationDataWithPosition): void {
      // Only show info window if map exists
      if (infoWindowRef.current && mapRef.current) {
        infoWindowRef.current.setContent(getInfoWindowContent(location));
        applyInfoWindowStyles();
        infoWindowRef.current.open(mapRef.current, marker);
        currentOpenInfoWindow = location; // Track the currently open info window
      }

      const locationIndex = currentlyVisibleLocations.findIndex(
        (loc) => loc.name === location.name
      );

      if (locationIndex === -1) {
        return;
      }

      if (locationIndex >= locationsToShow) {
        locationsToShow = locationIndex + 1;
        updateAndRender(true); // Force marker update when expanding to show clicked location
      }

      highlightAndScrollToList(location);
    }
  }, [
    useMyLocationLabel,
    usingMyLocationLabel,
    gettingMyLocationLabel,
    couldNotFindLocationLabel,
    fields,
    locations,
    normalizeHexColor,
    geolocationServiceFailedLabel,
    geolocationNotSupportedLabel,
    noLocationsMatchYourCriteriaOrAreVisibleOnTheMapLabel,
    noLocationsMatchYourCriteriaLabel,
    websiteLabel,
    getDirectionsLabel,
    loadMoreLabel,
    readMoreLabel,
    readLessLabel,
    locationLabel,
    locationsLabel,
    yourLocationLabel,
    mapCenterLabel,
    isMapHidden,
    buttonColorClass,
  ]);

  // ============================================================================
  // COMPONENT INITIALIZATION
  // ============================================================================
  useEffect(() => {
    // Wait for Google Maps to be loaded
    const checkGoogleMaps = () => {
      if (typeof window === 'undefined' || isGoogleMapsLoaded.current) {
        return;
      }

      // Check if Google Maps API and all required libraries are fully loaded
      if (
        window.google &&
        window.google.maps &&
        window.google.maps.Map &&
        window.google.maps.Marker &&
        window.google.maps.InfoWindow &&
        window.google.maps.LatLng &&
        window.google.maps.Circle &&
        window.google.maps.Size &&
        window.google.maps.Point &&
        window.google.maps.geometry &&
        window.google.maps.geometry.spherical &&
        typeof window.google.maps.geometry.spherical.computeDistanceBetween === 'function'
      ) {
        // Add a small delay to ensure everything is fully initialized
        setTimeout(() => {
          if (!isGoogleMapsLoaded.current) {
            initializeMap();
          }
        }, 50);
      } else {
        // Check again after a short delay if Google Maps isn't loaded yet
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Clean up markers
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        // Clean up center marker
        if (centerMarkerRef.current) {
          centerMarkerRef.current.setMap(null);
          if (centerMarkerRef.current.pulseCircle) {
            centerMarkerRef.current.pulseCircle.setMap(null);
          }
        }

        // Clean up info window
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      }
    };
  }, [initializeMap]);

  // ============================================================================
  // COMPONENT JSX RENDER
  // ============================================================================
  return (
    <Frame params={params}>
      <ContainedWrapper>
        <Head>
          <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
          <style jsx>{`
            html,
            body {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }

            .overflow-y-auto::-webkit-scrollbar {
              width: 8px;
            }

            .overflow-y-auto::-webkit-scrollbar-track {
              background: rgb(var(--next-primary-bg));
            }

            .overflow-y-auto::-webkit-scrollbar-thumb {
              background: rgb(var(--text) / 0.3);
              border-radius: 0px;
            }

            .overflow-y-auto::-webkit-scrollbar-thumb:hover {
              background: rgb(var(--text) / 0.5);
            }
          `}</style>

          {/* Business Profiles Metadata for Sitecore Search Indexing */}
          {businessProfilesText && (
            <meta
              property="m_businessProfiles"
              content={businessProfilesText}
              key="business-profiles-search"
            />
          )}
        </Head>

        {/* Google Maps Script Loading */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,geometry`}
          strategy="afterInteractive"
          onLoad={() => {
            // Set a flag to indicate the script has loaded
            if (typeof window !== 'undefined') {
              window.storeLocatorInitialized = false; // Reset initialization flag
            }
          }}
          onError={(e) => {
            console.error('Failed to load Google Maps script:', e);
          }}
        />

        {/* Component Header */}
        <Text field={fields.heading} tag="h2" className="mb-8" />
        <RichText field={fields.subheading} className="richtext mb-8" />

        {/* Edit Mode Message for Empty Locations */}
        {page?.mode.isEditing && locations.length === 0 && (
          <div className="border-red-200 bg-red-50 mb-8 rounded-md border p-4">
            <div className="flex items-center">
              <div className="ml-3">
                <h3 className="text-red-800 text-sm font-medium">No Business Locations Found</h3>
                <div className="text-red-700 mt-2 text-sm">
                  <p>
                    Please add business profile locations to display on the map and in the location
                    list. Business profiles should be created as content items under the site
                    content tree (Settings/Component Settings/Business Profiles).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Store Locator Interface */}
        <div className={`where-to-buy primary bg-surface font-ppmori text-content`}>
          <div className="flex h-200 flex-col md:flex-row">
            {/* Left Panel - Search and Store List */}
            <div
              className={`flex h-full w-full flex-col bg-surface ${
                isMapHidden ? 'w-full' : 'md:w-1/3 lg:w-1/4'
              }`}
            >
              {/* Geolocation Controls */}
              <div className="border-b border-content/20 bg-surface pb-4 pr-4 md:pr-8">
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-content">{findByLocationLabel}</div>
                  <div className="relative">
                    <input
                      type="text"
                      id={MANUAL_LOCATION_INPUT_ID}
                      placeholder={`${manualLocationPlaceholder}`}
                      className="w-full rounded-md border border-content/20 bg-white p-2 pr-22 text-black"
                    />
                    <button
                      id={SUBMIT_LOCATION_BTN_ID}
                      className="tertiary absolute bottom-0 right-0 top-0 flex w-12 items-center justify-center rounded-r-md bg-button-surface text-content transition-colors hover:bg-button-surface/90"
                      aria-label="Submit location"
                    >
                      <span className="material-icons text-lg">arrow_forward</span>
                    </button>
                    <button
                      id={CLEAR_INPUT_BTN_ID}
                      className="absolute right-13 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                      title="Clear"
                    >
                      <span className="material-icons text-base">close</span>
                    </button>
                  </div>
                  <button
                    id={FIND_ME_BTN_ID}
                    className="secondary flex w-full items-center justify-center rounded-md bg-button-surface p-2 transition-all duration-300 ease-in-out hover:bg-button-surface/90"
                  >
                    <span className="material-icons mr-2 text-content">my_location</span>
                    <span className="btn-text text-content">{useMyLocationLabel}</span>
                  </button>
                  <div id="status-message" className="text-center text-sm text-black"></div>
                </div>
              </div>

              {/* Store List Container */}
              <div
                id="store-list"
                className="primary flex-1 space-y-3 overflow-y-auto py-4 pr-4"
              ></div>

              {/* Pagination Controls */}
              <div id="pagination-controls" className="hidden"></div>
            </div>

            {/* Right Panel - Google Map (conditionally rendered) */}
            {!isMapHidden && (
              <div
                id="map-container"
                className="relative hidden h-full w-full md:block md:w-2/3 lg:w-3/4"
              >
                <div id="map" className="h-full"></div>

                {/* Fullscreen Control */}
                <button
                  id={FULLSCREEN_BTN_ID}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-content/20 bg-white shadow-md transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  aria-label="Toggle fullscreen"
                  title="Enter fullscreen"
                >
                  <span className="material-icons text-xl text-gray-700">fullscreen</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </ContainedWrapper>
    </Frame>
  );
};

// ============================================================================
// COMPONENT VARIANTS - Different Display Modes
// ============================================================================
const WhereToBuyDefault: React.FC<WhereToBuyProps> = (props) => {
  return <WhereToBuy {...props} isMapHidden={false} />;
};

const WhereToBuyHideMap: React.FC<WhereToBuyProps> = (props) => {
  return <WhereToBuy {...props} isMapHidden={true} />;
};

// ============================================================================
// SERVER-SIDE DATA FETCHING - GraphQL Business Profiles Query
// ============================================================================
const transformBusinessProfileToLocationData = (
  profile: BusinessProfileGQLResponse['search']['results'][0]
): LocationData => {
  const services = profile.services?.jsonValue;
  let servicesArray: string[] = [];

  if (Array.isArray(services)) {
    servicesArray = services
      .map((service: ServiceItem) => {
        const serviceName = service?.displayName || service?.name;
        return serviceName;
      })
      .filter((name): name is string => Boolean(name));
  }

  return {
    name: profile.contentName?.value || '',
    address: profile.address?.value || '',
    phone: profile.phone?.value || '',
    email: profile.email?.value || '',
    hours: profile.hours?.value || '',
    website:
      profile.website?.jsonValue?.value?.href || profile.website?.jsonValue?.value?.url || '',
    lat: profile.lat?.value || 0,
    lng: profile.long?.value || 0,
    services: servicesArray,
  };
};

export const getComponentServerProps: GetComponentServerProps = async (rendering, layoutData) => {
  try {
    const graphQLClient = getGraphQlClient();
    const language = getLayoutLanguage(layoutData);
    const siteName = getSiteName(layoutData);
    const { contentRoot } = await fetchSiteRootInfo(siteName, language, graphQLClient);

    const data: BusinessProfileGQLResponse = await graphQLClient.request(
      GetBusinessProfiles.loc?.source.body || '',
      {
        pageID: contentRootIdNullChecker(contentRoot?.id), // Use dynamic content root ID as pageID
        language,
        templateId: BUSINESS_PROFILE_TEMPLATE_ID,
        first: 100,
      }
    );

    const locations: LocationData[] = data.search.results.map(
      transformBusinessProfileToLocationData
    );

    return {
      rendering: {
        ...rendering,
        data: locations,
      },
    };
  } catch (error) {
    console.error('Error fetching business profile data:', error);
    // Return empty array on error
    return {
      rendering: {
        ...rendering,
        data: [],
      },
    };
  }
};

export const Default = withDatasourceCheck()<WhereToBuyProps>(WhereToBuyDefault);
export const HideMap = withDatasourceCheck()<WhereToBuyProps>(WhereToBuyHideMap);
