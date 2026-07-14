export type ShippingAddress = {
  label?: "Home" | "Office" | "Other";
  fullName: string;
  phone: string;
  email?: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  formatted?: string;
};

export function emptyAddress(): ShippingAddress {
  return {
    label: "Home",
    fullName: "",
    phone: "",
    email: "",
    house: "",
    street: "",
    area: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
  };
}

export type AddressValidation = { ok: boolean; errors: Partial<Record<keyof ShippingAddress, string>> };

export function validateAddress(a: ShippingAddress): AddressValidation {
  const errors: AddressValidation["errors"] = {};
  const req = (k: keyof ShippingAddress, label: string) => {
    const v = (a[k] as string | undefined)?.toString().trim();
    if (!v) errors[k] = `${label} is required`;
  };
  req("fullName", "Full name");
  req("phone", "Mobile number");
  req("house", "House / building number");
  req("street", "Street name");
  req("city", "City");
  req("state", "State");
  req("postalCode", "Postal code");
  req("country", "Country");
  if (a.phone && !/^[+\d][\d\s\-()]{6,}$/.test(a.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }
  if (a.email && a.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (a.postalCode && !/^[A-Za-z0-9\s\-]{3,12}$/.test(a.postalCode.trim())) {
    errors.postalCode = "Enter a valid postal code";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function formatAddress(a: ShippingAddress): string {
  return [a.house, a.street, a.area, a.city, a.state, a.postalCode, a.country]
    .map((s) => (s ?? "").toString().trim())
    .filter(Boolean)
    .join(", ");
}

const KEY = "frosting-fairy-addresses-v1";
const DEFAULT_KEY = "frosting-fairy-default-address-v1";

export type SavedAddress = ShippingAddress & { id: string };

export function listSavedAddresses(): SavedAddress[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function saveAddress(a: ShippingAddress): SavedAddress {
  const id = `addr_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const saved: SavedAddress = { ...a, id };
  const all = listSavedAddresses();
  all.unshift(saved);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 10)));
  if (all.length === 1) setDefaultAddressId(id);
  return saved;
}

export function deleteSavedAddress(id: string) {
  const all = listSavedAddresses().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  if (getDefaultAddressId() === id) localStorage.removeItem(DEFAULT_KEY);
}

export function getDefaultAddressId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DEFAULT_KEY);
}

export function setDefaultAddressId(id: string) {
  localStorage.setItem(DEFAULT_KEY, id);
}