class StripeClient
  class CardError < StandardError; end

  def self.create_customer(args)
    Stripe::Customer.create(args)
  rescue Stripe::CardError => e
    raise CardError e.error.message
  end

  def self.create_subscription(args)
    Stripe::Subscription.create(args)
  end
end
