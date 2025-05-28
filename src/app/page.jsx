import Activity from '@/components/Activity'
import Banner from '@/components/Banner'
import Category from '@/components/Category'
import Navbar from '@/components/Navbar'
import Promo from '@/components/Promo'
import React from 'react'

const Home = () => {
  return (
    <div>
          <Navbar/>
          <Banner/>
          <Promo/>
          <Category/>
          <Activity/>
    </div>
  )
}

export default Home