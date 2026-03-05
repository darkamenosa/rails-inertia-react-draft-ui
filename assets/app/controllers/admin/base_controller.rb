# frozen_string_literal: true

module Admin
  class BaseController < InertiaController
    include Pagy::Method

    private

      # Pagination helper - returns hash for Inertia props
      # Usage: pagination_props(pagy) => { page: 1, perPage: 25, total: 100, ... }
      def pagination_props(pagy)
        {
          page: pagy.page,
          per_page: pagy.limit,
          total: pagy.count,
          pages: pagy.last,
          from: pagy.from,
          to: pagy.to,
          has_previous: pagy.previous.present?,
          has_next: pagy.next.present?
        }
      end

      # Parse Inertia-serialized array from params
      # Inertia.js serializes arrays as indexed hashes: { "0" => {...}, "1" => {...} }
      # This helper converts them back to proper arrays
      def parse_inertia_array(data, permitted_keys)
        return [] if data.blank?

        array_data = if data.is_a?(Hash)
          data.keys.sort_by(&:to_i).map { |k| data[k] }
        else
          data.to_a
        end

        array_data.filter_map do |item|
          next unless item.respond_to?(:permit)

          item.permit(*permitted_keys).to_h.symbolize_keys
        end
      end
  end
end
