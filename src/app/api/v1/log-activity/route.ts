import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Check Authorization Header
    const authHeader = req.headers.get('authorization');
    const apiKeyHeader = req.headers.get('x-api-key');
    const secretKey = process.env.SECRET_API_KEY;

    if (
      (!authHeader || authHeader !== `Bearer ${secretKey}`) &&
      (!apiKeyHeader || apiKeyHeader !== secretKey)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Body
    const body = await req.json();
    const { device_id, app_name, event_type, latitude, longitude, timestamp } = body;

    // 3. Basic Validation
    if (!device_id || !app_name || !event_type || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 4. Save to Database
    const log = await prisma.deviceLog.create({
      data: {
        device_id,
        app_name,
        event_type,
        latitude: parseFloat(latitude.toString()),
        longitude: parseFloat(longitude.toString()),
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
