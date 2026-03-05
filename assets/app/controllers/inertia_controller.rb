# frozen_string_literal: true

class InertiaController < ApplicationController
  include InertiaFlash
  include InertiaUtils

  # Share data with all Inertia responses
  inertia_share current_user: -> { current_user_props }

  private

    def current_user_props
      nil # Will be implemented in auth skill
    end
end
