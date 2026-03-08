Rails.application.routes.draw do
  # App (authenticated users)
  namespace :app do
    resource :dashboard, only: :show
    resources :projects, only: [ :index ]
    resource :settings, only: :show
    resource :billing, only: :show
  end
  get "app", to: redirect("/app/dashboard")

  # Admin
  namespace :admin do
    resource :dashboard, only: :show
    resources :users, only: [ :index ]
    resources :webhooks, only: [ :index ]

    namespace :analytics do
      resource :live, only: :show
      resources :reports, only: [ :index ]
    end

    resource :settings, only: :show
    namespace :settings do
      resource :team, only: :show
      resource :billing, only: :show
    end
  end
  get "admin", to: redirect("/admin/dashboard")

  # Mission Control Jobs dashboard (requires mission_control-jobs gem)
  mount MissionControl::Jobs::Engine, at: "/admin/jobs" if defined?(MissionControl::Jobs::Engine)

  # Redirect to localhost from 127.0.0.1
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  # Public pages
  root "pages#home"
  get "about", to: "pages#about"
  get "pricing", to: "pages#pricing"
  get "privacy", to: "pages#privacy"
  get "terms", to: "pages#terms"
  get "contact", to: "pages#contact"

  # Error pages
  get "errors/:status", to: "errors#show", as: :error

  get "up" => "rails/health#show", as: :rails_health_check
end
