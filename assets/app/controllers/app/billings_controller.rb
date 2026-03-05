# frozen_string_literal: true

module App
  class BillingsController < BaseController
    def show
      render inertia: "app/billing/show"
    end
  end
end
