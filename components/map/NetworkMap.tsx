"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  MapRef,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Supercluster from "supercluster";
import type {
  MapSubscriber,
  NetworkSite,
  ServiceArea,
  TicketLocation,
} from "@/lib/mock-geodata";
import LayerPanel from "./LayerPanel";
import FilterPanel from "./FilterPanel";
import MapLegend from "./MapLegend";
import StatsBar from "./StatsBar";
import SubscriberPopup from "./SubscriberPopup";
import SitePopup from "./SitePopup";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Status colors
const STATUS_COLORS: Record<string, string> = {
  active: "#10B981",
  suspended: "#EF4444",
  pending: "#F59E0B",
  cancelled: "#6B7280",
};

// Site type icon colors
const SITE_COLORS: Record<string, string> = {
  central_office: "#06B6D4",
  fiber_hut: "#22D3EE",
  cabinet: "#67E8F9",
  splice_point: "#A5F3FC",
  pop: "#0891B2",
};

const SITE_SHAPES: Record<string, string> = {
  central_office: "square",
  fiber_hut: "circle",
  cabinet: "triangle",
  splice_point: "diamond",
  pop: "pentagon",
};

export interface MapFilters {
  statuses: Set<string>;
  accountTypes: Set<string>;
  plans: Set<string>;
  labels: Set<string>;
  hasIssuesOnly: boolean;
  search: string;
}

const DEFAULT_FILTERS: MapFilters = {
  statuses: new Set(["active", "suspended", "pending"]),
  accountTypes: new Set(["Residential", "Commercial"]),
  plans: new Set(["Fiber 100 Mbps", "Fiber 250 Mbps", "Fiber 500 Mbps", "Fiber 1 Gbps", "Fiber 2 Gbps"]),
  labels: new Set(),
  hasIssuesOnly: false,
  search: "",
};

interface MapData {
  subscribers: MapSubscriber[];
  sites: NetworkSite[];
  serviceAreas: ServiceArea[];
  ticketLocations: TicketLocation[];
}

export default function NetworkMap() {
  const mapRef = useRef<MapRef>(null);
  const [data, setData] = useState<MapData>({
    subscribers: [],
    sites: [],
    serviceAreas: [],
    ticketLocations: [],
  });
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({
    subscribers: true,
    infrastructure: true,
    serviceAreas: true,
    heatmap: false,
  });
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
  const [selectedSubscriber, setSelectedSubscriber] = useState<MapSubscriber | null>(null);
  const [selectedSite, setSelectedSite] = useState<NetworkSite | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 35.0456,
    longitude: -85.3097,
    zoom: 11,
  });
  const [mapBounds, setMapBounds] = useState<[number, number, number, number] | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/map/accounts").then((r) => r.json()),
      fetch("/api/map/sites").then((r) => r.json()),
      fetch("/api/map/tickets").then((r) => r.json()),
    ])
      .then(([accountsRes, sitesRes, ticketsRes]) => {
        setData({
          subscribers: accountsRes.data,
          sites: sitesRes.data,
          serviceAreas: ticketsRes.serviceAreas,
          ticketLocations: ticketsRes.tickets,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply filters to subscribers
  const filteredSubscribers = useMemo(() => {
    return data.subscribers.filter((s) => {
      if (!filters.statuses.has(s.status)) return false;
      if (!filters.accountTypes.has(s.accountType)) return false;
      if (filters.plans.size > 0 && !filters.plans.has(s.planName)) return false;
      if (filters.labels.size > 0 && !s.labels.some((l) => filters.labels.has(l))) return false;
      if (filters.hasIssuesOnly && s.overdueBalance === 0 && s.hasPaymentMethod) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q) &&
          !s.address.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data.subscribers, filters]);

  // Supercluster for marker clustering
  const supercluster = useMemo(() => {
    const index = new Supercluster({
      radius: 60,
      maxZoom: 14,
    });
    const points = filteredSubscribers.map((s) => ({
      type: "Feature" as const,
      properties: { ...s, cluster: false },
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] },
    }));
    index.load(points as any);
    return index;
  }, [filteredSubscribers]);

  const clusters = useMemo(() => {
    if (!mapBounds) return [];
    try {
      return supercluster.getClusters(mapBounds, Math.floor(viewState.zoom));
    } catch {
      return [];
    }
  }, [supercluster, mapBounds, viewState.zoom]);

  // Track visible counts for stats bar
  const visibleCounts = useMemo(() => {
    if (!mapBounds) return { active: 0, suspended: 0, pending: 0, cancelled: 0, sites: 0, tickets: 0 };
    const [west, south, east, north] = mapBounds;
    const inBounds = (lat: number, lng: number) =>
      lat >= south && lat <= north && lng >= west && lng <= east;

    const visibleSubs = filteredSubscribers.filter((s) => inBounds(s.lat, s.lng));
    const visibleSites = data.sites.filter((s) => inBounds(s.lat, s.lng));
    const visibleTickets = data.ticketLocations.filter((t) => inBounds(t.lat, t.lng));

    return {
      active: visibleSubs.filter((s) => s.status === "active").length,
      suspended: visibleSubs.filter((s) => s.status === "suspended").length,
      pending: visibleSubs.filter((s) => s.status === "pending").length,
      cancelled: visibleSubs.filter((s) => s.status === "cancelled").length,
      sites: visibleSites.length,
      tickets: visibleTickets.length,
    };
  }, [filteredSubscribers, data.sites, data.ticketLocations, mapBounds]);

  const handleMoveEnd = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setMapBounds([
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ]);
      }
    }
  }, []);

  const handleSearchFlyTo = useCallback(
    (subscriber: MapSubscriber) => {
      mapRef.current?.flyTo({
        center: [subscriber.lng, subscriber.lat],
        zoom: 16,
        duration: 1500,
      });
      setSelectedSubscriber(subscriber);
    },
    [],
  );

  // Heatmap GeoJSON source
  const heatmapData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: data.ticketLocations.map((t) => ({
        type: "Feature" as const,
        properties: { intensity: t.priority === "critical" ? 3 : t.priority === "high" ? 2 : 1 },
        geometry: { type: "Point" as const, coordinates: [t.lng, t.lat] },
      })),
    }),
    [data.ticketLocations],
  );

  // Service area GeoJSON
  const serviceAreaData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: data.serviceAreas.map((area) => ({
        type: "Feature" as const,
        properties: { name: area.name, color: area.color },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [...area.coordinates.map(([lat, lng]) => [lng, lat]), [area.coordinates[0][1], area.coordinates[0][0]]],
          ],
        },
      })),
    }),
    [data.serviceAreas],
  );

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 48px)" }}>
      {/* Stats Bar */}
      <StatsBar
        counts={visibleCounts}
        totalFiltered={filteredSubscribers.length}
        totalAll={data.subscribers.length}
      />

      <div className="relative w-full" style={{ height: "calc(100% - 36px)" }}>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onMoveEnd={handleMoveEnd}
          onLoad={handleMoveEnd}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
          onClick={() => {
            setSelectedSubscriber(null);
            setSelectedSite(null);
          }}
        >
          <NavigationControl position="bottom-right" />
          <FullscreenControl position="bottom-right" />

          {/* Service Area Polygons */}
          {layers.serviceAreas && (
            <Source id="service-areas" type="geojson" data={serviceAreaData as any}>
              <Layer
                id="service-area-fill"
                type="fill"
                paint={{
                  "fill-color": ["get", "color"],
                  "fill-opacity": 0.08,
                }}
              />
              <Layer
                id="service-area-line"
                type="line"
                paint={{
                  "line-color": ["get", "color"],
                  "line-width": 2,
                  "line-opacity": 0.4,
                  "line-dasharray": [2, 2],
                }}
              />
            </Source>
          )}

          {/* Heatmap Layer */}
          {layers.heatmap && (
            <Source id="ticket-heat" type="geojson" data={heatmapData as any}>
              <Layer
                id="ticket-heatmap"
                type="heatmap"
                paint={{
                  "heatmap-weight": ["get", "intensity"],
                  "heatmap-intensity": 1.5,
                  "heatmap-radius": 40,
                  "heatmap-opacity": 0.7,
                  "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0, "rgba(0,0,0,0)",
                    0.2, "rgba(254,178,76,0.4)",
                    0.4, "rgba(253,141,60,0.6)",
                    0.6, "rgba(252,78,42,0.7)",
                    0.8, "rgba(227,26,28,0.8)",
                    1, "rgba(189,0,38,0.9)",
                  ],
                }}
              />
            </Source>
          )}

          {/* Subscriber Clusters & Markers */}
          {layers.subscribers &&
            clusters.map((cluster) => {
              const [lng, lat] = cluster.geometry.coordinates;
              const props = cluster.properties as any;

              if (props.cluster) {
                const size = props.point_count < 20 ? 32 : props.point_count < 50 ? 40 : 48;
                return (
                  <Marker
                    key={`cluster-${props.cluster_id}`}
                    latitude={lat}
                    longitude={lng}
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      const zoom = supercluster.getClusterExpansionZoom(props.cluster_id);
                      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 500 });
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full bg-emerald-500/80 border-2 border-emerald-400 text-white font-mono text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                      style={{ width: size, height: size }}
                    >
                      {props.point_count}
                    </div>
                  </Marker>
                );
              }

              const sub = props as MapSubscriber;
              return (
                <Marker
                  key={sub.id}
                  latitude={lat}
                  longitude={lng}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedSite(null);
                    setSelectedSubscriber(sub);
                  }}
                >
                  <div
                    className="h-3 w-3 rounded-full border border-white/30 cursor-pointer hover:scale-150 transition-transform"
                    style={{ backgroundColor: STATUS_COLORS[sub.status] }}
                    title={sub.name}
                  />
                </Marker>
              );
            })}

          {/* Infrastructure Markers */}
          {layers.infrastructure &&
            data.sites.map((site) => (
              <Marker
                key={site.id}
                latitude={site.lat}
                longitude={site.lng}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedSubscriber(null);
                  setSelectedSite(site);
                }}
              >
                <SiteIcon type={site.type} />
              </Marker>
            ))}

          {/* Subscriber Popup */}
          {selectedSubscriber && (
            <Popup
              latitude={selectedSubscriber.lat}
              longitude={selectedSubscriber.lng}
              onClose={() => setSelectedSubscriber(null)}
              closeOnClick={false}
              anchor="bottom"
              offset={12}
              className="map-popup"
            >
              <SubscriberPopup subscriber={selectedSubscriber} />
            </Popup>
          )}

          {/* Site Popup */}
          {selectedSite && (
            <Popup
              latitude={selectedSite.lat}
              longitude={selectedSite.lng}
              onClose={() => setSelectedSite(null)}
              closeOnClick={false}
              anchor="bottom"
              offset={12}
              className="map-popup"
            >
              <SitePopup site={selectedSite} />
            </Popup>
          )}
        </Map>

        {/* Layer Panel (left) */}
        <LayerPanel layers={layers} onToggle={(key) => setLayers((l) => ({ ...l, [key]: !l[key as keyof typeof l] }))} />

        {/* Filter Panel (right) */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          subscribers={data.subscribers}
          onSearchSelect={handleSearchFlyTo}
        />

        {/* Legend */}
        <MapLegend />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
              <p className="text-sm text-zinc-400">Loading network data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Site icon component
function SiteIcon({ type }: { type: NetworkSite["type"] }) {
  const color = SITE_COLORS[type];
  const shape = SITE_SHAPES[type];
  const size = type === "central_office" ? 20 : type === "pop" ? 18 : 14;

  if (shape === "square") {
    return (
      <div
        className="border-2 cursor-pointer hover:scale-125 transition-transform"
        style={{
          width: size,
          height: size,
          backgroundColor: color + "CC",
          borderColor: color,
        }}
        title={type.replace(/_/g, " ")}
      />
    );
  }

  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="cursor-pointer hover:scale-125 transition-transform">
        <polygon points="10,2 18,18 2,18" fill={color + "CC"} stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (shape === "diamond") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="cursor-pointer hover:scale-125 transition-transform">
        <polygon points="10,1 19,10 10,19 1,10" fill={color + "CC"} stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (shape === "pentagon") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" className="cursor-pointer hover:scale-125 transition-transform">
        <polygon points="10,1 19,8 16,18 4,18 1,8" fill={color + "CC"} stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  // Default circle (fiber_hut)
  return (
    <div
      className="rounded-full border-2 cursor-pointer hover:scale-125 transition-transform"
      style={{
        width: size,
        height: size,
        backgroundColor: color + "CC",
        borderColor: color,
      }}
      title={type.replace(/_/g, " ")}
    />
  );
}
