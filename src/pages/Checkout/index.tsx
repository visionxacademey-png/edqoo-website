import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import { courses } from '../../data/courses';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Checkout: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, enrollInCourse, isAuthenticated } = useAuth();
  const { removeFromCart } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const course = courses.find((c) => c.id === courseId);

  // If user is not logged in, redirect to login with redirect back to this checkout
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout/${courseId}`);
    }
  }, [isAuthenticated, courseId, navigate]);

  if (!course) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 font-display">Course Not Found</h2>
        <Link to="/courses" className="btn-primary px-5 py-2.5 text-xs font-semibold rounded-lg shadow">
          Back to Courses
        </Link>
      </div>
    );
  }

  const basePrice = course.price;
  const finalPrice = Math.max(0, basePrice - discount);

  // Apply Coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setDiscount(10);
      setCouponSuccess('10$ Welcome discount applied!');
    } else if (code === 'Edqoo60') {
      setCouponError('This course already has a 60% early discount applied to the price!');
    } else {
      setCouponError('Invalid promo code.');
    }
  };

  // Pay and Enroll
  const handlePayAndEnroll = async () => {
    if (!user) return;
    setIsProcessing(true);
    setPaymentError(null);

    // Call payment service launcher
    await paymentService.initiateRazorpayPayment(
      course.id,
      finalPrice,
      course.title,
      user.email,
      user.name,
      async (paymentId) => {
        // SUCCESS CALLBACK
        try {
          console.log('Payment processed successfully with ID:', paymentId);
          // Register enrollment in Auth state (simulates writing to user record)
          await enrollInCourse(course.id);
          // Remove from cart if present
          removeFromCart(course.id);
          setIsProcessing(false);
          // Navigate to classroom / my-courses
          navigate('/dashboard/my-courses');
        } catch (err) {
          setPaymentError('Enrollment database update failed.');
          setIsProcessing(false);
        }
      },
      (errorMsg) => {
        // FAILURE CALLBACK
        setPaymentError(errorMsg);
        setIsProcessing(false);
      }
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-left space-y-1">
          <h1 className="text-2xl font-display font-extrabold text-slate-900">Secure Checkout</h1>
          <p className="text-slate-500 text-xs sm:text-sm">Complete your enrollment below to start learning.</p>
        </div>

        {/* Form Grid: Invoices (7) vs Review (5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Billing & Payment Details (7 cols) */}
          <main className="lg:col-span-7 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            
            {/* Student Account Summary */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600">1</span>
                Student Account
              </h3>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{user?.name}</span>
                  <span className="text-slate-500 block mt-0.5">{user?.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold uppercase tracking-wider text-[9px]">
                  Logged In
                </span>
              </div>
            </div>

            {/* Payment Method selector */}
            <div className="space-y-4 pt-2">
              <h3 className="font-display font-bold text-sm text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600">2</span>
                Payment Method
              </h3>
              
              <div className="border border-royal-blue-200 bg-royal-blue-50/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-royal-blue-900">
                    <CreditCard className="w-4 h-4" />
                    Razorpay Secure Gateway
                  </span>
                  <span className="inline-flex gap-1">
                    <span className="text-[9px] font-bold bg-white text-slate-400 border px-1.5 py-0.5 rounded uppercase">Visa</span>
                    <span className="text-[9px] font-bold bg-white text-slate-400 border px-1.5 py-0.5 rounded uppercase">MC</span>
                    <span className="text-[9px] font-bold bg-white text-slate-400 border px-1.5 py-0.5 rounded uppercase">UPI</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Secure single-click checkout via cards, mobile wallets, or local banking interfaces. We do not store financial credentials.
                </p>
              </div>
            </div>

            {/* Payment actions block */}
            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handlePayAndEnroll}
                disabled={isProcessing}
                className="btn-primary w-full py-3.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay & Enroll ({finalPrice})
                  </>
                )}
              </button>
              <span className="text-[10px] text-slate-400 font-semibold block text-center mt-2.5 uppercase tracking-wider">
                🔒 256-Bit SSL Encrypted Connection
              </span>
            </div>
          </main>

          {/* Invoice Summary sidebar (5 cols) */}
          <aside className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="font-display font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Order Summary
            </h3>

            {/* Course row info */}
            <div className="flex gap-4 border-b border-slate-100 pb-4">
              <img
                src={course.image}
                alt={course.title}
                className="w-16 h-12 rounded object-cover border border-slate-100 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-royal-blue-900 tracking-wider">
                  {course.category}
                </span>
                <span className="font-display font-bold text-xs text-slate-900 block leading-tight">
                  {course.title}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{course.duration} Lifetime Access</span>
              </div>
            </div>

            {/* Coupon Promo form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label htmlFor="promo-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="promo-input"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none focus:border-royal-blue-500 text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex-shrink-0"
                >
                  Apply
                </button>
              </div>
              {couponError && <span className="text-[10px] text-red-500 font-semibold block">{couponError}</span>}
              {couponSuccess && <span className="text-[10px] text-emerald-600 font-semibold block">{couponSuccess}</span>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4 font-semibold text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal Price</span>
                <span className="text-slate-800">${course.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-3">
                <span>Final Price</span>
                <span className="text-royal-blue-900 text-base">{finalPrice}</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
