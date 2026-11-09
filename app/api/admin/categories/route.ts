// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import slugify from 'slugify';

// GET all categories for Admin
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error fetching admin categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create a new category
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, image, isActive, order } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    await connectDB();

    let slug = body.slug?.trim();
    if (!slug) {
      slug = slugify(name, { lower: true, strict: true });
    }

    // Check if slug already exists
    let existing = await Category.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      image: image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: order ? Number(order) : 0,
    });

    return NextResponse.json(
      { message: 'Category created successfully', category: newCategory },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

// DELETE a category by query param ?id=... or json body
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await connectDB();
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}

// PATCH update category
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'superadmin'].includes(session.user.role ?? '')) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, slug, description, image, isActive, order } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await connectDB();
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined) updateData.slug = slug.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (order !== undefined) updateData.order = Number(order);

    const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category updated successfully', category: updated });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}
