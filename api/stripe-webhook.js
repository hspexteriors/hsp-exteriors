const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const body = await getRawBody(req);
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const jobId = session.metadata?.jobId;
    const customerName = session.metadata?.customerName;
    const amount = session.amount_total / 100;

    if (jobId && process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ status: 'done', paid: true, paid_amount: amount })
        });
      } catch (err) {
        console.error('Supabase update error:', err);
      }
    }

    console.log(`Payment received: $${amount} from ${customerName} for job ${jobId}`);
  }

  res.status(200).json({ received: true });
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}
