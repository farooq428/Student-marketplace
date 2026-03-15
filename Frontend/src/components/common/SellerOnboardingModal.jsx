import { useState, useContext } from "react";
import { updateUserProfile } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SellerOnboardingModal = ({ isOpen, onClose, onComplete }) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ university: "", department: "" });
  const [cardFront, setCardFront] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [frontPreview, setFrontPreview] = useState("");
  const [backPreview, setBackPreview] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // generate previews for selected files
  const handleFrontSelect = (file) => {
    setCardFront(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFrontPreview(url);
    } else {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      setFrontPreview("");
    }
  };

  const handleBackSelect = (file) => {
    setCardBack(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setBackPreview(url);
    } else {
      if (backPreview) URL.revokeObjectURL(backPreview);
      setBackPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("university", form.university);
      data.append("department", form.department);
      if (cardFront) data.append("cardFront", cardFront);
      if (cardBack) data.append("cardBack", cardBack);

      const res = await updateUserProfile(user._id, data);

      // update auth context user
      if (res) {
        setUser(res);
        try {
          localStorage.setItem("user", JSON.stringify(res));
        } catch {}
      }

      setLoading(false);
      onComplete && onComplete();
      // After onboarding, send user to under-review page until admin verifies
      navigate("/under-review");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded max-w-xl w-full">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Seller onboarding</h3>
          <button onClick={onClose} aria-label="Close onboarding" className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {error && <p className="text-red-500 mt-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">University</label>
              <input name="university" placeholder="University" value={form.university} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input name="department" placeholder="Department" value={form.department} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Card Front</label>
            <div className="flex items-center gap-3">
              <input accept="image/*" type="file" onChange={(e) => handleFrontSelect(e.target.files[0])} className="" required />
              {frontPreview && (
                <div className="w-28 h-20 border rounded overflow-hidden">
                  <img src={frontPreview} alt="front preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload a clear photo of the front side of your student ID (PNG/JPG). Max 5MB.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Card Back (optional)</label>
            <div className="flex items-center gap-3">
              <input accept="image/*" type="file" onChange={(e) => handleBackSelect(e.target.files[0])} className="" />
              {backPreview && (
                <div className="w-28 h-20 border rounded overflow-hidden">
                  <img src={backPreview} alt="back preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Optional: back side of the ID. Helpful for verification.</p>
          </div>

          <div className="flex gap-2 justify-end">
            <button disabled={loading} type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow">
              {loading ? "Saving..." : "Save & Continue"}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerOnboardingModal;
