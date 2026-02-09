import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getPayBrightTransaction } from '../../lib/paybright';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'authorized' | 'completed' | 'pending' | 'failed' | 'unknown'>('unknown');
  const [transaction, setTransaction] = useState<any>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionId) {
      checkPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [transactionId]);

  const checkPaymentStatus = async () => {
    if (!transactionId) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = await getPayBrightTransaction(transactionId);

      if (result.success && result.transaction) {
        setTransaction(result.transaction);
        setStatus(result.transaction.status);

        if ((result.transaction.status === 'authorized' || result.transaction.status === 'completed')
            && result.transaction.reference_table === 'deals') {
          await completePurchase(result.transaction);
        }
      } else {
        setStatus('unknown');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('unknown');
    } finally {
      setLoading(false);
    }
  };

  const completePurchase = async (txn: any) => {
    try {
      if (!txn.reference_id || txn.reference_table !== 'deals') {
        setError('Invalid purchase reference. Please contact support.');
        setStatus('error');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('You must be logged in to complete this purchase. Please log in and try again.');
        setStatus('error');
        return;
      }

      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) {
        setError('Error loading customer profile. Please try again or contact support.');
        setStatus('error');
        return;
      }

      let customerId = customerData?.id;

      if (!customerId) {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({ user_id: user.id })
          .select('id')
          .single();

        if (createError) {
          setError('Error creating customer profile. Please contact support.');
          setStatus('error');
          return;
        }

        customerId = newCustomer?.id;
      }

      if (!customerId) {
        setError('Could not create customer profile. Please contact support.');
        setStatus('error');
        return;
      }

      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('paybright_transaction_id', txn.id)
        .maybeSingle();

      if (existingPurchase) {
        console.log('Purchase already exists');
        setPurchaseId(existingPurchase.id);
        return;
      }

      const quantity = parseInt(txn.metadata?.quantity) || 1;
      const amountPaidCents = txn.amount_cents;
      const commissionCents = Math.round(amountPaidCents * 0.30);
      const merchantPayoutCents = amountPaidCents - commissionCents;

      const { data: deal, error: dealError } = await supabase
        .from('deals')
        .select('title, quantity_sold, merchant_id')
        .eq('id', txn.reference_id)
        .single();

      if (dealError || !deal) {
        console.error('Error fetching deal:', dealError);
        return;
      }

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          customer_id: customerId,
          deal_id: txn.reference_id,
          quantity,
          amount_paid_cents: amountPaidCents,
          commission_cents: commissionCents,
          merchant_payout_cents: merchantPayoutCents,
          status: 'paid',
          payment_method: 'paybright',
          paybright_transaction_id: txn.id,
        })
        .select('id')
        .single();

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError);
        return;
      }

      if (purchase) {
        setPurchaseId(purchase.id);
      }

      const { error: dealUpdateError } = await supabase
        .from('deals')
        .update({ quantity_sold: deal.quantity_sold + quantity })
        .eq('id', txn.reference_id);

      if (dealUpdateError) {
        console.error('Error updating deal quantity:', dealUpdateError);
      }

      const pointsEarned = Math.floor(amountPaidCents / 100);
      const { error: loyaltyError } = await supabase
        .from('loyalty_events')
        .insert({
          customer_id: customerId,
          source: 'deal_purchase',
          points: pointsEarned,
          description: `Purchased ${deal?.title || 'deal'}`,
        });

      if (loyaltyError) {
        console.error('Error awarding loyalty points:', loyaltyError);
      }

      const { error: txUpdateError } = await supabase
        .from('paybright_transactions')
        .update({
          status: 'completed',
          capture_date: new Date().toISOString(),
          customer_id: customerId
        })
        .eq('id', txn.id);

      if (txUpdateError) {
        console.error('Error updating transaction:', txUpdateError);
      }

      console.log('Purchase completed successfully:', purchase?.id);
    } catch (error) {
      console.error('Error completing purchase:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-12">
          <Card variant="elevated">
            <CardBody className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#2BB673] mb-4"></div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Processing Payment
              </h2>
              <p className="text-slate-600">
                Please wait while we confirm your payment...
              </p>
            </CardBody>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-12">
        {status === 'authorized' || status === 'completed' ? (
          <Card variant="elevated">
            <CardBody className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Payment Successful!
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Your payment has been processed successfully.
              </p>

              {transaction && (
                <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-slate-900 mb-4">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Amount:</span>
                      <span className="text-slate-900 font-medium">
                        ${(transaction.amount_cents / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reference:</span>
                      <span className="text-slate-900 font-mono text-xs">
                        {transaction.paybright_reference}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="text-green-600 font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                {purchaseId ? (
                  <Button onClick={() => navigate(`/purchase/${purchaseId}`)}>
                    View Purchase Details
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/purchases')}>
                    View My Purchases
                  </Button>
                )}
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Browse More Deals
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : status === 'pending' ? (
          <Card variant="elevated">
            <CardBody className="text-center py-12">
              <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Payment Pending
              </h2>
              <p className="text-lg text-slate-600 mb-4">
                Your payment is being reviewed.
              </p>
              <p className="text-slate-600 mb-8">
                This usually takes up to 48 hours. We'll send you an email once it's approved.
              </p>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')}>
                  Browse Deals
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : status === 'failed' ? (
          <Card variant="elevated">
            <CardBody className="text-center py-12">
              <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Payment Failed
              </h2>
              <p className="text-lg text-slate-600 mb-4">
                Unfortunately, your payment could not be processed.
              </p>
              {transaction?.failure_reason && (
                <p className="text-sm text-slate-500 mb-8">
                  Reason: {transaction.failure_reason}
                </p>
              )}

              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.history.back()}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Browse Deals
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card variant="elevated">
            <CardBody className="text-center py-12">
              <AlertCircle className="w-20 h-20 text-slate-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Payment Status Unknown
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                We couldn't find information about this transaction.
              </p>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/purchases')}>
                  View My Purchases
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Browse Deals
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
