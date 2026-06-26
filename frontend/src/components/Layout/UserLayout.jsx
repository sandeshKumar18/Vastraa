import React from 'react'
import Header from '../Common/Header'
import Footer from '../Common/Footer'
import { Outlet } from 'react-router-dom'

function UserLayout() {
  return (
    <>

    {/* header */}
    <Header />


    {/* Main Content */}
    <main>
      <Outlet />
    </main>


    {/* footer */}
    <Footer />
    
    
    </>
    

     
  )
}

export default UserLayout