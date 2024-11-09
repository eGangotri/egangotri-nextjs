import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    // Validate the body
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Ensure all required fields are present
    const { name, location, owner } = body
    if (!name || !location || !owner) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        location,
        owner,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    await prisma.item.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}