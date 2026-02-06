'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Car, AlertCircle, Upload, X } from 'lucide-react'
import Header from '@/components/Header'
import type { PutBlobResult } from '@vercel/blob'

export default function NewVanPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState<PutBlobResult | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    vanId: '',
    registration: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    tier: 'STANDARD',
    type: 'CARGO',
    dailyRate: '',
    mileageRate: '',
    status: 'AVAILABLE',
    configuration: '',
    accessories: '',
    photoUrl: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/vans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year.toString()),
          dailyRate: parseFloat(formData.dailyRate),
          mileageRate: parseFloat(formData.mileageRate),
          photoUrl: uploadedPhoto?.url || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create van')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/vans')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/vans/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        }
      )

      if (!response.ok) {
        throw new Error('Failed to upload photo')
      }

      const blob = (await response.json()) as PutBlobResult
      setUploadedPhoto(blob)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = () => {
    setUploadedPhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton backHref="/vans" currentPage="vans" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Van</h1>
          <p className="text-gray-600 mt-1">
            Add a new vehicle to your fleet
          </p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                Van added successfully! Redirecting...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Photo Upload Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Van Photo
            </label>
            
            {!uploadedPhoto ? (
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition"
                >
                  <Upload className="w-5 h-5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                </label>
                <span className="text-sm text-gray-500">
                  JPG, PNG or WebP (max 5MB)
                </span>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={uploadedPhoto.url}
                  alt="Van preview"
                  className="w-48 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Van ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Van ID *
              </label>
              <input
                type="text"
                name="vanId"
                value={formData.vanId}
                onChange={handleChange}
                required
                placeholder="VAN001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration *
              </label>
              <input
                type="text"
                name="registration"
                value={formData.registration}
                onChange={handleChange}
                required
                placeholder="ABC123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
                placeholder="Ford"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                placeholder="Transit"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1990"
                max="2030"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* VIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VIN
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="1FTFW1ET5DFC10312"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tier *
              </label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
                <option value="SPECIALIZED">Specialized</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CARGO">Cargo</option>
                <option value="PASSENGER">Passenger</option>
                <option value="REFRIGERATED">Refrigerated</option>
                <option value="BOX_TRUCK">Box Truck</option>
              </select>
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rate ($) *
              </label>
              <input
                type="number"
                name="dailyRate"
                value={formData.dailyRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="100.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Mileage Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage Rate ($/mi) *
              </label>
              <input
                type="number"
                name="mileageRate"
                value={formData.mileageRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="AVAILABLE">Available</option>
                <option value="BOOKED">Booked</option>
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UNAVAILABLE">Unavailable</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          {/* Configuration */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configuration
            </label>
            <textarea
              name="configuration"
              value={formData.configuration}
              onChange={handleChange}
              rows={3}
              placeholder="Standard cargo configuration with shelving"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Accessories */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accessories
            </label>
            <textarea
              name="accessories"
              value={formData.accessories}
              onChange={handleChange}
              rows={2}
              placeholder="GPS, Bluetooth, Backup camera"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Van'}
            </button>
            <Link
              href="/vans"
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
