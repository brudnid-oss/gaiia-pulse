// Mock geodata centered around Chattanooga, TN — a real fiber ISP city
// Coordinates: ~35.0456° N, 85.3097° W

import { mockAccounts, mockTickets } from "./mock-data";

// ── Seeded RNG for geodata (separate seed from mock-data) ───────────────────

let _geoSeed = 7919;
function geoRandom(): number {
  _geoSeed = (_geoSeed * 16807 + 0) % 2147483647;
  return (_geoSeed - 1) / 2147483646;
}

function geoGaussian(): number {
  // Box-Muller for more natural clustering
  const u1 = geoRandom();
  const u2 = geoRandom();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function geoPick<T>(arr: T[]): T {
  return arr[Math.floor(geoRandom() * arr.length)];
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface MapSubscriber {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  status: "active" | "suspended" | "pending" | "cancelled";
  accountType: "Residential" | "Commercial";
  planName: string;
  labels: string[];
  hasPaymentMethod: boolean;
  overdueBalance: number;
}

export interface NetworkSite {
  id: string;
  name: string;
  type: "central_office" | "fiber_hut" | "cabinet" | "splice_point" | "pop";
  lat: number;
  lng: number;
  address: string;
  equipmentCount: number;
}

export interface ServiceArea {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
}

export interface TicketLocation {
  id: string;
  subject: string;
  priority: string;
  lat: number;
  lng: number;
  accountName: string;
}

// ── Center point & neighborhoods ─────────────────────────────────────────────

const CENTER_LAT = 35.0456;
const CENTER_LNG = -85.3097;

// Neighborhoods as cluster centers
const neighborhoods = [
  { name: "Downtown", lat: 35.0456, lng: -85.3097, spread: 0.008 },
  { name: "North Shore", lat: 35.0620, lng: -85.3140, spread: 0.010 },
  { name: "Southside", lat: 35.0310, lng: -85.3020, spread: 0.012 },
  { name: "East Brainerd", lat: 35.0180, lng: -85.2350, spread: 0.015 },
  { name: "Hixson", lat: 35.1050, lng: -85.2400, spread: 0.018 },
  { name: "Red Bank", lat: 35.1120, lng: -85.2950, spread: 0.010 },
  { name: "Signal Mountain", lat: 35.1350, lng: -85.3500, spread: 0.012 },
  { name: "St. Elmo", lat: 35.0080, lng: -85.3380, spread: 0.008 },
  { name: "Ooltewah", lat: 35.0770, lng: -85.0680, spread: 0.015 },
  { name: "Collegedale", lat: 35.0520, lng: -85.0500, spread: 0.010 },
];

// ── Generate Subscribers ─────────────────────────────────────────────────────

function generateMapSubscribers(): MapSubscriber[] {
  const subscribers: MapSubscriber[] = [];
  // Use a proportional subset of accounts for the map (~200 representative points)
  const sampleSize = 200;
  const plans = ["Fiber 100 Mbps", "Fiber 250 Mbps", "Fiber 500 Mbps", "Fiber 1 Gbps", "Fiber 2 Gbps"];
  const labelOptions = ["Residential", "Business", "MDU", "VIP", "New Customer"];
  const streets = [
    "Oak St", "Maple Ave", "Cedar Ln", "Pine Dr", "Elm Blvd",
    "Main St", "Broad St", "Market St", "Frazier Ave", "McCallie Ave",
    "Brainerd Rd", "Hixson Pike", "Signal Mountain Rd", "Rossville Blvd",
    "E 3rd St", "Riverside Dr", "Cherokee Blvd", "Dayton Blvd",
  ];

  // Status distribution proportional to dashboard: 84% active, 6% suspended, 4% pending, 6% cancelled
  const statusDist: MapSubscriber["status"][] = [];
  for (let i = 0; i < sampleSize; i++) {
    const r = geoRandom();
    if (r < 0.84) statusDist.push("active");
    else if (r < 0.90) statusDist.push("suspended");
    else if (r < 0.94) statusDist.push("pending");
    else statusDist.push("cancelled");
  }

  for (let i = 0; i < sampleSize; i++) {
    const hood = geoPick(neighborhoods);
    const lat = hood.lat + geoGaussian() * hood.spread;
    const lng = hood.lng + geoGaussian() * hood.spread;
    const status = statusDist[i];
    const account = mockAccounts[i % mockAccounts.length];
    const isCommercial = geoRandom() > 0.85;
    const streetNum = Math.floor(geoRandom() * 9000 + 100);

    subscribers.push({
      id: account.id,
      name: account.name,
      lat,
      lng,
      address: `${streetNum} ${geoPick(streets)}, Chattanooga, TN`,
      status,
      accountType: isCommercial ? "Commercial" : "Residential",
      planName: geoPick(plans),
      labels: geoRandom() > 0.6 ? [geoPick(labelOptions)] : [],
      hasPaymentMethod: status === "active" ? geoRandom() > 0.02 : geoRandom() > 0.3,
      overdueBalance: status === "suspended" ? Math.round(geoRandom() * 300 + 50) :
                      status === "active" && geoRandom() > 0.85 ? Math.round(geoRandom() * 200) : 0,
    });
  }
  return subscribers;
}

export const mockMapSubscribers: MapSubscriber[] = generateMapSubscribers();

// ── Generate Network Sites ───────────────────────────────────────────────────

export const mockNetworkSites: NetworkSite[] = [
  {
    id: "SITE-001",
    name: "Chattanooga Central Office",
    type: "central_office",
    lat: 35.0460,
    lng: -85.3090,
    address: "200 Broad St, Chattanooga, TN",
    equipmentCount: 48,
  },
  {
    id: "SITE-002",
    name: "North Shore POP",
    type: "pop",
    lat: 35.0630,
    lng: -85.3160,
    address: "1 Cherokee Blvd, Chattanooga, TN",
    equipmentCount: 12,
  },
  {
    id: "SITE-003",
    name: "East Brainerd Fiber Hut",
    type: "fiber_hut",
    lat: 35.0175,
    lng: -85.2340,
    address: "7800 E Brainerd Rd, Chattanooga, TN",
    equipmentCount: 24,
  },
  {
    id: "SITE-004",
    name: "Hixson Cabinet A",
    type: "cabinet",
    lat: 35.1045,
    lng: -85.2420,
    address: "5200 Hixson Pike, Hixson, TN",
    equipmentCount: 8,
  },
  {
    id: "SITE-005",
    name: "Red Bank Fiber Hut",
    type: "fiber_hut",
    lat: 35.1125,
    lng: -85.2940,
    address: "3600 Dayton Blvd, Red Bank, TN",
    equipmentCount: 16,
  },
  {
    id: "SITE-006",
    name: "Signal Mountain Cabinet",
    type: "cabinet",
    lat: 35.1340,
    lng: -85.3480,
    address: "800 Signal Mountain Rd, Signal Mountain, TN",
    equipmentCount: 6,
  },
  {
    id: "SITE-007",
    name: "Southside Splice Point",
    type: "splice_point",
    lat: 35.0300,
    lng: -85.3010,
    address: "1400 Cowart St, Chattanooga, TN",
    equipmentCount: 4,
  },
  {
    id: "SITE-008",
    name: "I-75 POP",
    type: "pop",
    lat: 35.0520,
    lng: -85.1900,
    address: "100 Interstate Pkwy, Chattanooga, TN",
    equipmentCount: 20,
  },
  {
    id: "SITE-009",
    name: "St. Elmo Fiber Hut",
    type: "fiber_hut",
    lat: 35.0085,
    lng: -85.3375,
    address: "4200 St. Elmo Ave, Chattanooga, TN",
    equipmentCount: 18,
  },
  {
    id: "SITE-010",
    name: "Ooltewah Cabinet",
    type: "cabinet",
    lat: 35.0760,
    lng: -85.0690,
    address: "9100 Lee Hwy, Ooltewah, TN",
    equipmentCount: 10,
  },
];

// ── Service Area Polygons ────────────────────────────────────────────────────

export const mockServiceAreas: ServiceArea[] = [
  {
    id: "ZONE-001",
    name: "Downtown & North Shore",
    color: "#10B981",
    coordinates: [
      [35.070, -85.330],
      [35.070, -85.290],
      [35.025, -85.290],
      [35.025, -85.330],
    ],
  },
  {
    id: "ZONE-002",
    name: "East Corridor",
    color: "#6366F1",
    coordinates: [
      [35.040, -85.260],
      [35.040, -85.180],
      [35.000, -85.180],
      [35.000, -85.260],
    ],
  },
  {
    id: "ZONE-003",
    name: "Hixson & Red Bank",
    color: "#F59E0B",
    coordinates: [
      [35.125, -85.310],
      [35.125, -85.225],
      [35.090, -85.225],
      [35.090, -85.310],
    ],
  },
  {
    id: "ZONE-004",
    name: "Signal Mountain",
    color: "#8B5CF6",
    coordinates: [
      [35.150, -85.370],
      [35.150, -85.330],
      [35.120, -85.330],
      [35.120, -85.370],
    ],
  },
];

// ── Ticket Locations (open tickets mapped to subscriber locations) ────────────

function generateTicketLocations(): TicketLocation[] {
  const openTickets = mockTickets.filter((t) => t.status === "open" || t.status === "in_progress").slice(0, 15);
  return openTickets.map((ticket, i) => {
    // Map tickets to subscriber locations, with some jitter
    const sub = mockMapSubscribers[i % mockMapSubscribers.length];
    return {
      id: ticket.id,
      subject: ticket.subject,
      priority: ticket.priority,
      lat: sub.lat + (geoRandom() - 0.5) * 0.002,
      lng: sub.lng + (geoRandom() - 0.5) * 0.002,
      accountName: ticket.account_name,
    };
  });
}

export const mockTicketLocations: TicketLocation[] = generateTicketLocations();
