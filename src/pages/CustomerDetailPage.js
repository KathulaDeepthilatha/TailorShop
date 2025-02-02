import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/CustomerDetailPage.css";
import { FaPlus, FaEdit, FaCheck } from "react-icons/fa";

const CustomerDetailPage = () => {
  const { customerId } = useParams();
  console.log("Customer ID from URL:", customerId);
  const [customerData, setCustomerData] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newMeasurement, setNewMeasurement] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      console.log("Fetching customer data for ID:", customerId);
      try {
        const response = await axios.get(
          `https://tailorlog.onrender.com/api/customers/${customerId}`
        );
        console.log("Fetched customer data:", response.data);
        setCustomerData(response.data);
        console.log("Updated state:", response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleAddCategory = () => {
    if (newCategory && newMeasurement) {
      setCustomerData((prev) => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [newCategory]: newMeasurement,
        },
      }));
      setNewCategory("");
      setNewMeasurement("");
      setShowAddCategory(false);
    }
  };

  const handleMarkCompleted = (category) => {
    alert(`${category} marked as completed!`);
  };

  if (!customerData) return <div>Loading...</div>;

  return (
    <div className="customer-detail-page">
      <div className="header">
        <div>
          <h2>{customerData.name}</h2>
          <p>{customerData.mobile}</p>
        </div>
        <div className="header-actions">
          <a href={`tel:${customerData.mobile}`} className="phone-icon">
            📞
          </a>
          <button
            className="add-category-button"
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {showAddCategory && (
        <div className="add-category-form">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Measurement"
            value={newMeasurement}
            onChange={(e) => setNewMeasurement(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add</button>
        </div>
      )}

      <h3>Measurements</h3>
      <div className="measurement-cards">
        {Object.entries(customerData.measurements).map(([key, value]) => (
          console.log("Measurements Data:", customerData?.measurements),

          <div className="measurement-card" key={key}>
            <img
              src={`/images/${key}.jpg`} // Assuming images are stored in a folder named 'images'
              alt={key}
              className="category-image"
            />
            <div className="measurement-details">
              <h4>{key.replace("_", " ").toUpperCase()}</h4>
              <p>{value}</p>
              <div className="card-actions">
                <button className="edit-button">
                  <FaEdit /> Edit
                </button>
                <button
                  className="completed-button"
                  onClick={() => handleMarkCompleted(key)}
                >
                  <FaCheck /> Mark as Completed
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
