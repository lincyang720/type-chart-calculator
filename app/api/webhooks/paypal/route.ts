import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: PayPal Webhooks
 * Handles PayPal webhook events
 *
 * Important webhook events:
 * - BILLING.SUBSCRIPTION.ACTIVATED
 * - BILLING.SUBSCRIPTION.CANCELLED
 * - BILLING.SUBSCRIPTION.SUSPENDED
 * - BILLING.SUBSCRIPTION.UPDATED
 * - PAYMENT.SALE.COMPLETED
 * - PAYMENT.SALE.REFUNDED
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    console.log('PayPal webhook received:', eventType);

    // TODO: Verify webhook signature
    // const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    // const verified = await verifyPayPalWebhook(request, webhookId);
    // if (!verified) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    // TODO: Save webhook event to database
    // await db.webhookEvents.create({
    //   data: {
    //     provider: 'paypal',
    //     eventType,
    //     eventData: body,
    //     processed: false,
    //   },
    // });

    // Handle different event types
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(body);
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(body);
        break;

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(body);
        break;

      case 'BILLING.SUBSCRIPTION.UPDATED':
        await handleSubscriptionUpdated(body);
        break;

      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(body);
        break;

      case 'PAYMENT.SALE.REFUNDED':
        await handlePaymentRefunded(body);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionActivated(event: any) {
  const subscriptionId = event.resource.id;
  console.log('Subscription activated:', subscriptionId);

  // TODO: Update subscription status in database
  // await db.subscriptions.update({
  //   where: { providerSubscriptionId: subscriptionId },
  //   data: { status: 'active' },
  // });
}

async function handleSubscriptionCancelled(event: any) {
  const subscriptionId = event.resource.id;
  console.log('Subscription cancelled:', subscriptionId);

  // TODO: Update subscription status in database
  // await db.subscriptions.update({
  //   where: { providerSubscriptionId: subscriptionId },
  //   data: {
  //     status: 'canceled',
  //     canceledAt: new Date(),
  //   },
  // });
}

async function handleSubscriptionSuspended(event: any) {
  const subscriptionId = event.resource.id;
  console.log('Subscription suspended:', subscriptionId);

  // TODO: Update subscription status in database
  // await db.subscriptions.update({
  //   where: { providerSubscriptionId: subscriptionId },
  //   data: { status: 'past_due' },
  // });
}

async function handleSubscriptionUpdated(event: any) {
  const subscriptionId = event.resource.id;
  console.log('Subscription updated:', subscriptionId);

  // TODO: Update subscription details in database
}

async function handlePaymentCompleted(event: any) {
  const saleId = event.resource.id;
  const amount = parseFloat(event.resource.amount.total) * 100; // Convert to cents
  console.log('Payment completed:', saleId, amount);

  // TODO: Record payment in database
  // await db.payments.create({
  //   data: {
  //     provider: 'paypal',
  //     providerPaymentId: saleId,
  //     amount,
  //     currency: event.resource.amount.currency,
  //     status: 'succeeded',
  //   },
  // });
}

async function handlePaymentRefunded(event: any) {
  const saleId = event.resource.sale_id;
  console.log('Payment refunded:', saleId);

  // TODO: Update payment status in database
  // await db.payments.update({
  //   where: { providerPaymentId: saleId },
  //   data: { status: 'refunded' },
  // });
}
