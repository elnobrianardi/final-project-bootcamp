import { fetchBannerById } from '@/services/user/banner'

const BannerDetails = async ({ params }) => {
  const banner = await fetchBannerById(params.id)

  if (!banner) {
    return <div className="p-6 text-center text-red-500">Banner tidak ditemukan.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">{banner.name}</h1>

      <div className="overflow-hidden rounded-xl shadow group border">
        <img
          src={banner.imageUrl}
          alt={banner.name}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

export default BannerDetails
