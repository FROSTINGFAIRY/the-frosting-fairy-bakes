import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

type Component = { long_name: string; short_name: string; types: string[] };
type GeoResult = {
  formatted_address: string;
  address_components: Component[];
  geometry?: { location?: { lat: number; lng: number } };
};

export type ParsedAddress = {
  formatted: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
};

function pick(components: Component[], types: string[]): string {
  for (const t of types) {
    const hit = components.find((c) => c.types.includes(t));
    if (hit) return hit.long_name;
  }
  return "";
}

function parseResult(r: GeoResult): ParsedAddress {
  const c = r.address_components ?? [];
  return {
    formatted: r.formatted_address ?? "",
    house: pick(c, ["street_number", "premise", "subpremise"]),
    street: pick(c, ["route"]),
    area: pick(c, ["sublocality_level_1", "sublocality", "neighborhood"]),
    city: pick(c, ["locality", "postal_town", "administrative_area_level_2"]),
    state: pick(c, ["administrative_area_level_1"]),
    postalCode: pick(c, ["postal_code"]),
    country: pick(c, ["country"]),
    latitude: r.geometry?.location?.lat,
    longitude: r.geometry?.location?.lng,
  };
}

async function callGateway(path: string): Promise<{ status: string; results?: GeoResult[]; error_message?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!lovableKey || !mapsKey) throw new Error("Google Maps connector is not configured");
  const res = await fetch(`${GATEWAY}${path}`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": mapsKey,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Geocoding failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}

export const reverseGeocode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const url = `/maps/api/geocode/json?latlng=${data.latitude},${data.longitude}`;
    const json = await callGateway(url);
    if (json.status !== "OK" || !json.results?.length) {
      throw new Error(json.error_message || `No address found (${json.status})`);
    }
    return parseResult(json.results[0]);
  });

export const forwardGeocode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ query: z.string().trim().min(3).max(200) }).parse(input),
  )
  .handler(async ({ data }) => {
    const url = `/maps/api/geocode/json?address=${encodeURIComponent(data.query)}`;
    const json = await callGateway(url);
    if (json.status !== "OK" || !json.results?.length) {
      throw new Error(json.error_message || `No matches (${json.status})`);
    }
    return parseResult(json.results[0]);
  });