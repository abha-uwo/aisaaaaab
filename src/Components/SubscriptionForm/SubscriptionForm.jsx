import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toggleState, userData } from '../../userStore/userData';
import { motion } from 'motion/react';
import { apis } from '../../types';
import axios from 'axios';

const SubscriptionForm = ({ id }) => {
  const [subscripTgl, setSubscripTgl] = useRecoilState(toggleState);
  const currentUserData = useRecoilValue(userData);
  const user = currentUserData.user;
  const userId = user?.id || user?._id;

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [agent, setAgent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`${apis.agents}/${id}`);
        setAgent(res.data);
      } catch (err) {
        console.error("Error fetching agent details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAgent();
  }, [id]);

  const defaultPlans = [
    { id: 'free', name: 'Free', price: 0, desc: 'Ideal for trying out the agent capabilities.' },
    { id: 'monthly', name: 'Monthly plan', price: 49, desc: 'Best for power users and frequent tasks.' },
    { id: 'annual', name: 'Annual plan', price: 228, desc: '₹19/month billed in a year', reduction: 'Save 20%' }
  ];

  const plans = agent?.pricing?.plans?.length > 0 ? agent.pricing.plans : defaultPlans;

  function buyAgent(e) {
    e.preventDefault();
    if (isProcessing) return;

    if (!userId) {
      console.error("User ID missing or not logged in");
      return;
    }

    const form = e.target.closest('form');
    const selectedValue = form.querySelector('input[name="plan"]:checked')?.value;

    // Find matching plan by ID, _id, or lowercase name
    const selectedPlan = plans.find(p =>
      (p.id && String(p.id) === selectedValue) ||
      (p._id && String(p._id) === selectedValue) ||
      (p.name && p.name.toLowerCase() === String(selectedValue).toLowerCase())
    );

    const amount = selectedPlan ? selectedPlan.price : 0;
    const planName = selectedPlan?.name || selectedValue;

    if (amount === 0) {
      axios.post(`${apis.buyAgent}/${id}`, { userId })
        .then(() => setSubscripTgl({ ...subscripTgl, subscripPgTgl: false, notify: true }))
        .catch(err => console.error(err));
      return;
    }

    setIsProcessing(true);

    // 1. Create Order on Backend
    axios.post(apis.createOrder, {
      amount,
      agentId: id,
      plan: planName
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        const { orderId, currency, keyId } = res.data;

        // 2. Open Razorpay Checkout
        const options = {
          key: keyId,
          amount: amount * 100,
          currency: currency,
          name: "AI-MALL",
          description: `Subscription for Agent ${agent?.agentName || id}`,
          order_id: orderId,
          handler: function (response) {
            // 3. Verify Payment on Backend
            axios.post(apis.verifyPayment, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              agentId: id,
              amount,
              plan: planName
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
              .then(() => {
                setSubscripTgl({ ...subscripTgl, subscripPgTgl: false, notify: true });
              })
              .catch(err => {
                console.error("Verification failed", err);
                alert("Payment verification failed. Please contact support.");
              });
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#2563eb",
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      })
      .catch(err => {
        console.error("Order creation failed", err);
        const errorMsg = err.response?.data?.error || err.message || "Order creation failed. Check backend console and .env keys.";

        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Your session has expired. Please log in again.");
          window.location.href = '/login';
          return;
        }

        alert(errorMsg);
      })
      .finally(() => setIsProcessing(false));
  }

  return (
    <div className='fixed inset-0 z-[100] flex justify-center items-center p-4 bg-white/5 dark:bg-black/10 backdrop-blur-md transition-all'>
      <StyledWrapper>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
          <form className="plan-chooser">
            <div className='flex justify-end items-center'>
              <button
                type="button"
                onClick={() => setSubscripTgl({ ...subscripTgl, subscripPgTgl: false })}
                className="hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="header">
              <span className="title">Choose your plan</span>
              <p className="desc">{agent?.agentName ? `Select a plan for ${agent.agentName}` : 'Select a subscription plan that works for you.'}</p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                <p className="text-sm text-subtext">Fetching plans...</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {plans.map((plan, index) => (
                    <div className="plan-option" key={plan.id || plan._id || index}>
                      <input
                        defaultValue={plan.id || plan._id || plan.name.toLowerCase()}
                        id={plan.id || plan._id || `plan-${index}`}
                        name="plan"
                        type="radio"
                        defaultChecked={index === 1}
                      />
                      <label htmlFor={plan.id || plan._id || `plan-${index}`}>
                        <div className="plan-info">
                          <span className="plan-cost">₹{plan.price}</span>
                          <span className="plan-name">{plan.name}</span>
                          {plan.desc && <span className="text-[10px] text-subtext mt-1">{plan.desc}</span>}
                        </div>
                        {plan.reduction && <span className="reduction">{plan.reduction}</span>}
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={buyAgent}
                  disabled={isProcessing}
                  className={`choose-btn ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  title="Start subscription"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : 'Start'}
                </button>
              </>
            )}
          </form>
        </motion.div>
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  .plan-chooser {
    background-color: rgba(255, 255, 255, 1);
    width: 100%;
    max-width: 320px;
    border-radius: 20px;
    padding: 24px;
    color: #000;
    box-shadow: 0px 20px 50px rgba(0,0,0,0.15);
  }

  .header {
    text-align: center;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #111;
  }

  .desc {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }

  .plan-option {
    margin-bottom: 12px;
  }

  .plan-option label {
    cursor: pointer;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    background-color: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    transition: all 0.2s ease;
  }

  .plan-info {
    display: flex;
    flex-direction: column;
  }

  .plan-cost {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111;
  }

  .plan-name {
    font-size: 0.75rem;
    color: #64748b;
  }

  .reduction {
    background-color: #dcfce7;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #166534;
  }

  .plan-option input:checked + label {
    border-color: #2563eb;
    background-color: #eff6ff;
  }

  .choose-btn {
    width: 100%;
    margin-top: 8px;
    padding: 14px;
    border-radius: 12px;
    background-color: #2563eb;
    font-weight: 700;
    color: #fff;
    transition: all 0.2s ease;
  }

  .choose-btn:hover {
    background-color: #1d4ed8;
  }

  .plan-option input {
    display: none;
  }
`;

export default SubscriptionForm;
