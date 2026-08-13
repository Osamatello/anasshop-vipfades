import { NextResponse } from 'next/server';

import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
    try {
        const [barbersResult, servicesResult] = await Promise.all([
            supabaseServer
                .from('barbers')
                .select('id, name, slug, image_url, is_active')
                .eq('is_active', true)
                .order('name', { ascending: true }),

            supabaseServer
                .from('services')
                .select(
                    'id, name, slug, price, duration_minutes, description, is_active',
                )
                .eq('is_active', true)
                .order('price', { ascending: true }),
        ]);

        if (barbersResult.error) {
            throw barbersResult.error;
        }

        if (servicesResult.error) {
            throw servicesResult.error;
        }

        return NextResponse.json({
            success: true,
            barbers: barbersResult.data,
            services: servicesResult.data,
        });
    } catch (error) {
        console.error('Catalog API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Buchungsdaten konnten nicht geladen werden.',
            },
            {
                status: 500,
            },
        );
    }
}