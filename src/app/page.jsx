import Activity from '@/components/user/ActivitySliced'
import Banner from '@/components/user/Banner'
import Category from '@/components/user/CategorySliced'
import Footer from '@/components/user/Footer'
import Navbar from '@/components/user/Navbar'
import Promo from '@/components/user/PromoSliced'
import React from 'react'

const Home = () => {
  return (
    <div>
          <Navbar/>
          <Banner/>
          <Promo/>
          <Category/>
          <Activity/>
          <Footer/>
    </div>
  )
}

export default Home