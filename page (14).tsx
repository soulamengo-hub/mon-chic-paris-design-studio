import { NextResponse } from 'next/server';
import { getSupabaseConfig, supabaseRest } from '../../../lib/supabaseRest';

export const dynamic = 'force-dynamic';
const BUCKET = 'product-images';

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'photo.jpg';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    if (!productId) return NextResponse.json({ error: 'product_id fehlt.' }, { status: 400 });
    const images = await supabaseRest(`product_images?product_id=eq.${productId}&select=*&order=sort_order.asc,created_at.asc`);
    return NextResponse.json({ images: images || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Fotos konnten nicht geladen werden.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const productId = String(form.get('product_id') || '');
    const sortOrder = Number(form.get('sort_order') || 0);
    if (!(file instanceof File) || !productId) {
      return NextResponse.json({ error: 'Foto oder product_id fehlt.' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Nur Bilddateien sind erlaubt.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Foto ist größer als 8 MB.' }, { status: 400 });

    const { url, key } = getSupabaseConfig();
    const path = `${productId}/${Date.now()}-${safeName(file.name)}`;
    const upload = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': file.type, 'x-upsert': 'false' },
      body: await file.arrayBuffer(),
    });
    if (!upload.ok) throw new Error((await upload.text()) || 'Foto-Upload fehlgeschlagen.');

    const publicUrl = `${url}/storage/v1/object/public/${BUCKET}/${path}`;
    const rows = await supabaseRest('product_images', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, storage_path: path, public_url: publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size, sort_order: sortOrder }),
    });
    return NextResponse.json({ image: Array.isArray(rows) ? rows[0] : rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Foto konnte nicht gespeichert werden.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const images = Array.isArray(body.images) ? body.images : [];
    await Promise.all(images.map((item: any, index: number) => supabaseRest(`product_images?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ sort_order: index }) })));
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sortierung konnte nicht gespeichert werden.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID fehlt.' }, { status: 400 });
    const rows = await supabaseRest(`product_images?id=eq.${id}&select=*`);
    const image = Array.isArray(rows) ? rows[0] : null;
    if (image?.storage_path) {
      const { url, key } = getSupabaseConfig();
      await fetch(`${url}/storage/v1/object/${BUCKET}/${image.storage_path}`, { method: 'DELETE', headers: { apikey: key, Authorization: `Bearer ${key}` } });
    }
    await supabaseRest(`product_images?id=eq.${id}`, { method: 'DELETE' });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Foto konnte nicht gelöscht werden.' }, { status: 500 });
  }
}
