import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const location = searchParams.get('location');

    const resources = await prisma.resource.findMany({
      where: {
        status: 'ACTIVE',
        ...(type && { type: { contains: type } }),
        ...(location && { location: { contains: location } }),
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceId, name,type, location, resourceLink, subscription, resourceGroup, metadata } =
      body;

    if (!name || !type || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        resourceId,
        name,
        type,
        location,
        resourceLink,
        subscription,
        resourceGroup,
        metadata,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
