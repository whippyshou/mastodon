# frozen_string_literal: true

module BrandingHelper
  def logo_as_symbol(version = :icon)
    case version
    when :icon
      _logo_as_symbol_icon
    when :wordmark
      _logo_as_symbol_wordmark
    end
  end

  def _logo_as_symbol_wordmark
    content_tag(:img, nil, src:full_pack_url('media/images/logos/wordmark_dark.png'), alt: 'Whippy Edition', class: 'logo logo--wordmark')
  end

  def _logo_as_symbol_icon
    content_tag(:img, nil, src:full_pack_url('media/images/logos/logo_dark.png'), alt: 'Whippy Edition', class: 'logo logo--icon')
  end

  def render_logo
    content_tag(:img, nil, src:full_pack_url('media/images/logos/logo_dark.png'), alt: 'Whippy Edition', class: 'logo logo--icon')
  end

  def render_symbol(version = :icon)
    path = case version
           when :icon
             'logo-symbol-icon.svg'
           when :wordmark
             'logo-symbol-wordmark.svg'
           end

    render(file: Rails.root.join('app', 'javascript', 'images', path)).html_safe # rubocop:disable Rails/OutputSafety
  end
end
