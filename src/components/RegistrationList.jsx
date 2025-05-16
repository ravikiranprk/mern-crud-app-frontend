import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { getRegistrations, deleteRegistration } from '../services/api';
import Modal from './Modal';

const RegistrationList = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await getRegistrations();
        setRegistrations(response.data);
      } catch (error) {
        console.error('Error fetching registrations:', error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (registration) => {
    setRegistrationToDelete(registration);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRegistration(registrationToDelete._id);
      setRegistrations(registrations.filter(reg => reg._id !== registrationToDelete._id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting registration:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registrations</h1>
        <button
          onClick={() => navigate('/create')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer shadow-sm shadow-blue-950 hover:shadow-md hover:shadow-blue-950 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Registration
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Occupation</th>
              <th className="px-6 py-3 text-left text-[0.875rem] font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {registrations.map((registration) => (
              <tr key={registration._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={`http://localhost:8000/${registration.photo}`} 
                    alt={registration.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {registration.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.age}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.mobileNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registration.occupation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(registration._id)}
                      className="text-blue-600 hover:text-blue-400 font-semibold"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(registration)}
                      className="text-red-600 hover:text-red-400 font-semibold"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete the registration for {registrationToDelete?.name}?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegistrationList;