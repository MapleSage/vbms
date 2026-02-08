'use client';

import { useEffect, useState } from 'react';
import { Cloud, Database, AlertCircle, Loader } from 'lucide-react';

interface Resource {
  id: string;
  resourceId?: string;
  name: string;
  type: string;
  location: string;
  resourceLink?: string;
  subscription?: string;
  resourceGroup?: string;
  status: string;
}

const resourceTypeIcons: { [key: string]: React.ReactNode } = {
  'App Service': <Cloud className="w-4 h-4" />,
  'SQL Database': <Database className="w-4 h-4" />,
  'Container Registry': <Cloud className="w-4 h-4" />,
  'App Service Plan': <Cloud className="w-4 h-4" />,
  'SQL Server': <Database className="w-4 h-4" />,
  'Azure Cosmos DB': <Database className="w-4 h-4" />,
  'Azure OpenAI': <Cloud className="w-4 h-4" />,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  useEffect(() => {
    async function fetchResources() {
      try {
        const params = new URLSearchParams();
        if (selectedType) params.append('type', selectedType);
        if (selectedLocation) params.append('location', selectedLocation);

        const response = await fetch(`/api/resources?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        setResources(data);
        setError(null);
      } catch (err) {
        setError('Failed to load resources');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [selectedType, selectedLocation]);

  // Group resources by type
  const grouped = resources.reduce(
    (acc, resource) => {
      if (!acc[resource.type]) {
        acc[resource.type] = [];
      }
      acc[resource.type].push(resource);
      return acc;
    },
    {} as Record<string, Resource[]>
  );

  const types = Object.keys(grouped);
  const locations = [...new Set(resources.map((r) => r.location))];
  const totalResources = resources.length;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Azure Resources Inventory</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600">{totalResources}</div>
          <div className="text-sm text-gray-600 mt-1">Total Resources</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600">{types.length}</div>
          <div className="text-sm text-gray-600 mt-1">Resource Types</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600">
            {locations.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Locations</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Resources by Type */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([type, typeResources]) => (
          <div key={type} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 font-semibold flex items-center gap-2">
              {resourceTypeIcons[type] || <Cloud className="w-4 h-4" />}
              <span>
                {type} ({typeResources.length})
              </span>
            </div>
            <div className="divide-y">
              {typeResources.map((resource) => (
                <div
                  key={resource.id}
                  className="px-4 py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{resource.name}</h3>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>
                          <span className="font-medium">Location:</span>{' '}
                          {resource.location}
                        </p>
                        {resource.subscription && (
                          <p>
                            <span className="font-medium">Subscription:</span>{' '}
                            {resource.subscription.substring(0, 8)}...
                          </p>
                        )}
                        {resource.resourceGroup && (
                          <p>
                            <span className="font-medium">Resource Group:</span>{' '}
                            {resource.resourceGroup}
                          </p>
                        )}
                      </div>
                    </div>
                    {resource.resourceLink && (
                      <a
                        href={resource.resourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        View in Azure
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
