require 'rails_helper'

describe 'user upgrades' do
  describe 'create' do
    let(:params) { { stripe_source_id: 'abc123' } }

    before do
      user = FactoryBot.create(:user)
      login_as(user, scope: :user)
    end

    context 'with no stripe source' do
      let(:params) { {} }

      it 'returns 400' do
        post '/upgrade.json', params: params
        expect(response.status).to eq 400
      end
    end

    context 'with a card error' do
      it 'returns 200 and that card error' do
        card_error_message = 'Insufficient funds.'
        card_error = StripeClient::CardError.new card_error_message
        expect(StripeClient).to receive(:create_customer).and_raise(card_error)

        post '/upgrade.json', params: params
        expect(response.status).to eq 200

        response_json = JSON.parse(response.body)
        expect(response_json).to eq({ 'error' => card_error_message })
      end
    end

    context 'with no error' do
      it 'returns 201 and nil for error' do
        stripe_customer = { 'id' => 'cust_abc123' }
        expect(StripeClient).to receive(:create_customer).and_return(stripe_customer)

        stripe_subscription = { 'id' => 'sub_abc123' }
        expect(StripeClient).to receive(:create_subscription).and_return(stripe_subscription)

        post '/upgrade.json', params: params
        expect(response.status).to eq 201

        response_json = JSON.parse(response.body)
        expect(response_json).to eq({ 'error' => nil })
      end
    end
  end
end
