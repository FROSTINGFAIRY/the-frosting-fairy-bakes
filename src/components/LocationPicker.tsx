/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, LocateFixed, Search } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { reverseGeocode, forwardGeocode, type ParsedAddress } from "@/lib/geocode.functions";

type Props = {
  latitude?: number;
  longitude?: number;
  onPick: (result: ParsedAddress & { accuracy?: number }) => void;
};

declare global {
  interface Window {
    __ffMapsInit?: () => void;
    google?: typeof google;
  }
}

let mapsLoader: Promise<void> | null = null;

function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.google?.maps) return Promise.resolve();
  if (mapsLoader) return mapsLoader;
  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
  if (!key) return Promise.reject(new Error("Google Maps browser key missing"));
  mapsLoader = new Promise((resolve, reject) => {
    window.__ffMapsInit = () => resolve();
    const s = document.createElement("script");
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__ffMapsInit${channel ? `&channel=${channel}` : ""}`;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return mapsLoader;
}

export function LocationPicker({ latitude, longitude, onPick }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [query, setQuery] = useState("");
  const reverse = useServerFn(reverseGeocode);
  const forward = useServerFn(forwardGeocode);

  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !mapRef.current) return;
        const start = { lat: latitude ?? 20.5937, lng: longitude ?? 78.9629 };
        const zoom = latitude && longitude ? 16 : 5;
        const map = new window.google!.maps.Map(mapRef.current, {
          center: start,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        const m = new window.google!.maps.Marker({
          position: start,
          map,
          draggable: true,
          title: "Drag to fine-tune your location",
        });
        m.addListener("dragend", () => {
          const pos = m.getPosition();
          if (!pos) return;
          void handleReverse(pos.lat(), pos.lng());
        });
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          m.setPosition(e.latLng);
          void handleReverse(e.latLng.lat(), e.latLng.lng());
        });
        mapObj.current = map;
        marker.current = m;
        setReady(true);
      })
      .catch((e) => {
        console.error(e);
        toast.error("Couldn't load the map. You can still enter your address manually.");
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If parent gives us fresh coordinates (e.g. from geolocation), recenter.
  useEffect(() => {
    if (!mapObj.current || !marker.current) return;
    if (typeof latitude !== "number" || typeof longitude !== "number") return;
    const pos = new window.google!.maps.LatLng(latitude, longitude);
    marker.current.setPosition(pos);
    mapObj.current.setCenter(pos);
    if ((mapObj.current.getZoom() ?? 0) < 14) mapObj.current.setZoom(16);
  }, [latitude, longitude]);

  async function handleReverse(lat: number, lng: number, acc?: number) {
    setBusy(true);
    setAccuracy(acc);
    try {
      const parsed = await reverse({ data: { latitude: lat, longitude: lng } });
      onPick({ ...parsed, latitude: lat, longitude: lng, accuracy: acc });
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Reverse geocoding failed");
      onPick({ formatted: "", house: "", street: "", area: "", city: "", state: "", postalCode: "", country: "", latitude: lat, longitude: lng, accuracy: acc });
    } finally {
      setBusy(false);
    }
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported on this device");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void handleReverse(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
      },
      (err) => {
        setBusy(false);
        toast.error(err.message || "Couldn't get your location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }

  async function searchAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    try {
      const parsed = await forward({ data: { query } });
      if (typeof parsed.latitude === "number" && typeof parsed.longitude === "number") {
        onPick({ ...parsed, accuracy: undefined });
      } else {
        toast.error("Couldn't locate that address on the map");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-2.5 text-[11px] uppercase tracking-widest font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
          Use my current location
        </button>
        <form onSubmit={searchAddress} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search an address…"
              className="w-full rounded-full border border-border bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !query.trim()}
            className="rounded-full border border-foreground px-4 text-[11px] uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition disabled:opacity-50"
          >
            Find
          </button>
        </form>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div ref={mapRef} className="h-[280px] w-full bg-muted" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/60 text-xs text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading map…
          </div>
        )}
      </div>

      <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          Drag the pin or tap on the map to fine-tune your delivery location.
          {typeof accuracy === "number" && (
            <> Location accuracy: <span className="font-mono">±{Math.round(accuracy)}m</span>.</>
          )}
        </span>
      </p>
    </div>
  );
}