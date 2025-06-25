"use client";

import {
  createActivity,
  deleteActivity,
  updateActivity,
} from "@/services/admin/activity";
import { fetchActivity } from "@/services/user/activity";
import { uploadImage } from "@/services/user/uploadImage";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [],
    price: 0,
    price_discount: 0,
    rating: 0,
    total_reviews: 0,
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
    id: null,
  });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = Cookies.get("token");

  useEffect(() => {
    const getActivity = async () => {
      if (!token) return toast.error("Token not found");
      try {
        const response = await fetchActivity();
        setActivities(response || []);
      } catch (error) {
        toast.error("Error fetching activity");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    getActivity();
  }, []);

  useEffect(() => {
    if (formData.imageUrls.length) {
      setPreviewUrls(formData.imageUrls);
    } else {
      setPreviewUrls([]);
    }
  }, [formData.imageUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const localPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(localPreviews);

    try {
      const urls = [];
      for (const file of selectedFiles) {
        const url = await uploadImage(file, token);
        urls.push(url);
      }
      setFormData((prev) => ({ ...prev, imageUrls: urls }));
      toast.success("Image(s) uploaded");
    } catch (error) {
      toast.error("Failed to upload images");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Token not found");

    try {
      const payload = {
        ...formData,
        price: +formData.price,
        price_discount: +formData.price_discount,
        rating: +formData.rating,
        total_reviews: +formData.total_reviews,
      };

      if (formData.id) {
        await updateActivity(formData.id, payload, token);
        toast.success("Activity updated!");
      } else {
        await createActivity(payload, token);
        toast.success("Activity created!");
      }

      setFormData({
        categoryId: "",
        title: "",
        description: "",
        imageUrls: [],
        price: 0,
        price_discount: 0,
        rating: 0,
        total_reviews: 0,
        facilities: "",
        address: "",
        province: "",
        city: "",
        location_maps: "",
        id: null,
      });
      setFiles([]);
      setPreviewUrls([]);
      setShowForm(false);

      const response = await fetchActivity();
      setActivities(response || []);
    } catch (error) {
      toast.error("Failed to save activity");
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      ...activity,
      imageUrls: Array.isArray(activity.imageUrls) ? activity.imageUrls : [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!token) return toast.error("Token not found");
    if (!confirm("Are you sure?")) return;
    try {
      await deleteActivity(id, token);
      setActivities(activities.filter((a) => a.id !== id));
      toast.success("Activity deleted!");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const { currentItems, totalPages, pageNumbers, indexOfFirstItem } =
    useMemo(() => {
      const total = Math.ceil(activities.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const sliced = activities.slice(start, start + itemsPerPage);
      const numbers = Array.from({ length: total }, (_, i) => i + 1);
      return {
        currentItems: sliced,
        totalPages: total,
        pageNumbers: numbers,
        indexOfFirstItem: start,
      };
    }, [activities, currentPage]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">All Activities</h1>
      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Create New Activity
      </button>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 bg-opacity-30 flex justify-center items-center z-10">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold mb-4">
              {formData.id ? "Edit Activity" : "Create Activity"}
            </h2>
            {[
              "categoryId",
              "title",
              "description",
              "price",
              "price_discount",
              "rating",
              "total_reviews",
              "facilities",
              "address",
              "province",
              "city",
              "location_maps",
            ].map((name) => (
              <input
                key={name}
                type={
                  name.includes("price") ||
                  name.includes("rating") ||
                  name.includes("total")
                    ? "number"
                    : "text"
                }
                name={name}
                value={
                  name.includes("price") ||
                  name.includes("rating") ||
                  name.includes("total")
                    ? formData[name] === 0
                      ? ""
                      : formData[name]
                    : formData[name]
                }
                onChange={handleChange}
                placeholder={name.replace("_", " ").toUpperCase()}
                className="mb-2 border w-full p-2 rounded"
                required
              />
            ))}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mb-2 border w-full p-2 rounded text-sm"
            />

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {previewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                {formData.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((a, i) => (
            <tr key={a.id}>
              <td className="border p-2">{indexOfFirstItem + i + 1}</td>
              <td className="border p-2">{a.title}</td>
              <td className="border p-2">
                <img
                  src={a.imageUrls[0]}
                  className="w-16 h-10 object-cover"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
              </td>
              <td className="border p-2">Rp {a.price.toLocaleString()}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(a)} className="text-blue-500">
                  Edit
                </button>{" "}
                |{" "}
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded border ${
                currentPage === number ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllActivity;
