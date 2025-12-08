import { Metadata } from 'next';
import { getResourceById } from '@/lib/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    return {
      title: 'Resource Not Found',
    };
  }

  return {
    title: `${resource.name} | Aegis-OSINT`,
    description: resource.description,
  };
}
