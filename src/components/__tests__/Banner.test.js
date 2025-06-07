import { render, screen, act } from '@testing-library/react'
import Banner from '../Banner'
import * as bannerService from '@/services/user/banner'

// Mock fetchBanner to return banners immediately
jest.mock('@/services/user/banner')

const mockBanners = [
  { id: 1, name: 'Banner 1', imageUrl: 'image1.jpg', title: 'Banner 1' },
  { id: 2, name: 'Banner 2', imageUrl: 'image2.jpg', title: 'Banner 2' },
]

beforeEach(() => {
  bannerService.fetchBanner.mockResolvedValue({ data: mockBanners })
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
  jest.clearAllMocks()
})

test('should render the banner', async () => {
  await act(async () => {
    render(<Banner />)
  })

  // Confirm banner name shows up
  expect(await screen.findByText('Banner 1')).toBeInTheDocument()
})

test('should have a clickable link to banner detail', async () => {
  await act(async () => {
    render(<Banner />)
  })

  const link = await screen.findByRole('link', { name: /banner 1/i })
  expect(link).toHaveAttribute('href', '/banner/1')
})

test('should automatically switch banners every 3 seconds', async () => {
  await act(async () => {
    render(<Banner />)
  })

  // Initially Banner 1 is visible
  expect(screen.getByText('Banner 1')).toBeInTheDocument()

  // Fast-forward 3 seconds to switch banner
  await act(() => {
    jest.advanceTimersByTime(3000)
  })

  expect(screen.getByText('Banner 2')).toBeInTheDocument()
})
