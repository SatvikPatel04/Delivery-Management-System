import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import Login from './Pages/Login/Login';
import Signup from './Pages/Signup/Signup';
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder.jsx';
import TrackOrder from './Pages/TrackOrder/TrackOrder';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import AddDeliveryPartner from './Pages/AddDeliveryPartner/AddDeliveryPartner';
import ViewDeliveryPartners from './Pages/ViewDeliveryPartners/ViewDeliveryPartners';
import CustomerDashboard from './Pages/CustomerDashboard/CustomerDashboard';
import ViewOrders from './Pages/ViewMyOrders/ViewOrders.jsx';
import RemoveDP from './Pages/RemoveDP/RemoveDP.jsx';
import UpdateDetails from './Pages/UpdateDetails/UpdateDetails.jsx';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/track-order' element={<TrackOrder />} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
        <Route path='/add-delivery-partner' element={<AddDeliveryPartner />} />
        <Route path='/view-delivery-partners' element={<ViewDeliveryPartners/>} />
        <Route path='/customer-dashboard' element={<CustomerDashboard/>} />
        <Route path='/view-my-orders' element={<ViewOrders />} />
        <Route path='/remove-dp' element={<RemoveDP />} />
        <Route path='/update-user' element={<UpdateDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;