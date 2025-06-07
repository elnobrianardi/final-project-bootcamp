import axios from 'axios'
import { fetchBanner, fetchBannerById } from '../banner'

jest.mock('axios')

describe('fetchBanner service', () => {
  it('fetches banners successfully from API', async () => {
    const mockData = [{ id: 1, name: 'Banner 1' }]
    axios.get.mockResolvedValue({ data: mockData })

    const response = await fetchBanner()

    expect(axios.get).toHaveBeenCalledWith(
      'https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners',
      { headers: { apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c' } }
    )
    expect(response).toEqual(mockData)
  })

  it('throws an error when API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'))

    await expect(fetchBanner()).rejects.toThrow('Network error')
  })
})

describe('fetchBannerById service', () => {
  it('fetches a banner by ID successfully', async () => {
    const id = 123
    const mockData = { id, name: 'Banner 123' }
    axios.get.mockResolvedValue({ data: { data: mockData } })

    const response = await fetchBannerById(id)

    expect(axios.get).toHaveBeenCalledWith(
      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banner/${id}`,
      { headers: { apiKey: '24405e01-fbc1-45a5-9f5a-be13afcd757c' } }
    )
    expect(response).toEqual(mockData)
  })

  it('throws an error when API call fails', async () => {
    const id = 456
    axios.get.mockRejectedValueOnce(new Error('Network error'))

    await expect(fetchBannerById(id)).rejects.toThrow('Network error')
  })
})
