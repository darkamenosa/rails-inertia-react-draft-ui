# frozen_string_literal: true

module Admin
  class UsersController < BaseController
    def index
      render inertia: "admin/users/index", props: {
        users: []
      }
    end
  end
end
