import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  metadata: any;
}

interface Course {
  id: string;
  slug: string;
  title: string;
}

export default function AcademyProductMapping() {
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [productsRes, coursesRes] = await Promise.all([
      supabase
        .from('marketplace_products')
        .select('*')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('course_products')
        .select('id, slug, title')
        .order('title'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (coursesRes.data) setCourses(coursesRes.data);

    setLoading(false);
  }

  async function updateProductMapping(product: Product, courseSlug: string, kind: string) {
    setSaving(product.id);

    try {
      const { error } = await supabase
        .from('marketplace_products')
        .update({
          metadata: {
            ...(product.metadata || {}),
            kind: kind,
            course_slug: courseSlug || null,
          }
        })
        .eq('id', product.id);

      if (error) throw error;

      await loadData();
      alert('Product mapping saved successfully!');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(null);
    }
  }

  function getProductKind(product: Product) {
    return product.metadata?.kind || 'standard';
  }

  function getCourseSlug(product: Product) {
    return product.metadata?.course_slug || '';
  }

  function hasMapping(product: Product) {
    const kind = getProductKind(product);
    return (kind === 'academy_core' || kind === 'academy_track') && getCourseSlug(product);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Academy Product Mapping</h1>
          <p className="text-gray-600 mt-1">
            Map marketplace products to academy courses for automatic enrollment
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Set product kind to "academy_core" for core academy access</li>
            <li>• Set product kind to "academy_track" for industry track purchases</li>
            <li>• Map course slug to automatically enroll buyers</li>
            <li>• Webhook handles enrollment when payment completes</li>
          </ul>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <ProductMappingCard
              key={product.id}
              product={product}
              courses={courses}
              hasMapping={hasMapping(product)}
              isSaving={saving === product.id}
              onSave={updateProductMapping}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ProductMappingCardProps {
  product: Product;
  courses: Course[];
  hasMapping: boolean;
  isSaving: boolean;
  onSave: (product: Product, courseSlug: string, kind: string) => void;
}

function ProductMappingCard({ product, courses, hasMapping, isSaving, onSave }: ProductMappingCardProps) {
  const [kind, setKind] = useState(product.metadata?.kind || 'standard');
  const [courseSlug, setCourseSlug] = useState(product.metadata?.course_slug || '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            {hasMapping && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                <CheckCircle className="w-4 h-4" />
                Mapped
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{product.slug}</p>
          {product.description && (
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Kind
          </label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="standard">Standard (No Academy)</option>
            <option value="academy_core">Academy Core Access</option>
            <option value="academy_track">Academy Industry Track</option>
            <option value="academy_white_label">Academy White Label</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Slug
          </label>
          <select
            value={courseSlug}
            onChange={(e) => setCourseSlug(e.target.value)}
            disabled={kind === 'standard'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">-- Select Course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.slug}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {kind !== 'standard' && !courseSlug && (
        <div className="flex items-center gap-2 text-yellow-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>Course slug is required for academy products</span>
        </div>
      )}

      <button
        onClick={() => onSave(product, courseSlug, kind)}
        disabled={isSaving || (kind !== 'standard' && !courseSlug)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : 'Save Mapping'}
      </button>
    </div>
  );
}
