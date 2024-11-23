import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { auth, db } from './firebase-config'; // Assuming you have Firestore initialized as 'db'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { AiFillPhone, AiOutlineGoogle, AiOutlineClose } from 'react-icons/ai';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FiUser, FiMail, FiLock, FiKey } from 'react-icons/fi';
import bcrypt from 'bcryptjs'; // For password hashing
import { collection, setDoc, doc } from 'firebase/firestore'; // Import the correct Firestore methods
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = memo(({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    verificationCode: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [verificationId, setVerificationId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Firebase interaction helpers
  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateFields = () => {
    const newErrors = {};
    if (!isPhoneAuth) {
      if (!formData.email && !formData.phone) {
        newErrors.email = 'Email or phone is required.';
      }
      if (!formData.password) newErrors.password = 'Password is required.';
      if (!isLogin && !formData.name) newErrors.name = 'Name is required.';
      if (!isLogin && !formData.role) newErrors.role = 'Role is required.';
    } else {
      if (!formData.phone) newErrors.phone = 'Phone number is required.';
      if (verificationId && !formData.verificationCode) {
        newErrors.verificationCode = 'Verification code is required.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create or log in the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      if (isLogin) {
        // Login with either phone or email
        if (formData.email) {
          await signInWithEmailAndPassword(auth, formData.email, formData.password);
        } else {
          const verifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
          const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, verifier);
          setVerificationId(confirmationResult.verificationId);
        }
        toast.success('Login successful!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        await saveUserDataToFirestore(user, hashedPassword);
        toast.success(`${formData.role} registration successful!`);
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveUserDataToFirestore = async (user, hashedPassword) => {
    try {
      const userData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        role: formData.role,
        password: hashedPassword,
        uid: user.uid,
      };
      const userRef = doc(db, formData.role === 'buyer' ? 'buyers' : 'sellers', user.uid);
      await setDoc(userRef, userData);
    } catch (error) {
      console.error('Error saving user data to Firestore:', error);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      if (!verificationId) {
        const verifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth);
        const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, verifier);
        setVerificationId(confirmationResult.verificationId);
        toast.success('Verification code sent!');
      } else {
        const confirmationResult = window.confirmationResult;
        await confirmationResult.confirm(formData.verificationCode);
        toast.success('Phone authentication successful!');
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSocialLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await saveUserDataToFirestore(userCredential.user, null);
      toast.success('Google login successful!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderForm = () => (
    <form onSubmit={isPhoneAuth ? handlePhoneSubmit : handleSubmit} className="space-y-6">
      <div id="recaptcha-container"></div>
      {isPhoneAuth ? (
        <>
          <div className="relative mb-4">
            {!verificationId ? (
              <>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="input-field pl-12"
                  required
                />
                <AiFillPhone className="absolute left-4 top-0 text-gray-500" size={20} />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  placeholder="Enter code"
                  className="input-field pl-12"
                  required
                />
                <FiKey className="absolute left-4 top-0 text-gray-500" size={20} />
              </>
            )}
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 mt-4">
            {verificationId ? 'Verify Code' : 'Send Code'}
          </Button>
        </>
      ) : (
        <>
          {!isLogin && (
            <div className="relative mb-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="input-field pl-12"
                required
              />
              <FiUser className="absolute left-4 top-0 text-gray-500" size={20} />
            </div>
          )}
          <div className="relative mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email or Phone"
              className="input-field pl-12"
            />
            <FiMail className="absolute left-4 top-0 text-gray-500" size={20} />
          </div>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="input-field pl-12 pr-12"
              required
            />
            <FiLock className="absolute left-4 top-0 text-gray-500" size={20} />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-0 text-gray-500"
            >
              {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Role</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Buyer</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Seller</span>
                </label>
              </div>
            </div>
          )}
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 mt-4">
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </>
      )}
    </form>
  );

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="relative bg-white w-[90%] md:w-[400px] rounded-lg p-6 space-y-4">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
            <AiOutlineClose size={20} />
          </button>
          <h2 className="text-lg font-semibold text-center">{isLogin ? 'Login' : 'Register'}</h2>
          <div className="flex justify-center gap-4 mb-4">
            <Button className="bg-blue-500 hover:bg-blue-400 text-white rounded-lg px-4 py-2" onClick={handleSocialLogin}>
              <AiOutlineGoogle size={20} className="mr-2" />
              Google
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-400 text-white rounded-lg px-4 py-2"
              onClick={() => setIsPhoneAuth((prev) => !prev)}
            >
              <AiFillPhone size={20} className="mr-2" />
              {isPhoneAuth ? 'Email' : 'Phone'}
            </Button>
          </div>
          {renderForm()}
          <div className="text-sm text-center">
            {isLogin ? (
              <>
                Don’t have an account?{' '}
                <button
                  type="button"
                  className="text-blue-500 underline hover:no-underline"
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                  }}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-500 underline hover:no-underline"
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                  }}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
});

export default Modal;
