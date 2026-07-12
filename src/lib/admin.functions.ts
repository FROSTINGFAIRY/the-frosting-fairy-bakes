import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

async function assertAdmin(context: { supabase: Awaited<ReturnType<typeof getCtx>>["supabase"]; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

// Helper type only, never invoked
async function getCtx() {
  return {} as { supabase: any; userId: string };
}

const UpdateInput = z.object({
  id: z.string().uuid(),
  patch: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    long_description: z.string().nullable().optional(),
    price: z.string().min(1).optional(),
    price_value: z.number().min(0).optional(),
    image_url: z.string().nullable().optional(),
    serving_size: z.string().nullable().optional(),
    available: z.boolean().optional(),
  }),
});

export const updateMenuItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UpdateInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("menu_items")
      .update({ ...data.patch, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const UploadInput = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  base64: z.string().min(10),
  contentType: z.string().default("image/png"),
});

/**
 * Uploads a base64 PNG to storage and stores a long-lived signed URL on the menu item.
 */
export const uploadMenuItemImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UploadInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const ext = data.contentType === "image/jpeg" ? "jpg" : "png";
    const path = `${data.slug}-${Date.now()}.${ext}`;
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const { error: upErr } = await context.supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);
    const { data: signed, error: signErr } = await context.supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL);
    if (signErr || !signed) throw new Error(signErr?.message ?? "Failed to sign URL");
    const { error: updErr } = await context.supabase
      .from("menu_items")
      .update({ image_url: signed.signedUrl, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);
    return { image_url: signed.signedUrl };
  });

const GenInput = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  category: z.string().default(""),
});

export const generateMenuItemImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `Professional bakery product photo of "${data.name}" — ${data.description}. Category: ${data.category}. Top-down, shallow depth of field, soft warm natural lighting, styled on a soft blush pink background. Clean, minimal, appetising editorial food photography, no text, no watermarks.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Image generation failed (${res.status}): ${txt.slice(0, 300)}`);
    }
    const payload = (await res.json()) as { data?: Array<{ b64_json?: string }> };
    const b64 = payload.data?.[0]?.b64_json;
    if (!b64) throw new Error("Image generation returned no data");

    const path = `${data.slug}-${Date.now()}.png`;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const { error: upErr } = await context.supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) throw new Error(upErr.message);
    const { data: signed, error: signErr } = await context.supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, SIGNED_URL_TTL);
    if (signErr || !signed) throw new Error(signErr?.message ?? "Failed to sign URL");
    const { error: updErr } = await context.supabase
      .from("menu_items")
      .update({ image_url: signed.signedUrl, updated_at: new Date().toISOString() })
      .eq("id", data.id);
    if (updErr) throw new Error(updErr.message);
    return { image_url: signed.signedUrl };
  });