import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { createRegistration, getRegistration, updateRegistration } from '../services/api';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const maritalStatusOptions = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
];

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  age: Yup.number()
    .required('Age is required')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age cannot exceed 120'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth must be in the past'),
  gender: Yup.string()
    .required('Gender is required'),
  mobileNumber: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  address: Yup.string()
    .required('Address is required')
    .max(500, 'Address cannot exceed 500 characters'),
  state: Yup.string()
    .required('State is required')
    .max(50, 'State cannot exceed 50 characters'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits'),
  occupation: Yup.string()
    .required('Occupation is required')
    .max(100, 'Occupation cannot exceed 100 characters'),
  maritalStatus: Yup.string()
    .required('Marital status is required'),
  photo: Yup.mixed()
    .test('fileType', 'Only image files are allowed', (value) => {
      if (!value) return true; // Skip validation if no file is provided
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    })
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      age: '',
      dateOfBirth: '',
      gender: '',
      mobileNumber: '',
      email: '',
      address: '',
      state: '',
      pincode: '',
      occupation: '',
      maritalStatus: '',
      photo: null
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key !== 'photo' || values[key]) {
            formData.append(key, values[key]);
          }
        });

        if (isEditMode) {
          await updateRegistration(id, formData);
        } else {
          await createRegistration(formData);
        }
        
        navigate('/');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      const fetchRegistration = async () => {
        try {
          const response = await getRegistration(id);
          const registration = response.data;
          
          // Set form values
          Object.keys(registration).forEach(key => {
            if (key in formik.initialValues && key !== 'photo') {
              formik.setFieldValue(key, registration[key]);
            }
          });

          // Set photo preview if photo exists
          if (registration.photo) {
            setPhotoPreview(`http://localhost:5000/${registration.photo}`);
          }

          setIsEditMode(true);
        } catch (error) {
          console.error('Error fetching registration:', error);
        }
      };

      fetchRegistration();
    }
  }, [id]);

  const handlePhotoChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('photo', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const removePhoto = () => {
    formik.setFieldValue('photo', null);
    setPhotoPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Registration' : 'Create Registration'}
      </h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.age && formik.errors.age ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.age && formik.errors.age && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.age}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.dateOfBirth}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.mobileNumber && formik.errors.mobileNumber ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.mobileNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.state && formik.errors.state && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.state}</p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.pincode && formik.errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.pincode}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
              Occupation
            </label>
            <input
              id="occupation"
              name="occupation"
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.occupation && formik.errors.occupation ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.occupation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.occupation && formik.errors.occupation && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.occupation}</p>
            )}
          </div>

          {/* Marital Status */}
          <div>
            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
              Marital Status
            </label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              className={`w-full px-3 py-2 border rounded-md ${formik.touched.maritalStatus && formik.errors.maritalStatus ? 'border-red-500' : 'border-gray-300'}`}
              value={formik.values.maritalStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Marital Status</option>
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.maritalStatus && formik.errors.maritalStatus && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.maritalStatus}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className={`w-full px-3 py-2 border rounded-md ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'}`}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex flex-col items-center justify-center px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
              <Camera className="w-5 h-5" />
              <span className="mt-1 text-sm">Upload Photo</span>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
            {photoPreview && (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {formik.touched.photo && formik.errors.photo && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.photo}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;