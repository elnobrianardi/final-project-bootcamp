import { fetchBannerById } from '@/services/user/banner'
import Image from 'next/image'

const BannerDetails = async ({ params }) => {
  const resolvedParams = await params
  
  const banner = await fetchBannerById(resolvedParams.id)

  if (!banner) {
    return <div className="p-4 text-red-500">Banner not found.</div>
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{banner.name}</h1>
      <img
        src={banner.imageUrl}
        alt={banner.name}
        width={800}
        height={400}
        className="rounded-lg object-cover"
      />
    </div>
  )
}

export default BannerDetails
