'use client'

import React from 'react'
import Activity from '@/components/user/ActivitySliced'
import Banner from '@/components/user/Banner'
import Category from '@/components/user/CategorySliced'
import Footer from '@/components/user/Footer'
import Navbar from '@/components/user/Navbar'
import Promo from '@/components/user/PromoSliced'
import Layout from '@/components/Layout'

export default function Home() {
  return (
    <>
      <Navbar />
      <Layout className="space-y-12">
        <Banner />
        <Promo />
        <Category />
        <Activity />
      </Layout>
      <Footer />
    </>
  )
}
