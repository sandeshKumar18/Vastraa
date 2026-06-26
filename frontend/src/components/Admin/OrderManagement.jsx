import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success("Order status updated successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        toast.success("Order deleted successfully.");
      } catch (err) {
        toast.error(err.message || "Failed to delete order.");
      }
    }
  };

  if (loading) return <p className="text-center p-6">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 p-6">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg bg-white">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 font-mono text-xs text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="py-4 px-4">{order.user ? order.user.name : "N/A"}</td>
                  <td className="py-4 px-4">${order.totalPrice}</td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {order.status !== "delivered" && (
                        <button
                          onClick={() => handleStatusChange(order._id, "delivered")}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition font-semibold"
                        >
                          Deliver
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;