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
        mock_upgrade = double(:mock_upgrade, process: nil, as_json: { error: card_error_message }, errors: true)
        expect(UserUpgrade).to receive(:new).and_return(mock_upgrade)

        post '/upgrade.json', params: params
        expect(response.status).to eq 200

        response_json = JSON.parse(response.body)
        expect(response_json).to eq({ 'error' => card_error_message })
      end
    end

    context 'with no error' do
      it 'returns 201 and nil for error' do
        mock_upgrade = double(:mock_upgrade, process: nil, as_json: { error: nil }, errors: nil)
        expect(UserUpgrade).to receive(:new).and_return(mock_upgrade)

        post '/upgrade.json', params: params
        expect(response.status).to eq 201

        response_json = JSON.parse(response.body)
        expect(response_json).to eq({ 'error' => nil })
      end
    end
  end
end
