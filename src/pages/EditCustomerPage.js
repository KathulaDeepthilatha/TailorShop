import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EditCustomerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = location.state || {};
  const [formData, setFormData] = useState({
    measurements: customer ? customer.measurements : {},
  });

  useEffect(() => {
    if (!customer) {
      navigate("/storage");
    }
  }, [customer, navigate]);

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      measurements: { ...formData.measurements, [key]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://tailorlog.onrender.com/api/customers/${customer._id}`,
        { measurements: formData.measurements }
      );
      alert("Customer measurements updated successfully!");
      navigate("/storage");
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer details.");
    }
  };

  const measurementFields = [
    { label: "Neck", key: "neck" },
    { label: "Full Shoulder", key: "full_shoulder" },
    { label: "Full Sleeves", key: "full_sleeves" },
    { label: "Bicep", key: "bicep" },
    { label: "Full Chest", key: "full_chest" },
    { label: "Waist", key: "waist" },
    { label: "Jacket", key: "jacket" },
    { label: "Hips", key: "hips" },
    { label: "Thigh", key: "thigh" },
    { label: "Trouser Waist", key: "trouser_waist" },
    { label: "Trouser Hips", key: "trouser_hips" },
    { label: "Trouser Length", key: "trouser_length" },
    { label: "Ankle", key: "ankle" },
    { label: "Full Crotch", key: "full_crotch" },
  ];

  return (
    <div className="edit-customer-page">
      <h2 className="edit-page-title">Edit Measurements</h2>
      <div className="customer-info">
        <p>
          <strong className="label">Name:</strong>{" "}
          <span className="customer-detail">{customer.name}</span>
        </p>
        <p>
          <strong className="label">Phone:</strong>{" "}
          <span className="customer-detail">{customer.phone}</span>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="edit-customer-form">
        <div>
          <h3 className="measurement-title">Measurements</h3>
          <div className="measurement-section">
            {measurementFields.map(({ label, key }) => (
              <div className="form-group" key={key}>
                <label htmlFor={key}>{label}</label>
                <input
                  type="number"
                  id={key}
                  value={formData.measurements[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCustomerPage;
