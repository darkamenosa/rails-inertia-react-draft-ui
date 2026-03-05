# frozen_string_literal: true

class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  # Global error handling
  rescue_from StandardError, with: :handle_internal_error
  rescue_from ActionController::RoutingError, ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActionController::InvalidAuthenticityToken, with: :handle_session_expired
  rescue_from ActionController::UnknownFormat, with: :handle_unknown_format

  private

    def current_user
      nil # Will be implemented in auth skill
    end
    helper_method :current_user

    # Error handlers
    def handle_internal_error(exception)
      raise exception unless Rails.env.production?

      Rails.logger.error(exception.full_message)
      render_error_page(500, "Server Error", "Something went wrong on our end. We're working on it.")
    end

    def handle_not_found(_exception = nil)
      render_error_page(404, "Page Not Found", "The page you're looking for doesn't exist or has been moved.")
    end

    def handle_session_expired(_exception = nil)
      render_error_page(419, "Session Expired", "Your session has expired. Please refresh the page and try again.")
    end

    def handle_unknown_format(_exception = nil)
      render_error_page(406, "Not Acceptable", "The requested format is not supported.")
    end

    def render_error_page(status, title, message)
      component = if request.path.start_with?("/admin")
        "admin/errors/show"
      elsif request.path.start_with?("/app")
        "app/errors/show"
      else
        "errors/show"
      end

      respond_to do |format|
        format.html { render inertia: component, props: { status:, title:, message: }, status: }
        format.json { render json: { error: message, status: }, status: }
        format.any { head status }
      end
    end
end
