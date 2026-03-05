# frozen_string_literal: true

module App
  class SettingsController < BaseController
    def show
      render inertia: "app/settings/show"
    end
  end
end
