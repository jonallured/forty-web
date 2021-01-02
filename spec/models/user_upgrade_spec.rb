require 'rails_helper'

describe UserUpgrade do
  let(:user) { FactoryBot.create :user }
  let(:stripe_source_id) { 'source_abc123' }

  context 'with a good stripe id' do
    it 'creates stripe records and updates our records' do
      upgrade = UserUpgrade.new(user, stripe_source_id)

      stripe_customer = { 'id' => 'cust_abc123' }
      expect(StripeClient).to receive(:create_customer).and_return(stripe_customer)

      stripe_subscription = { 'id' => 'sub_abc123' }
      expect(StripeClient).to receive(:create_subscription).and_return(stripe_subscription)

      upgrade.process

      expect(upgrade.error).to be_nil
      expect(user.stripe_customer_id).to eq stripe_customer['id']

      subscription = user.subscriptions.first
      expect(subscription.stripe_subscription_id).to eq stripe_subscription['id']
    end
  end

  context 'with a card error' do
    it 'skips other steps and sets the error message' do
      upgrade = UserUpgrade.new(user, stripe_source_id)

      card_error = StripeClient::CardError.new 'Insufficient funds.'
      expect(StripeClient).to receive(:create_customer).and_raise(card_error)
      expect(StripeClient).to_not receive(:create_subscription)

      upgrade.process

      expect(upgrade.error).to eq card_error.message
      expect(user.stripe_customer_id).to be_nil
      expect(user.subscriptions.count).to eq 0
    end
  end

  context 'with a fatal error' do
    it 'does not rescue the error' do
      upgrade = UserUpgrade.new(user, stripe_source_id)

      expect(StripeClient).to receive(:create_customer).and_raise(Stripe::StripeError)
      expect(StripeClient).to_not receive(:create_subscription)

      expect do
        upgrade.process
      end.to raise_error(Stripe::StripeError)

      expect(upgrade.error).to be_nil
      expect(user.stripe_customer_id).to be_nil
      expect(user.subscriptions.count).to eq 0
    end
  end
end
