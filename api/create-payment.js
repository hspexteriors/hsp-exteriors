const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, customerName, customerEmail, jobType, jobId, description } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: jobType || 'Exterior Cleaning Service',
            description: description || `HSP Exterior Cleaning — ${jobType}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      metadata: {
        jobId: jobId || '',
        customerName: customerName || '',
        jobType: jobType || '',
      },
      payment_intent_data: {
        metadata: {
          jobId: jobId || '',
          customerName: customerName || '',
        },
      },
      success_url: `${req.headers.origin || 'https://hsp-exteriors.vercel.app'}/?payment=success&jobId=${jobId || ''}`,
      cancel_url: `${req.headers.origin || 'https://hsp-exteriors.vercel.app'}/?payment=cancelled`,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
