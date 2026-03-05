# frozen_string_literal: true

class PagesController < InertiaController
  def home
    render inertia: "pages/home"
  end

  def about
    render inertia: "pages/about"
  end

  def pricing
    render inertia: "pages/pricing"
  end

  def privacy
    render inertia: "pages/privacy"
  end

  def terms
    render inertia: "pages/terms"
  end

  def contact
    render inertia: "pages/contact"
  end
end
