import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomerCard from "../components/CustomerCard";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";

const StoragePage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios
      .get("https://tailorlog.onrender.com/api/customers")
      .then((response) => {
        // console.log("Fetched customers:", response.data);  // Log the customer data
        const normalizedCustomers = response.data.map((customer) => {
          // Normalize phone field to be 'phone'
          if (customer.mobile) {
            customer.phone = customer.mobile;
            delete customer.mobile; // Remove mobile if it's set
          }
          return customer;
        });
        setCustomers(normalizedCustomers);
      })
      .catch((error) => console.error("Error fetching customers:", error));
  };
  

  const handleEdit = (customer) => {
    navigate(`/edit-customer`, { state: { customer } });
  };

  const handleDelete = (id, event) => {
    event.preventDefault();

    const rect = event.target.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setCustomerToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(
        `https://tailorlog.onrender.com/api/customers/${customerToDelete}`
      );
      setCustomers(
        customers.filter((customer) => customer._id !== customerToDelete)
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer.");
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="storage-page">
      <h2>All Customers</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      {customers
        .filter(
          (customer) =>
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.phone.toLowerCase().includes(search.toLowerCase())
        )
        .map((customer) => {
          // console.log("Customer card props:", customer);  // Log the customer object for each card
          return (
            <CustomerCard
              key={customer._id}
              customerId={customer._id}
              name={customer.name}
              phone={customer.phone}
              onEdit={() => handleEdit(customer)}
              onDelete={(event) => handleDelete(customer._id, event)}
            />
          );
        })}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this customer?"
        customerId={customerToDelete}
        position={modalPosition}
      />
    </div>
  );
};

export default StoragePage;
