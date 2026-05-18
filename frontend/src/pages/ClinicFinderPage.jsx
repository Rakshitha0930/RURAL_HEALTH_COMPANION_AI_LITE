import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { FaMapMarkerAlt, FaSearch, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ClinicFinderPage() {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const mapInstanceRef = useRef(null)
  const serviceRef = useRef(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      setLoading(false)
      return
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places'],
    })

    loader.load().then(() => {
      if (!mapRef.current) return

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const center = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
          })
          mapInstanceRef.current = map
          serviceRef.current = new window.google.maps.places.PlacesService(map)

          // Search for nearby clinics
          serviceRef.current.nearbySearch(
            { location: center, radius: 5000, type: 'hospital' },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                  new window.google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    title: place.name,
                    icon: {
                      url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                    },
                  })
                })
              }
            }
          )

          setMapLoaded(true)
          setLoading(false)
        },
        () => {
          // Fallback to a default location
          const defaultCenter = { lat: 20.5937, lng: 78.9629 } // India center
          const map = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 5,
          })
          mapInstanceRef.current = map
          setMapLoaded(true)
          setLoading(false)
          toast.error('Location access denied. Showing default map.')
        }
      )
    })
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim() || !serviceRef.current || !mapInstanceRef.current) return

    const request = {
      query: searchQuery + ' clinic hospital',
      fields: ['name', 'geometry'],
    }

    serviceRef.current.findPlaceFromQuery(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        mapInstanceRef.current.setCenter(results[0].geometry.location)
        mapInstanceRef.current.setZoom(14)
        new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: results[0].geometry.location,
          title: results[0].name,
        })
      } else {
        toast.error('No results found for that location.')
      }
    })
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clinic Finder</h1>
        <p className="mt-1 text-gray-500">Find hospitals, clinics, and pharmacies near you.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or area…"
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary px-5">
          Search
        </button>
      </form>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100" style={{ height: '500px' }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
            <FaSpinner className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-sm text-gray-500">Loading map…</p>
          </div>
        )}

        {!apiKey || apiKey === 'your_google_maps_api_key_here' ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
            <FaMapMarkerAlt className="h-12 w-12 text-gray-300" />
            <div>
              <p className="font-semibold text-gray-700">Google Maps API Key Required</p>
              <p className="mt-1 text-sm text-gray-500">
                Add your <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code> to the{' '}
                <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">.env</code> file to enable the map.
              </p>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="h-full w-full" />
        )}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Map shows hospitals and clinics within 5 km of your location. Results may vary.
      </p>
    </div>
  )
}
