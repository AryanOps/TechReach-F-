
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Reviews } from './pages/Reviews';
import { UserSettings } from './pages/UserSettings';
import { ChatWidget } from './components/ChatWidget';
import { VerificationModal } from './components/VerificationModal';
import { MOCK_SERVICES, APP_NAME } from './constants';
import { User, Order, Service, DirectMessage, SiteReview, CheckoutData } from './types';
import { Mail, Lock, User as UserIcon, Phone, X, AlertCircle } from 'lucide-react';
import api from './services/api';

const ADMIN_EMAIL = 'admin@myapp.com';

// Forgot Password Modal
const ForgotPasswordModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert(`Password reset link sent to ${email}`);
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-theme-card w-full max-w-md rounded-2xl shadow-xl border border-theme-border p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-muted hover:text-theme-text">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-theme-text mb-2">Reset Password</h3>
        <p className="text-theme-muted text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-text mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-theme-border bg-theme-input text-theme-text focus:ring-2 focus:ring-premium-royal outline-none"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-premium-royal to-premium-indigo text-white py-2 rounded-full font-medium hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Auth Component
import { authService } from './services/authService';

const AuthPage = ({ onAuth }: { onAuth: (data: any, isLogin: boolean) => Promise<string | void> }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState(''); // New state for error message
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(''); // Clear previous errors on submit attempt

    // Simulate API delay
    // Changed to async call
    (async () => {
      const error = await onAuth(formData, isLogin);
      if (error) {
        setLoginError(error);
      }
      setLoading(false);
    })();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginError(''); // Auto-clear error when user types
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-main py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-200 dark:bg-primary-900/40 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary-200 dark:bg-secondary-900/40 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-md w-full space-y-8 bg-theme-card p-10 rounded-3xl shadow-2xl relative z-10 glass border border-white/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-premium-royal to-premium-indigo rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg mx-auto mb-6">
            TR
          </div>
          <h2 className="text-3xl font-extrabold text-theme-text">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-theme-muted">
            {isLogin ? 'Sign in to access your dashboard' : 'Join TeachReach to hire experts'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form Fields Container with Spacing */}
          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-theme-text mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-theme-muted group-focus-within:text-premium-royal transition-colors" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-11 px-4 py-3.5 border border-theme-border rounded-xl text-theme-text bg-theme-input focus:outline-none focus:ring-2 focus:ring-premium-royal/50 focus:border-premium-royal transition-all shadow-sm hover:border-premium-royal/50 sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* INLINE ERROR MESSAGE */}
          {loginError && (
            <div className="mt-4 bg-[#ffe6e6] text-[#d00000] px-4 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4" />
              {loginError}
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-premium-royal hover:text-premium-indigo hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-gradient-to-r from-premium-royal to-premium-indigo hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-royal disabled:opacity-50 shadow-lg transform transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setLoginError(''); }}
              className="text-sm font-medium text-theme-muted hover:text-premium-royal transition-colors"
            >
              {isLogin ? (
                <>Don't have an account? <span className="font-bold text-premium-royal underline ml-1">Sign up</span></>
              ) : (
                <>Already have an account? <span className="font-bold text-premium-royal underline ml-1">Sign in</span></>
              )}
            </button>
          </div>
        </form>
      </div>

      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </div>
  );
};

// Main App Component with Router and State
const AppContent = () => {
  // Initialize State from LocalStorage
  const [user, setUser] = useState<User | null>(() => {
    return authService.getCurrentUser();
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : MOCK_SERVICES; // Seed if empty
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    // Initial load from local storage, but useEffect will fetch from Supabase
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);

  const [siteName, setSiteName] = useState(() => {
    return localStorage.getItem('appName') || APP_NAME;
  });

  // Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  // Auto-Save Effects (Local Storage)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('appName', siteName); }, [siteName]);

  // API: Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/reviews');
        const mappedReviews = data.map((r: any) => ({
          id: r._id,
          userId: r.user?._id || r.user, // Handle populated or not
          userName: r.name,
          userAvatar: `https://picsum.photos/seed/${r.name}/100/100`, // Placeholder
          rating: r.rating,
          comment: r.comment,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
        }));
        setSiteReviews(mappedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // API: Fetch All Users (Admin Only)
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/admin/users').then(({ data }) => {
        const mappedUsers = data.map((u: any) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: `https://picsum.photos/seed/${u.name}/100/100`,
          isVerified: true // Assumption for now
        }));
        setRegisteredUsers(mappedUsers);
      }).catch(err => console.error("Error fetching users:", err));
    }
  }, [user]);

  // API: Fetch Orders on Mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const endpoint = user.role === 'admin' ? '/orders' : '/orders/myorders';
        const { data } = await api.get(endpoint);

        // Backend returns orders directly, map if necessary or ensure type compatibility
        const mappedOrders = data.map((d: any) => ({
          id: d._id || d.id,
          serviceId: 'unknown',
          serviceTitle: d.orderItems[0]?.serviceName || 'Service',
          serviceImage: d.orderItems[0]?.image || 'https://picsum.photos/seed/order/100/100',
          price: d.totalPrice,
          status: (d.status?.toLowerCase() as any) || 'active',
          date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          clientName: d.user?.name || user.name,
          deliverables: d.deliverables
        })) as Order[];

        setOrders(mappedOrders);
        localStorage.setItem('orders', JSON.stringify(mappedOrders));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user]);

  // Calculate unread messages dynamically
  const unreadMessagesCount = user
    ? messages.filter(m => !m.isRead && m.receiverId === user.id).length
    : 0;

  const navigate = useNavigate();

  // Updated to return string errors instead of alerts
  const handleAuth = async (data: any, isLogin: boolean): Promise<string | void> => {
    try {
      if (isLogin) {
        const response = await authService.login({ email: data.email, password: data.password });
        const loggedInUser: User = {
          id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          avatar: `https://picsum.photos/seed/${response.name}/100/100`, // Placeholder
          token: response.token
        };
        setUser(loggedInUser);
        if (loggedInUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Register
        const response = await authService.register({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.email === ADMIN_EMAIL ? 'admin' : 'client'
        });
        const registeredUser: User = {
          id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          avatar: `https://picsum.photos/seed/${response.name}/100/100`, // Placeholder
          token: response.token
        };
        setUser(registeredUser);
        if (registeredUser.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      return error.response?.data?.message || "Authentication failed. Please try again.";
    }
  };

  const handleVerify = (code: string) => {
    const userToVerify = registeredUsers.find(u => u.email === pendingVerificationEmail);
    if (!userToVerify) return;

    if (userToVerify.verificationCode === code) {
      // Update user status
      const updatedUser: User = { ...userToVerify, isVerified: true };

      // Update DB
      setRegisteredUsers(prev => prev.map(u => u.email === pendingVerificationEmail ? updatedUser : u));

      // Login User
      setUser(updatedUser);
      setShowVerifyModal(false);
      alert("Account Verified Successfully!");

      if (updatedUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert("Invalid Verification Code. Please try again.");
    }
  };

  const handleResendCode = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000).toString();
    setRegisteredUsers(prev => prev.map(u => u.email === pendingVerificationEmail ? { ...u, verificationCode: newCode } : u));
    // In a real app, send email here.
    console.log(`Resent Code: ${newCode}`);
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (!user) return;

    // If email is changing, we must re-verify
    if (updatedData.email && updatedData.email !== user.email) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const updatedUser = { ...user, ...updatedData, isVerified: false, verificationCode: otp };

      // Update DB
      setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));

      // Logout and show verify
      setUser(null);
      setPendingVerificationEmail(updatedUser.email);
      alert(`Email changed. Verification Code: ${otp}`);
      setShowVerifyModal(true);
      return;
    }

    const updatedUser = { ...user, ...updatedData };
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setUser(updatedUser);
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    // Requirement: Admin Must NOT See Delete Account Button (Backend block)
    if (user.email === ADMIN_EMAIL || user.role === 'admin') {
      alert("Admin account cannot be deleted.");
      return;
    }

    try {
      // Requirement: Database Consistency (Cascade Delete)
      setRegisteredUsers(prev => prev.filter(u => u.id !== user.id));
      setMessages(prev => prev.filter(m => m.senderId !== user.id)); // Remove messages sent by user
      setSiteReviews(prev => prev.filter(r => r.userId !== user.id)); // Remove reviews by user

      // Requirement: Clear all saved session data and Log the user out
      setUser(null);
      authService.logout();

      // Requirement: Redirect user to the Login Page
      navigate('/login');

      // Feedback
      alert("Your account has been deleted successfully.");
    } catch (error) {
      // Requirement: Error Handling
      console.error("Deletion Error:", error);
      alert("Error deleting account. Please try again.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  // API: Checkout Logic (Updated with CheckoutData)
  const handleOrder = async (serviceId: string, checkoutData: CheckoutData) => {
    const service = services.find(s => s.id === serviceId);
    if (service && user) {

      try {
        const orderData = {
          orderItems: [{
            title: service.title,
            qty: 1,
            image: service.image,
            price: service.price,
            service: service.id
          }],
          totalPrice: service.price,
          // Additional fields if backend needs them (e.g. shipping address from checkoutData)
        };

        const { data } = await api.post('/orders', orderData);

        // Update Local State for immediate UI feedback
        const newOrder: Order = {
          id: data._id,
          serviceId: service.id,
          serviceTitle: service.title,
          serviceImage: service.image,
          price: service.price,
          status: 'active',
          date: new Date().toLocaleDateString(),
          clientName: user.name
        };

        setOrders(prev => [newOrder, ...prev]);
        alert("Order placed successfully!");
      } catch (error: any) {
        console.error('Order Error:', error);
        alert(`Order Failed: ${error.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  // Admin Actions
  const handleUpdateService = (updatedService: Service) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleAddService = (newService: Service) => {
    setServices(prev => [newService, ...prev]);
  };

  const handleUpdateOrder = (id: string, status: Order['status'], deliverables?: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, deliverables } : o));
    // Optionally update Supabase status here as well
    // supabase.from('orders').update({ status }).eq('id', id)...
  };

  // Message Handling
  const handleSendMessage = (text: string, attachment?: string) => {
    if (!user) return;

    // Find Admin to receive message
    const adminUser = registeredUsers.find(u => u.role === 'admin' || u.email === ADMIN_EMAIL);
    const receiverId = adminUser ? adminUser.id : 'admin';

    const newMessage: DirectMessage = {
      id: `m${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId: receiverId,
      text,
      attachment,
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Admin sending message
  const handleAdminSendMessage = (receiverId: string, text: string, attachment?: string) => {
    if (!user) return;
    const newMessage: DirectMessage = {
      id: `m${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId,
      text,
      attachment,
      timestamp: new Date(),
      isRead: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleMarkAsRead = (senderId: string) => {
    if (!user) return;
    // Mark all messages from this sender to current user as read
    setMessages(prev => prev.map(m =>
      (m.senderId === senderId && m.receiverId === user.id && !m.isRead)
        ? { ...m, isRead: true }
        : m
    ));
  };

  // Review Handling
  const handleAddReview = async (rating: number, comment: string) => {
    if (!user) return;
    try {
      const { data } = await api.post('/reviews', {
        rating,
        comment,
        // Backend might default name/user from token, but defined schema might expect it?
        // Review Model: user, name, rating, comment...
        // Controller gets user from req.user. It might need 'name' in body? 
        // Review Controller: const { rating, comment } = req.body; name = req.user.name;
      });

      const newReview: SiteReview = {
        id: data._id,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating,
        comment,
        date: new Date().toLocaleDateString()
      };
      setSiteReviews(prev => [newReview, ...prev]);
    } catch (error: any) {
      console.error("Error adding review:", error);
      alert("Failed to add review: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`);
      setSiteReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  // Notification counts
  const notificationCount = orders.filter(o => o.status === 'active').length + unreadMessagesCount;

  return (
    <>
      <Layout
        user={user}
        onLogout={handleLogout}
        notificationCount={notificationCount}
        unreadMessageCount={unreadMessagesCount}
        appName={siteName}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetail user={user} onOrder={handleOrder} />} />
          <Route path="/reviews" element={<Reviews user={user} reviews={siteReviews} onAddReview={handleAddReview} />} />

          {/* USER SETTINGS */}
          <Route
            path="/settings"
            element={
              user ? (
                <UserSettings
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteAccount={handleDeleteAccount}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* CLIENT DASHBOARD - Protected */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} orders={orders.filter(o => user.role === 'client' ? true : true)} /> : <Navigate to="/login" />}
          />

          {/* ADMIN DASHBOARD - Strictly Protected */}
          <Route
            path="/admin-dashboard"
            element={
              user?.role === 'admin' ? (
                <AdminDashboard
                  user={user}
                  services={services}
                  orders={orders}
                  users={registeredUsers}
                  messages={messages}
                  reviews={siteReviews}
                  onUpdateService={handleUpdateService}
                  onDeleteService={handleDeleteService}
                  onAddService={handleAddService}
                  onUpdateOrder={handleUpdateOrder}
                  appName={siteName}
                  onUpdateAppName={setSiteName}
                  onSendMessage={handleAdminSendMessage}
                  onMarkAsRead={handleMarkAsRead}
                  onDeleteReview={handleDeleteReview}
                />
              ) : (
                <Navigate to={user ? "/dashboard" : "/login"} replace />
              )
            }
          />

          <Route path="/login" element={<AuthPage onAuth={handleAuth} />} />
          <Route path="/register" element={<AuthPage onAuth={handleAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
      <ChatWidget user={user} messages={messages} onSendMessage={handleSendMessage} />
      {showVerifyModal && (
        <VerificationModal
          email={pendingVerificationEmail}
          onVerify={handleVerify}
          onResend={handleResendCode}
          onClose={() => setShowVerifyModal(false)}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
