import type { ShippingAddress, AddressValidation } from "@/lib/address";

type Props = {
  value: ShippingAddress;
  onChange: (next: ShippingAddress) => void;
  errors?: AddressValidation["errors"];
};

const LABELS: Array<ShippingAddress["label"]> = ["Home", "Office", "Other"];

export function AddressForm({ value, onChange, errors = {} }: Props) {
  const set = <K extends keyof ShippingAddress>(k: K, v: ShippingAddress[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {LABELS.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => set("label", l)}
            className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold border transition ${
              value.label === l
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={value.fullName} onChange={(v) => set("fullName", v)} required autoComplete="name" error={errors.fullName} />
        <Field label="Mobile number" value={value.phone} onChange={(v) => set("phone", v)} required type="tel" autoComplete="tel" error={errors.phone} />
        <Field label="Email (optional)" value={value.email ?? ""} onChange={(v) => set("email", v)} type="email" autoComplete="email" error={errors.email} className="sm:col-span-2" />
        <Field label="House / building no." value={value.house} onChange={(v) => set("house", v)} required autoComplete="address-line1" error={errors.house} />
        <Field label="Street" value={value.street} onChange={(v) => set("street", v)} required autoComplete="address-line2" error={errors.street} />
        <Field label="Area / district" value={value.area} onChange={(v) => set("area", v)} autoComplete="address-level3" />
        <Field label="City" value={value.city} onChange={(v) => set("city", v)} required autoComplete="address-level2" error={errors.city} />
        <Field label="State / province" value={value.state} onChange={(v) => set("state", v)} required autoComplete="address-level1" error={errors.state} />
        <Field label="Postal / ZIP code" value={value.postalCode} onChange={(v) => set("postalCode", v)} required autoComplete="postal-code" error={errors.postalCode} />
        <Field label="Country" value={value.country} onChange={(v) => set("country", v)} required autoComplete="country-name" error={errors.country} />
        <Field label="Landmark (optional)" value={value.landmark ?? ""} onChange={(v) => set("landmark", v)} className="sm:col-span-2" />
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, autoComplete, error, className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}{required && <span className="text-accent"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        maxLength={200}
        aria-invalid={error ? "true" : "false"}
        className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40 ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-destructive">{error}</span>}
    </label>
  );
}